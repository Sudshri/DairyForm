<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DeliveryPincode extends Model
{
    use HasFactory;

    protected $fillable = [
        'pincode', 'area_name', 'city', 'state', 'country',
        'delivery_charge', 'free_delivery_above', 'estimated_days',
        'cut_off_time', 'is_active', 'is_express_available',
        'express_charge', 'express_hours',
    ];

    protected $casts = [
        'is_active'            => 'boolean',
        'is_express_available' => 'boolean',
        'delivery_charge'      => 'float',
        'free_delivery_above'  => 'float',
        'express_charge'       => 'float',
    ];
}
