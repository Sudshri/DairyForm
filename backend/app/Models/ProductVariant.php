<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ProductVariant extends Model
{
    use HasFactory;

    protected $fillable = [
        'product_id', 'variant_name', 'weight', 'weight_unit',
        'sku', 'barcode', 'mrp_price', 'selling_price', 'purchase_price',
        'total_sales', 'sort_order', 'status',
    ];

    protected $casts = [
        'weight'        => 'float',
        'mrp_price'     => 'float',
        'selling_price' => 'float',
        'purchase_price'=> 'float',
        'total_sales'   => 'integer',
    ];

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function inventory(): HasOne
    {
        return $this->hasOne(ProductVariantInventory::class);
    }

    public function variantOffers(): HasMany
    {
        return $this->hasMany(VariantOffer::class);
    }

    public function activeOffers(): HasMany
    {
        return $this->hasMany(VariantOffer::class)
            ->where('is_active', true)
            ->with(['offer' => fn($q) => $q->where('is_active', true)
                ->where('start_date', '<=', now())
                ->where('end_date', '>=', now())
            ]);
    }

    // Dynamically compute available units from stock in KG
    public function getAvailableUnitsAttribute(): int
    {
        if (! $this->inventory) return 0;
        $available = $this->inventory->stock_kg - $this->inventory->reserved_stock_kg;
        if ($available <= 0 || $this->weight <= 0) return 0;

        $weightInKg = $this->weight_unit === 'kg' ? $this->weight : $this->weight / 1000;
        return (int) floor($available / $weightInKg);
    }

    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }
}
