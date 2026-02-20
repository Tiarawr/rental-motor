<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Motorcycle extends Model
{
    protected $fillable = [
        'name',
        'brand',
        'type',
        'price_per_day',
        'image_url',
        'status',
        'description',
    ];

    public function bookings()
    {
        return $this->hasMany(Booking::class);
    }
}
