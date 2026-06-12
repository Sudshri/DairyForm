<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $categories = Category::with('children')
            ->when($request->input('search'), fn($q, $v) => $q->where('name', 'like', "%{$v}%"))
            ->orderBy('parent_id')->orderBy('sort_order')
            ->paginate($request->integer('per_page', 50));

        return $this->paginated($categories);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'         => ['required', 'string', 'max:100'],
            'slug'         => ['nullable', 'string', 'max:120', 'unique:categories,slug'],
            'description'  => ['nullable', 'string'],
            'icon'         => ['nullable', 'string', 'max:50'],
            'parent_id'    => ['nullable', 'integer', 'exists:categories,id'],
            'sort_order'   => ['nullable', 'integer'],
            'is_active'    => ['nullable', 'boolean'],
            'show_in_menu' => ['nullable', 'boolean'],
            'meta_title'   => ['nullable', 'string', 'max:160'],
            'meta_description' => ['nullable', 'string', 'max:320'],
        ]);

        $data['slug'] ??= Str::slug($data['name']);

        $category = Category::create($data);

        return $this->created($category->load('children'));
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(Category::with('children', 'parent')->findOrFail($id));
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $category = Category::findOrFail($id);

        $data = $request->validate([
            'name'         => ['sometimes', 'string', 'max:100'],
            'slug'         => ['sometimes', 'string', 'max:120', "unique:categories,slug,{$id}"],
            'description'  => ['nullable', 'string'],
            'icon'         => ['nullable', 'string', 'max:50'],
            'parent_id'    => ['nullable', 'integer', "exists:categories,id"],
            'sort_order'   => ['nullable', 'integer'],
            'is_active'    => ['nullable', 'boolean'],
            'show_in_menu' => ['nullable', 'boolean'],
        ]);

        $category->update($data);

        return $this->success($category->fresh('children'), 'Category updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $category      = Category::withCount('products')->findOrFail($id);
        $productsCount = (int) $category->getAttribute('products_count');

        if ($productsCount > 0) {
            return $this->error("Cannot delete: {$productsCount} product(s) assigned to this category.", 422);
        }

        $category->delete();
        return $this->noContent('Category deleted.');
    }
}
