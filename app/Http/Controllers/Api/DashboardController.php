<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Booking;
use App\Models\Motorcycle;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /**
     * Display dashboard statistics.
     */
    public function index()
    {
        $today = Carbon::today();
        $thisMonth = Carbon::now()->startOfMonth();

        $dailyRevenue = Booking::whereIn('status', ['Disetujui', 'Selesai'])
            ->whereDate('created_at', $today)
            ->sum('total_price');

        $monthlyRevenue = Booking::whereIn('status', ['Disetujui', 'Selesai'])
            ->where('created_at', '>=', $thisMonth)
            ->sum('total_price');

        $activeBookings = Booking::whereIn('status', ['Menunggu Konfirmasi', 'Disetujui'])->count();

        // Get most rented motorcycle ID using a subquery grouping
        $mostRentedId = Booking::select('motorcycle_id')
            ->selectRaw('COUNT(*) as count')
            ->groupBy('motorcycle_id')
            ->orderByDesc('count')
            ->limit(1)
            ->value('motorcycle_id');

        $mostRentedMotorcycle = $mostRentedId ? Motorcycle::find($mostRentedId) : null;

        return response()->json([
            'status' => 'success',
            'data' => [
                'daily_revenue' => $dailyRevenue,
                'monthly_revenue' => $monthlyRevenue,
                'active_bookings' => $activeBookings,
                'most_rented_motorcycle' => $mostRentedMotorcycle,
            ]
        ]);
    }
}
