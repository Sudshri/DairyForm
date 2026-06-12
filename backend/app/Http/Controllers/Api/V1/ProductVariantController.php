<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;

class ProductVariantController extends Controller
{
    /** GET /products/{id}/variants */
    public function byProduct(int $productId): JsonResponse
    {
        $variants = ProductVariant::with(['inventory', 'activeOffers.offer'])
            ->where('product_id', $productId)
            ->where('status', 'active')
            ->orderBy('sort_order')
            ->get()
            ->map(function ($variant) {
                $variant->available_units = $variant->available_units_attribute;
                return $variant;
            });

        return $this->success($variants);
    }
}
