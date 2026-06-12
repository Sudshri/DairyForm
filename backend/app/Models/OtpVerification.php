<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class OtpVerification extends Model
{
    protected $fillable = [
        'phone', 'otp', 'purpose', 'is_verified',
        'attempts', 'expires_at', 'verified_at', 'ip_address',
    ];

    protected $casts = [
        'is_verified' => 'boolean',
        'expires_at'  => 'datetime',
        'verified_at' => 'datetime',
    ];

    protected $hidden = ['otp'];
}
