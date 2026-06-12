<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductVariantInventory extends Model
{
    use HasFactory;

    protected $table = 'product_variant_inventory';

    protected $fillable = [
        'product_variant_id', 'stock_kg', 'reserved_stock_kg',
        'low_stock_alert_kg', 'reorder_level_kg', 'max_stock_kg',
        'stock_status', 'last_restocked_at',
    ];

    protected $casts = [
        'stock_kg'           => 'float',
        'reserved_stock_kg'  => 'float',
        'low_stock_alert_kg' => 'float',
        'reorder_level_kg'   => 'float',
        'max_stock_kg'       => 'float',
        'last_restocked_at'  => 'datetime',
    ];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function getAvailableKgAttribute(): float
    {
        return max(0, $this->stock_kg - $this->reserved_stock_kg);
    }
}
