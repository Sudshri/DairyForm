<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class OrderTracking extends Model
{
    protected $table = 'order_tracking';   // non-standard plural

    protected $fillable = [
        'order_id', 'status', 'title', 'message', 'location',
        'courier_name', 'tracking_id', 'tracking_url',
        'updated_by', 'notify_customer',
    ];

    protected $casts = ['notify_customer' => 'boolean'];

    public function order(): BelongsTo { return $this->belongsTo(Order::class); }
}
