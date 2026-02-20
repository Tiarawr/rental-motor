<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Motorcycle;

class MotorcycleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $motorcycles = Motorcycle::all();
        return response()->json([
            'status' => 'success',
            'data' => $motorcycles
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'brand' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'price_per_day' => 'required|numeric|min:0',
            'image_url' => 'nullable|url',
            'status' => 'in:available,unavailable',
            'description' => 'nullable|string',
        ]);

        $motorcycle = Motorcycle::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Motorcycle created successfully',
            'data' => $motorcycle
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $motorcycle = Motorcycle::find($id);

        if (!$motorcycle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Motorcycle not found'
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $motorcycle
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $motorcycle = Motorcycle::find($id);

        if (!$motorcycle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Motorcycle not found'
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'brand' => 'sometimes|required|string|max:255',
            'type' => 'sometimes|required|string|max:255',
            'price_per_day' => 'sometimes|required|numeric|min:0',
            'image_url' => 'nullable|url',
            'status' => 'in:available,unavailable',
            'description' => 'nullable|string',
        ]);

        $motorcycle->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Motorcycle updated successfully',
            'data' => $motorcycle
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $motorcycle = Motorcycle::find($id);

        if (!$motorcycle) {
            return response()->json([
                'status' => 'error',
                'message' => 'Motorcycle not found'
            ], 404);
        }

        $motorcycle->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Motorcycle deleted successfully'
        ]);
    }
}
