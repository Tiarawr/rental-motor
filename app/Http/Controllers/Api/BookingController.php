<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Motorcycle;
use Carbon\Carbon;

class BookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $status = $request->query('status');
        $query = Booking::with('motorcycle');
        
        if ($status) {
            $query->where('status', $status);
        }

        return response()->json([
            'status' => 'success',
            'data' => $query->get()
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = \Illuminate\Support\Facades\Validator::make($request->all(), [
            'motorcycle_id' => 'required|exists:motorcycles,id',
            'customer_name' => 'required|string|max:255',
            'customer_phone' => 'required|string|max:20',
            'customer_address' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
        ]);

        if ($validator->fails()) {
            $firstError = collect($validator->errors()->all())->first();
            return response()->json([
                'status' => 'error',
                'message' => $firstError,
                'errors' => $validator->errors()
            ], 422);
        }

        $validated = $validator->validated();

        $motorcycle = Motorcycle::findOrFail($validated['motorcycle_id']);

        if ($motorcycle->status !== 'available') {
            return response()->json([
                'status' => 'error',
                'message' => 'Motorcycle is currently not available for rent.'
            ], 400);
        }

        // Validate date overlap
        $overlappingBooking = Booking::where('motorcycle_id', $validated['motorcycle_id'])
            ->whereIn('status', ['Menunggu Konfirmasi', 'Disetujui'])
            ->where(function ($query) use ($validated) {
                $query->whereBetween('start_date', [$validated['start_date'], $validated['end_date']])
                      ->orWhereBetween('end_date', [$validated['start_date'], $validated['end_date']])
                      ->orWhere(function ($q) use ($validated) {
                          $q->where('start_date', '<=', $validated['start_date'])
                            ->where('end_date', '>=', $validated['end_date']);
                      });
            })
            ->first();

        if ($overlappingBooking) {
            return response()->json([
                'status' => 'error',
                'message' => 'The motorcycle is already booked for the selected dates.'
            ], 422);
        }

        // Calculate total price automatically
        $startDate = Carbon::parse($validated['start_date']);
        $endDate = Carbon::parse($validated['end_date']);
        $days = $startDate->diffInDays($endDate) + 1; // Assuming same day return counts as 1 day
        $validated['total_price'] = $days * $motorcycle->price_per_day;

        $booking = Booking::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking request submitted successfully.',
            'data' => $booking
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $booking = Booking::with('motorcycle')->find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $booking
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found'
            ], 404);
        }

        $validated = $request->validate([
            'status' => 'required|in:Menunggu Konfirmasi,Disetujui,Ditolak,Selesai',
        ]);

        $booking->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Booking status updated successfully.',
            'data' => $booking
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $booking = Booking::find($id);

        if (!$booking) {
            return response()->json([
                'status' => 'error',
                'message' => 'Booking not found'
            ], 404);
        }

        $booking->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Booking deleted successfully'
        ]);
    }
}
