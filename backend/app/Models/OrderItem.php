<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderItem extends Model
{
    protected $fillable = [
        'order_id', 'product_id', 'product_variant_id',
        'product_name', 'variant_name', 'weight', 'weight_unit',
        'sku', 'product_image', 'mrp_price', 'price',
        'discount_amount', 'qty', 'total', 'is_reviewed',
    ];

    protected $casts = [
        'weight'          => 'float',
        'mrp_price'       => 'float',
        'price'           => 'float',
        'discount_amount' => 'float',
        'total'           => 'float',
        'is_reviewed'     => 'boolean',
    ];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
}
