<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class Review extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'user_id', 'product_id', 'order_item_id',
        'rating', 'title', 'comment', 'images',
        'is_verified_purchase', 'is_approved', 'is_featured', 'helpful_count',
    ];

    protected $casts = [
        'images'               => 'array',
        'is_verified_purchase' => 'boolean',
        'is_approved'          => 'boolean',
        'is_featured'          => 'boolean',
        'rating'               => 'integer',
    ];

    public function user(): BelongsTo    { return $this->belongsTo(User::class); }
    public function product(): BelongsTo { return $this->belongsTo(Product::class); }

    public function scopeApproved($query) { return $query->where('is_approved', true); }
}
