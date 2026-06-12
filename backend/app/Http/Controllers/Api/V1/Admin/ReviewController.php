<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $reviews = Review::with(['user:id,name', 'product:id,product_name'])
            ->when($request->input('is_approved') !== null,
                fn($q) => $q->where('is_approved', $request->boolean('is_approved'))
            )
            ->when($request->input('product_id'), fn($q, $v) => $q->where('product_id', $v))
            ->when($request->input('rating'),     fn($q, $v) => $q->where('rating', $v))
            ->orderByDesc('created_at')
            ->paginate($request->integer('per_page', 20));

        return $this->paginated($reviews);
    }

    /** PATCH /admin/reviews/{id}/approve */
    public function approve(int $id): JsonResponse
    {
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => ! $review->is_approved]);

        $status = $review->is_approved ? 'approved' : 'unapproved';
        return $this->success(['is_approved' => $review->is_approved], "Review {$status}.");
    }

    public function destroy(int $id): JsonResponse
    {
        Review::findOrFail($id)->delete();
        return $this->noContent('Review deleted.');
    }
}
