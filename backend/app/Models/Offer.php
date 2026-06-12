<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Offer extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'offer_name', 'offer_code', 'description', 'offer_type',
        'discount_value', 'min_order_amount', 'max_discount_amount',
        'applicable_category_id', 'start_date', 'end_date',
        'is_active', 'usage_limit', 'used_count', 'per_user_limit',
        'is_public', 'banner_image',
    ];

    protected $casts = [
        'start_date'          => 'datetime',
        'end_date'            => 'datetime',
        'is_active'           => 'boolean',
        'is_public'           => 'boolean',
        'discount_value'      => 'float',
        'min_order_amount'    => 'float',
        'max_discount_amount' => 'float',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class, 'applicable_category_id');
    }

    public function variantOffers(): HasMany
    {
        return $this->hasMany(VariantOffer::class);
    }

    public function isValid(): bool
    {
        return $this->is_active
            && now()->between($this->start_date, $this->end_date)
            && (is_null($this->usage_limit) || $this->used_count < $this->usage_limit);
    }

    public function calculateDiscount(float $price): float
    {
        return match ($this->offer_type) {
            'percentage' => min(
                $price * ($this->discount_value / 100),
                $this->max_discount_amount ?? PHP_FLOAT_MAX
            ),
            'fixed'      => min($this->discount_value, $price),
            default      => 0,
        };
    }
}
