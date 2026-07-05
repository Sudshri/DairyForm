<?php

namespace App\Models;

use App\Helpers\StorageHelper;
use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $fillable = [
        'title', 'subtitle', 'image', 'mobile_image', 'alt_text',
        'banner_type', 'link_type', 'link_id', 'link_url',
        'cta_text', 'sort_order', 'is_active', 'open_in_new_tab',
        'start_date', 'end_date',
    ];

    protected $casts = [
        'is_active'       => 'boolean',
        'open_in_new_tab' => 'boolean',
        'start_date'      => 'datetime',
        'end_date'        => 'datetime',
    ];

    // Classic getter — runs ONLY on read, never touches writes
    public function getImageAttribute($value): ?string
    {
        return StorageHelper::fullUrl($value);
    }

    public function getMobileImageAttribute($value): ?string
    {
        return StorageHelper::fullUrl($value);
    }
}
