<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;

class Order extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'order_number', 'user_id', 'user_address_id',
        'delivery_name', 'delivery_phone', 'delivery_address',
        'delivery_city', 'delivery_state', 'delivery_pincode', 'delivery_country',
        'sub_total', 'discount_amount', 'coupon_code', 'offer_id',
        'delivery_charge', 'tax_amount', 'total_amount',
        'order_status', 'payment_method', 'payment_status',
        'notes', 'admin_notes', 'cancellation_reason', 'cancelled_by',
        'delivery_agent_id', 'expected_delivery_date',
        'delivered_at', 'cancelled_at',
    ];

    protected $casts = [
        'sub_total'              => 'float',
        'discount_amount'        => 'float',
        'delivery_charge'        => 'float',
        'tax_amount'             => 'float',
        'total_amount'           => 'float',
        'delivered_at'           => 'datetime',
        'cancelled_at'           => 'datetime',
        'expected_delivery_date' => 'datetime',
    ];

    public function user(): BelongsTo       { return $this->belongsTo(User::class); }
    public function address(): BelongsTo    { return $this->belongsTo(UserAddress::class, 'user_address_id'); }
    public function items(): HasMany        { return $this->hasMany(OrderItem::class); }
    public function tracking(): HasMany     { return $this->hasMany(OrderTracking::class)->latest(); }
    public function payment(): HasOne       { return $this->hasOne(Payment::class)->latestOfMany(); }

    public function scopeForUser($query, int $userId)
    {
        return $query->where('user_id', $userId);
    }
}
