<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Booking extends Model
{
    protected $fillable = [
        'motorcycle_id',
        'customer_name',
        'customer_phone',
        'customer_address',
        'start_date',
        'end_date',
        'total_price',
        'status',
    ];

    public function motorcycle()
    {
        return $this->belongsTo(Motorcycle::class);
    }
}
