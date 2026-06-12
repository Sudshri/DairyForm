<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class VariantOffer extends Model
{
    protected $fillable = ['product_variant_id', 'offer_id', 'is_active'];

    protected $casts = ['is_active' => 'boolean'];

    public function variant(): BelongsTo
    {
        return $this->belongsTo(ProductVariant::class, 'product_variant_id');
    }

    public function offer(): BelongsTo
    {
        return $this->belongsTo(Offer::class);
    }
}
