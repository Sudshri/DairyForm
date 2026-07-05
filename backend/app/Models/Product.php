<?php

namespace App\Models;

use App\Helpers\StorageHelper;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'category_id', 'product_name', 'slug', 'short_description',
        'description', 'image', 'meta_title', 'meta_description',
        'is_trending', 'is_featured', 'total_views', 'total_sales', 'status',
    ];

    protected $casts = [
        'is_trending' => 'boolean',
        'is_featured' => 'boolean',
        'total_views' => 'integer',
        'total_sales' => 'integer',
    ];

    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }

    public function variants(): HasMany
    {
        return $this->hasMany(ProductVariant::class);
    }

    public function images(): HasMany
    {
        return $this->hasMany(ProductImage::class)->orderBy('sort_order');
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function views(): HasMany
    {
        return $this->hasMany(ProductView::class);
    }

    public function getImageAttribute($value): ?string
    {
        return StorageHelper::fullUrl($value);
    }

    // Scope: active products only
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    // Scope: FULLTEXT search
    public function scopeSearch($query, string $term)
    {
        return $query->whereRaw(
            'MATCH(product_name, short_description, description) AGAINST(? IN BOOLEAN MODE)',
            ["+{$term}*"]
        );
    }
}
