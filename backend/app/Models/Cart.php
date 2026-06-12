<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Cart extends Model
{
    protected $fillable = ['user_id', 'product_id', 'product_variant_id', 'qty', 'price'];

    protected $casts = ['price' => 'float', 'qty' => 'integer'];

    public function user(): BelongsTo     { return $this->belongsTo(User::class); }
    public function product(): BelongsTo  { return $this->belongsTo(Product::class); }
    public function variant(): BelongsTo  { return $this->belongsTo(ProductVariant::class, 'product_variant_id'); }

    public function getSubtotalAttribute(): float
    {
        return $this->variant ? $this->variant->selling_price * $this->qty : $this->price * $this->qty;
    }
}
