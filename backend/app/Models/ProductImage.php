<?php

namespace App\Models;

use App\Helpers\StorageHelper;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProductImage extends Model
{
    protected $fillable = [
        'product_id', 'image_path', 'thumbnail_path',
        'alt_text', 'sort_order', 'is_primary',
    ];

    protected $casts = ['is_primary' => 'boolean'];

    public function getImagePathAttribute($value): ?string
    {
        return StorageHelper::fullUrl($value);
    }

    public function getThumbnailPathAttribute($value): ?string
    {
        return StorageHelper::fullUrl($value);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
