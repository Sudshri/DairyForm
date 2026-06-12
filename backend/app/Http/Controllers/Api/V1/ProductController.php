<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    /** GET /products */
    public function index(Request $request): JsonResponse
    {
        $products = Product::with([
                'category:id,name,slug',
                'variants' => fn($q) => $q->where('status', 'active')
                    ->with(['inventory', 'activeOffers.offer']),
            ])
            ->where('status', 'active')
            ->when($request->category_id, fn($q, $v) => $q->where('category_id', $v))
            ->when($request->is_featured,  fn($q) => $q->where('is_featured', true))
            ->when($request->is_trending,  fn($q) => $q->where('is_trending', true))
            ->orderBy($request->input('sort_by', 'total_sales'), $request->input('sort_dir', 'desc'))
            ->paginate($request->integer('per_page', 12));

        return $this->paginated($products);
    }

    /** GET /products/search?q=milk */
    public function search(Request $request): JsonResponse
    {
        $q = $request->input('q', '');

        if (strlen($q) < 2) {
            return $this->success([]);
        }

        $products = Product::with(['category:id,name,slug', 'variants' => fn($q) => $q->where('status', 'active')])
            ->where('status', 'active')
            ->whereRaw(
                'MATCH(product_name, short_description, description) AGAINST(? IN BOOLEAN MODE)',
                ["+{$q}*"]
            )
            ->limit($request->integer('per_page', 10))
            ->get();

        return $this->success($products);
    }

    /** GET /products/featured */
    public function featured(): JsonResponse
    {
        $products = Product::with(['category:id,name,slug', 'variants' => fn($q) => $q->where('status', 'active')->with('inventory')])
            ->where('status', 'active')
            ->where('is_featured', true)
            ->orderByDesc('total_sales')
            ->limit(8)
            ->get();

        return $this->success($products);
    }

    /** GET /products/trending */
    public function trending(): JsonResponse
    {
        $products = Product::with(['category:id,name,slug', 'variants' => fn($q) => $q->where('status', 'active')->with('inventory')])
            ->where('status', 'active')
            ->where('is_trending', true)
            ->orderByDesc('total_views')
            ->limit(8)
            ->get();

        return $this->success($products);
    }

    /** GET /products/{id} */
    public function show(int $id): JsonResponse
    {
        $product = Product::with([
                'category:id,name,slug',
                'images',
                'variants' => fn($q) => $q->where('status', 'active')
                    ->with(['inventory', 'activeOffers.offer']),
            ])
            ->where('status', 'active')
            ->findOrFail($id);

        // Increment view counter (fire-and-forget)
        $product->increment('total_views');

        return $this->success($product);
    }
}
