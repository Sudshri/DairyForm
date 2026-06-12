<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Offer;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Payment;
use App\Models\ProductVariantInventory;
use App\Models\UserAddress;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class OrderController extends Controller
{
    /** GET /orders */
    public function index(Request $request): JsonResponse
    {
        $orders = Order::where('user_id', $request->user()->id)
            ->when($request->status, fn($q, $v) => $q->where('order_status', $v))
            ->with(['items', 'payment'])
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        return $this->paginated($orders);
    }

    /** POST /orders — place a new order from the cart */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'user_address_id' => ['required', 'integer'],
            'payment_method'  => ['required', 'in:razorpay,stripe,cod,wallet'],
            'coupon_code'     => ['nullable', 'string'],
            'notes'           => ['nullable', 'string', 'max:500'],
        ]);

        $user    = $request->user();
        $address = UserAddress::where('user_id', $user->id)->findOrFail($data['user_address_id']);
        $cartItems = Cart::where('user_id', $user->id)
            ->with(['product', 'variant.inventory'])
            ->get();

        if ($cartItems->isEmpty()) {
            return $this->error('Your cart is empty.', 422);
        }

        // Validate coupon
        $offer    = null;
        $discount = 0;
        if ($request->coupon_code) {
            $offer = Offer::where('offer_code', $request->coupon_code)
                ->where('is_active', true)
                ->where('start_date', '<=', now())
                ->where('end_date', '>=', now())
                ->first();

            if (! $offer) {
                return $this->error('Invalid or expired coupon.', 422);
            }
        }

        return DB::transaction(function () use ($user, $address, $cartItems, $data, $offer, &$discount) {
            $subTotal = 0;

            // Build order items + validate + reserve inventory
            $lineItems = $cartItems->map(function ($item) use (&$subTotal) {
                $variant   = $item->variant;
                $inventory = $variant->inventory;

                if (! $inventory || $variant->available_units < $item->qty) {
                    throw new \RuntimeException("Insufficient stock for: {$item->product->product_name} ({$variant->variant_name})");
                }

                $price   = $variant->selling_price;
                $total   = round($price * $item->qty, 2);
                $subTotal += $total;

                // Reserve stock
                $weightInKg = $variant->weight_unit === 'kg'
                    ? $variant->weight
                    : $variant->weight / 1000;
                $inventory->increment('reserved_stock_kg', $weightInKg * $item->qty);

                return [
                    'product_id'         => $item->product_id,
                    'product_variant_id' => $item->product_variant_id,
                    'product_name'       => $item->product->product_name,
                    'variant_name'       => $variant->variant_name,
                    'weight'             => $variant->weight,
                    'weight_unit'        => $variant->weight_unit,
                    'sku'                => $variant->sku,
                    'mrp_price'          => $variant->mrp_price,
                    'price'              => $price,
                    'discount_amount'    => 0,
                    'qty'                => $item->qty,
                    'total'              => $total,
                ];
            })->toArray();

            // Calculate discount
            if ($offer) {
                $discount = $offer->calculateDiscount($subTotal);
                $offer->increment('used_count');
            }

            $deliveryCharge = $subTotal >= 500 ? 0 : 50;
            $totalAmount    = max(0, round($subTotal + $deliveryCharge - $discount, 2));

            $order = Order::create([
                'order_number'      => 'DF' . date('Ymd') . strtoupper(substr(uniqid(), -6)),
                'user_id'           => $user->id,
                'user_address_id'   => $address->id,
                'delivery_name'     => $address->full_name,
                'delivery_phone'    => $address->phone,
                'delivery_address'  => $address->address_line1 . ($address->address_line2 ? ', ' . $address->address_line2 : ''),
                'delivery_city'     => $address->city,
                'delivery_state'    => $address->state,
                'delivery_pincode'  => $address->pincode,
                'sub_total'         => $subTotal,
                'discount_amount'   => $discount,
                'coupon_code'       => $offer?->offer_code,
                'offer_id'          => $offer?->id,
                'delivery_charge'   => $deliveryCharge,
                'total_amount'      => $totalAmount,
                'payment_method'    => $data['payment_method'],
                'payment_status'    => $data['payment_method'] === 'cod' ? 'pending' : 'pending',
                'order_status'      => 'placed',
                'notes'             => $data['notes'] ?? null,
            ]);

            // Insert order items
            foreach ($lineItems as $line) {
                $order->items()->create($line);
            }

            // Initial tracking entry
            OrderTracking::create([
                'order_id'        => $order->id,
                'status'          => 'placed',
                'title'           => 'Order Placed',
                'message'         => 'Your order has been placed successfully.',
                'notify_customer' => true,
            ]);

            // Create payment record
            Payment::create([
                'payment_reference' => 'PAY' . strtoupper(Str::random(12)),
                'order_id'          => $order->id,
                'user_id'           => $user->id,
                'payment_gateway'   => $data['payment_method'],
                'amount'            => $totalAmount,
                'currency'          => 'INR',
                'status'            => 'pending',
            ]);

            // Clear cart
            Cart::where('user_id', $user->id)->delete();

            return $this->created(
                $order->load(['items', 'tracking', 'payment']),
                'Order placed successfully!'
            );
        });
    }

    /** GET /orders/{id} */
    public function show(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)
            ->with(['items', 'tracking' => fn($q) => $q->latest(), 'payment'])
            ->findOrFail($id);

        return $this->success($order);
    }

    /** GET /orders/{id}/track */
    public function track(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        $tracking = OrderTracking::where('order_id', $id)
            ->orderByDesc('created_at')
            ->get();

        return $this->success([
            'order_status'  => $order->order_status,
            'payment_status'=> $order->payment_status,
            'timeline'      => $tracking,
        ]);
    }

    /** POST /orders/{id}/cancel */
    public function cancel(Request $request, int $id): JsonResponse
    {
        $order = Order::where('user_id', $request->user()->id)->findOrFail($id);

        if (! in_array($order->order_status, ['placed', 'confirmed'])) {
            return $this->error('Order cannot be cancelled at this stage.', 422);
        }

        $data = $request->validate(['reason' => ['nullable', 'string', 'max:500']]);

        DB::transaction(function () use ($order, $data) {
            // Release reserved inventory
            foreach ($order->items as $item) {
                $inventory = ProductVariantInventory::where('product_variant_id', $item->product_variant_id)->first();
                if ($inventory) {
                    $variant    = \App\Models\ProductVariant::find($item->product_variant_id);
                    $weightInKg = ($variant?->weight_unit === 'kg')
                        ? ($variant?->weight ?? 0)
                        : (($variant?->weight ?? 0) / 1000);
                    $inventory->decrement('reserved_stock_kg', max(0, $weightInKg * $item->qty));
                }
            }

            $order->update([
                'order_status'        => 'cancelled',
                'cancellation_reason' => $data['reason'] ?? null,
                'cancelled_by'        => 'customer',
                'cancelled_at'        => now(),
            ]);

            OrderTracking::create([
                'order_id'        => $order->id,
                'status'          => 'cancelled',
                'title'           => 'Order Cancelled',
                'message'         => $data['reason'] ?? 'Cancelled by customer.',
                'notify_customer' => true,
            ]);
        });

        return $this->success($order->fresh(['items', 'tracking']), 'Order cancelled.');
    }

    /** POST /orders/{id}/reorder */
    public function reorder(Request $request, int $id): JsonResponse
    {
        $order   = Order::where('user_id', $request->user()->id)->with('items')->findOrFail($id);
        $userId  = $request->user()->id;
        $added   = 0;

        foreach ($order->items as $item) {
            $variant = \App\Models\ProductVariant::with('inventory')
                ->where('id', $item->product_variant_id)
                ->where('status', 'active')
                ->first();

            if (! $variant || $variant->available_units < 1) continue;

            Cart::updateOrCreate(
                ['user_id' => $userId, 'product_variant_id' => $variant->id],
                ['product_id' => $item->product_id, 'qty' => $item->qty, 'price' => $variant->selling_price]
            );
            $added++;
        }

        return $this->success(['items_added' => $added], "{$added} item(s) added to cart.");
    }
}
