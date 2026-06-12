<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Payment extends Model
{
    protected $fillable = [
        'payment_reference', 'order_id', 'user_id',
        'payment_gateway', 'gateway_order_id', 'gateway_payment_id', 'gateway_signature',
        'amount', 'currency', 'status',
        'gateway_response', 'failure_reason',
        'refund_amount', 'refund_id', 'refunded_at',
        'paid_at', 'payment_mode',
    ];

    protected $casts = [
        'amount'           => 'float',
        'refund_amount'    => 'float',
        'gateway_response' => 'array',
        'paid_at'          => 'datetime',
        'refunded_at'      => 'datetime',
    ];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
    public function user(): BelongsTo  { return $this->belongsTo(User::class); }
}
