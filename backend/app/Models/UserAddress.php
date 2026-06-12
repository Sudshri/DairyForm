<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserAddress extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id', 'full_name', 'phone', 'alternate_phone',
        'address_line1', 'address_line2', 'landmark',
        'city', 'state', 'pincode', 'country',
        'address_type', 'address_label',
        'latitude', 'longitude', 'is_default',
    ];

    protected $casts = [
        'is_default' => 'boolean',
        'latitude'   => 'float',
        'longitude'  => 'float',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
