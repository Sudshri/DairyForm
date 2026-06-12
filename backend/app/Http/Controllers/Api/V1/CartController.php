<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\Offer;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CartController extends Controller
{
    private function cartWithTotals(int $userId, ?float $discount = 0): array
    {
        $items = Cart::where('user_id', $userId)
            ->with(['product:id,product_name,image,slug', 'variant' => fn($q) => $q->with('inventory')])
            ->get()
            ->map(function ($item) {
                // Always use the current selling price
                $currentPrice = $item->variant?->selling_price ?? $item->price;
                $item->current_price = $currentPrice;
                $item->subtotal      = $currentPrice * $item->qty;
                return $item;
            });

        $subTotal  = $items->sum('subtotal');
        $delivery  = $subTotal >= 500 ? 0 : 50;
        $total     = $subTotal + $delivery - ($discount ?? 0);

        return [
            'items'         => $items,
            'sub_total'     => round($subTotal, 2),
            'discount'      => round((float) $discount, 2),
            'delivery'      => $delivery,
            'total'         => max(0, round($total, 2)),
            'item_count'    => $items->sum('qty'),
        ];
    }

    /** GET /cart */
    public function index(Request $request): JsonResponse
    {
        return $this->success($this->cartWithTotals($request->user()->id));
    }

    /** POST /cart */
    public function addItem(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id'         => ['required', 'integer', 'exists:products,id'],
            'product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
            'qty'                => ['required', 'integer', 'min:1', 'max:50'],
        ]);

        $variant = ProductVariant::with('inventory')->findOrFail($data['product_variant_id']);

        if ($variant->status !== 'active') {
            return $this->error('This variant is not available.', 422);
        }

        $availableUnits = $variant->available_units;
        if ($availableUnits < $data['qty']) {
            return $this->error("Only {$availableUnits} unit(s) available in stock.", 422);
        }

        $existing = Cart::where('user_id', $request->user()->id)
            ->where('product_variant_id', $data['product_variant_id'])
            ->first();

        if ($existing) {
            $newQty = $existing->qty + $data['qty'];
            if ($newQty > $availableUnits) {
                return $this->error("Cannot add more. Only {$availableUnits} unit(s) available.", 422);
            }
            $existing->update(['qty' => $newQty, 'price' => $variant->selling_price]);
        } else {
            Cart::create([
                'user_id'            => $request->user()->id,
                'product_id'         => $data['product_id'],
                'product_variant_id' => $data['product_variant_id'],
                'qty'                => $data['qty'],
                'price'              => $variant->selling_price,
            ]);
        }

        return $this->success($this->cartWithTotals($request->user()->id), 'Added to cart.');
    }

    /** PUT /cart/{id} */
    public function updateQty(Request $request, int $id): JsonResponse
    {
        $data = $request->validate(['qty' => ['required', 'integer', 'min:1', 'max:50']]);

        $item    = Cart::where('user_id', $request->user()->id)->findOrFail($id);
        $variant = ProductVariant::with('inventory')->findOrFail($item->product_variant_id);

        if ($data['qty'] > $variant->available_units) {
            return $this->error("Only {$variant->available_units} unit(s) available.", 422);
        }

        $item->update(['qty' => $data['qty'], 'price' => $variant->selling_price]);

        return $this->success($this->cartWithTotals($request->user()->id), 'Cart updated.');
    }

    /** DELETE /cart/{id} */
    public function removeItem(Request $request, int $id): JsonResponse
    {
        Cart::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return $this->success($this->cartWithTotals($request->user()->id), 'Item removed.');
    }

    /** DELETE /cart */
    public function clear(Request $request): JsonResponse
    {
        Cart::where('user_id', $request->user()->id)->delete();
        return $this->success(null, 'Cart cleared.');
    }

    /** POST /cart/apply-coupon */
    public function applyCoupon(Request $request): JsonResponse
    {
        $data   = $request->validate(['coupon_code' => ['required', 'string']]);
        $userId = $request->user()->id;

        $offer = Offer::where('offer_code', $data['coupon_code'])
            ->where('is_active', true)
            ->where('start_date', '<=', now())
            ->where('end_date', '>=', now())
            ->first();

        if (! $offer) {
            return $this->error('Invalid or expired coupon code.', 422);
        }

        if ($offer->usage_limit && $offer->used_count >= $offer->usage_limit) {
            return $this->error('This coupon has reached its usage limit.', 422);
        }

        $cart     = $this->cartWithTotals($userId);
        $subTotal = $cart['sub_total'];

        if ($offer->min_order_amount && $subTotal < $offer->min_order_amount) {
            return $this->error("Minimum order of ₹{$offer->min_order_amount} required for this coupon.", 422);
        }

        $discount = $offer->calculateDiscount($subTotal);
        $cart     = $this->cartWithTotals($userId, $discount);
        $cart['coupon']   = ['code' => $offer->offer_code, 'offer_id' => $offer->id, 'discount' => $discount];

        return $this->success($cart, "Coupon applied! You save ₹{$discount}.");
    }

    /** POST /cart/remove-coupon */
    public function removeCoupon(Request $request): JsonResponse
    {
        return $this->success($this->cartWithTotals($request->user()->id), 'Coupon removed.');
    }
}
