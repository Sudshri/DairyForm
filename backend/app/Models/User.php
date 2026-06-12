<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes;

    protected $fillable = [
        'name', 'email', 'phone', 'password',
        'avatar', 'gender', 'date_of_birth',
        'role', 'is_active', 'fcm_token',
        'email_verified_at', 'phone_verified_at', 'last_login_at',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at'  => 'datetime',
        'phone_verified_at'  => 'datetime',
        'last_login_at'      => 'datetime',
        'date_of_birth'      => 'date',
        'is_active'          => 'boolean',
        'password'           => 'hashed',
    ];

    // ── Role helpers (enum-based, no extra package) ──────────────────────
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    public function isCustomer(): bool
    {
        return $this->role === 'customer';
    }

    public function isDeliveryAgent(): bool
    {
        return $this->role === 'delivery_agent';
    }

    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    // ── Relationships ────────────────────────────────────────────────────
    public function addresses(): HasMany
    {
        return $this->hasMany(UserAddress::class);
    }

    public function orders(): HasMany
    {
        return $this->hasMany(Order::class);
    }

    public function cart(): HasMany
    {
        return $this->hasMany(Cart::class);
    }

    public function wishlist(): HasMany
    {
        return $this->hasMany(Wishlist::class);
    }

    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }
}
