<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderTracking;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $orders = Order::with(['user:id,name,phone'])
            ->when($request->input('order_status'), fn($q, $v) => $q->where('order_status', $v))
            ->when($request->input('payment_status'), fn($q, $v) => $q->where('payment_status', $v))
            ->when($request->input('search'), fn($q, $v) =>
                $q->where('order_number', 'like', "%{$v}%")
                  ->orWhere('delivery_phone', 'like', "%{$v}%")
                  ->orWhere('delivery_name', 'like', "%{$v}%")
            )
            ->when($request->input('date_from'), fn($q, $v) => $q->whereDate('created_at', '>=', $v))
            ->when($request->input('date_to'),   fn($q, $v) => $q->whereDate('created_at', '<=', $v))
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 15));

        return $this->paginated($orders);
    }

    public function show(int $id): JsonResponse
    {
        $order = Order::with([
            'user:id,name,phone,email',
            'items',
            'tracking' => fn($q) => $q->latest(),
            'payment',
        ])->findOrFail($id);

        return $this->success($order);
    }

    /** PATCH /admin/orders/{id}/status */
    public function updateStatus(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status'          => ['required', 'in:confirmed,processing,dispatched,out_for_delivery,delivered,cancelled,returned,refunded'],
            'message'         => ['nullable', 'string', 'max:300'],
            'location'        => ['nullable', 'string', 'max:200'],
            'courier_name'    => ['nullable', 'string', 'max:100'],
            'tracking_id'     => ['nullable', 'string', 'max:100'],
            'tracking_url'    => ['nullable', 'url', 'max:500'],
            'notify_customer' => ['nullable', 'boolean'],
        ]);

        $order = Order::findOrFail($id);

        $order->update([
            'order_status' => $data['status'],
            'delivered_at' => $data['status'] === 'delivered' ? now() : $order->delivered_at,
            'cancelled_at' => $data['status'] === 'cancelled' ? now() : $order->cancelled_at,
        ]);

        // Auto-update payment status on delivery for COD
        if ($data['status'] === 'delivered' && $order->payment_method === 'cod') {
            $order->update(['payment_status' => 'paid']);
            $order->payment?->update(['status' => 'success', 'paid_at' => now()]);
        }

        OrderTracking::create([
            'order_id'        => $order->id,
            'status'          => $data['status'],
            'title'           => ucwords(str_replace('_', ' ', $data['status'])),
            'message'         => $data['message'] ?? null,
            'location'        => $data['location'] ?? null,
            'courier_name'    => $data['courier_name'] ?? null,
            'tracking_id'     => $data['tracking_id'] ?? null,
            'tracking_url'    => $data['tracking_url'] ?? null,
            'updated_by'      => $request->user()->id,
            'notify_customer' => $data['notify_customer'] ?? true,
        ]);

        return $this->success($order->fresh(['tracking' => fn($q) => $q->latest()]), 'Order status updated.');
    }

    /** POST /admin/orders/{id}/add-tracking */
    public function addTracking(Request $request, int $id): JsonResponse
    {
        $data = $request->validate([
            'status'          => ['required', 'in:confirmed,processing,dispatched,out_for_delivery,delivered,cancelled,returned'],
            'title'           => ['nullable', 'string', 'max:150'],
            'message'         => ['nullable', 'string', 'max:300'],
            'location'        => ['nullable', 'string', 'max:200'],
            'courier_name'    => ['nullable', 'string', 'max:100'],
            'tracking_id'     => ['nullable', 'string', 'max:100'],
            'notify_customer' => ['nullable', 'boolean'],
        ]);

        $tracking = OrderTracking::create([
            ...$data,
            'order_id'   => $id,
            'updated_by' => $request->user()->id,
        ]);

        return $this->created($tracking, 'Tracking added.');
    }
}
