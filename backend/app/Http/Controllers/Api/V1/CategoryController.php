<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    /** GET /categories */
    public function index(): JsonResponse
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->where('is_active', true)
            ->orderBy('sort_order')
            ->get();

        return $this->success($categories);
    }

    /** GET /categories/{slug} */
    public function show(string $slug): JsonResponse
    {
        $category = Category::with('children')
            ->where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        return $this->success($category);
    }

    /** GET /categories/{slug}/products */
    public function products(Request $request, string $slug): JsonResponse
    {
        $category = Category::where('slug', $slug)
            ->where('is_active', true)
            ->firstOrFail();

        // Include child-category IDs so sub-category products are visible too
        $ids = Category::where('parent_id', $category->id)
            ->pluck('id')
            ->prepend($category->id);

        $products = \App\Models\Product::with([
                'variants' => fn($q) => $q->where('status', 'active')->with('inventory'),
            ])
            ->whereIn('category_id', $ids)
            ->where('status', 'active')
            ->when($request->search, fn($q, $v) =>
                $q->whereRaw(
                    'MATCH(product_name, short_description, description) AGAINST(? IN BOOLEAN MODE)',
                    ["+{$v}*"]
                )
            )
            ->orderBy($request->input('sort_by', 'total_sales'), $request->input('sort_dir', 'desc'))
            ->paginate($request->integer('per_page', 12));

        return $this->paginated($products);
    }
}
