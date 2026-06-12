<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Cart;
use App\Models\ProductVariant;
use App\Models\Wishlist;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WishlistController extends Controller
{
    /** GET /wishlist */
    public function index(Request $request): JsonResponse
    {
        $items = Wishlist::where('user_id', $request->user()->id)
            ->with([
                'product:id,product_name,image,slug',
                'variant' => fn($q) => $q->with('inventory'),
            ])
            ->orderByDesc('created_at')
            ->get();

        return $this->success($items);
    }

    /** POST /wishlist — toggle (add if missing, remove if exists) */
    public function toggle(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id'         => ['required', 'integer', 'exists:products,id'],
            'product_variant_id' => ['required', 'integer', 'exists:product_variants,id'],
        ]);

        $userId = $request->user()->id;

        $existing = Wishlist::where('user_id', $userId)
            ->where('product_variant_id', $data['product_variant_id'])
            ->first();

        if ($existing) {
            $existing->delete();
            return $this->success(['wishlisted' => false], 'Removed from wishlist.');
        }

        Wishlist::create(['user_id' => $userId] + $data);
        return $this->success(['wishlisted' => true], 'Added to wishlist.');
    }

    /** DELETE /wishlist/{id} */
    public function remove(Request $request, int $id): JsonResponse
    {
        Wishlist::where('user_id', $request->user()->id)->findOrFail($id)->delete();
        return $this->noContent('Removed from wishlist.');
    }

    /** POST /wishlist/{id}/move-to-cart */
    public function moveToCart(Request $request, int $id): JsonResponse
    {
        $wishlistItem = Wishlist::where('user_id', $request->user()->id)->findOrFail($id);
        $variant      = ProductVariant::with('inventory')->findOrFail($wishlistItem->product_variant_id);
        $userId       = $request->user()->id;

        if ($variant->available_units < 1) {
            return $this->error('This item is out of stock.', 422);
        }

        $existing = Cart::where('user_id', $userId)
            ->where('product_variant_id', $variant->id)
            ->first();

        if ($existing) {
            $existing->increment('qty');
        } else {
            Cart::create([
                'user_id'            => $userId,
                'product_id'         => $wishlistItem->product_id,
                'product_variant_id' => $variant->id,
                'qty'                => 1,
                'price'              => $variant->selling_price,
            ]);
        }

        $wishlistItem->delete();

        return $this->success(null, 'Moved to cart.');
    }
}
