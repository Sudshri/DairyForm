<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ReviewController extends Controller
{
    /** GET /products/{id}/reviews */
    public function index(Request $request, int $productId): JsonResponse
    {
        $reviews = Review::with('user:id,name')
            ->where('product_id', $productId)
            ->where('is_approved', true)
            ->orderByDesc('helpful_count')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 10));

        $stats = Review::where('product_id', $productId)->where('is_approved', true)
            ->selectRaw('AVG(rating) as avg_rating, COUNT(*) as total')
            ->first();

        return response()->json([
            'success'      => true,
            'message'      => 'OK',
            'data'         => $reviews->items(),
            'stats'        => [
                'avg_rating' => round((float) $stats->avg_rating, 1),
                'total'      => $stats->total,
            ],
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    /** GET /reviews — public, approved only (for testimonials section) */
    public function publicIndex(Request $request): JsonResponse
    {
        $reviews = Review::with('user:id,name')
            ->where('is_approved', true)
            ->orderByDesc('helpful_count')
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 12));

        return response()->json([
            'success' => true,
            'message' => 'OK',
            'data'    => $reviews->items(),
            'meta'    => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    /** POST /reviews — authenticated */
    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id'    => ['required', 'integer', 'exists:products,id'],
            'order_item_id' => ['nullable', 'integer'],
            'rating'        => ['required', 'integer', 'min:1', 'max:5'],
            'title'         => ['nullable', 'string', 'max:150'],
            'comment'       => ['nullable', 'string', 'max:2000'],
        ]);

        $user = $request->user();

        // One review per product per user
        if (Review::where('user_id', $user->id)->where('product_id', $data['product_id'])->exists()) {
            return $this->error('You have already reviewed this product.', 422);
        }

        $review = Review::create([
            ...$data,
            'user_id'              => $user->id,
            'is_verified_purchase' => $this->checkVerifiedPurchase($user->id, $data['product_id']),
            'is_approved'          => false,
        ]);

        return $this->created($review->load('user:id,name'), 'Review submitted. Awaiting approval.');
    }

    /** PUT /reviews/{id} */
    public function update(Request $request, int $id): JsonResponse
    {
        $review = Review::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();

        $data = $request->validate([
            'rating'  => ['sometimes', 'integer', 'min:1', 'max:5'],
            'title'   => ['nullable', 'string', 'max:150'],
            'comment' => ['nullable', 'string', 'max:2000'],
        ]);

        $review->update($data + ['is_approved' => false]); // re-queue for moderation

        return $this->success($review, 'Review updated. Awaiting re-approval.');
    }

    /** DELETE /reviews/{id} */
    public function destroy(Request $request, int $id): JsonResponse
    {
        Review::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail()->delete();

        return $this->noContent('Review deleted.');
    }

    /** POST /reviews/{id}/helpful */
    public function markHelpful(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->increment('helpful_count');

        return $this->success(['helpful_count' => $review->helpful_count]);
    }

    private function checkVerifiedPurchase(int $userId, int $productId): bool
    {
        return \App\Models\OrderItem::whereHas('order', fn($q) =>
                $q->where('user_id', $userId)->where('order_status', 'delivered')
            )
            ->where('product_id', $productId)
            ->exists();
    }
}
