<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\StorageHelper;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariantInventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $products = Product::with('category:id,name')
            ->withCount('variants')
            ->when($request->input('search'), fn($q, $v) =>
                $q->whereRaw('MATCH(product_name,short_description,description) AGAINST(? IN BOOLEAN MODE)', ["+{$v}*"])
            )
            ->when($request->input('category_id'), fn($q, $v) => $q->where('category_id', $v))
            ->when($request->input('status'), fn($q, $v) => $q->where('status', $v))
            ->orderBy($request->input('sort_by', 'created_at'), $request->input('sort_dir', 'desc'))
            ->paginate($request->integer('per_page', 15));

        return $this->paginated($products);
    }

    public function show(int $id): JsonResponse
    {
        $product = Product::with(['category:id,name,slug', 'images', 'variants.inventory'])
            ->findOrFail($id);

        return $this->success($product);
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'category_id'       => ['required', 'integer', 'exists:categories,id'],
            'product_name'      => ['required', 'string', 'max:200'],
            'slug'              => ['nullable', 'string', 'max:220', 'unique:products,slug'],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description'       => ['nullable', 'string'],
            'is_featured'       => ['nullable', 'boolean'],
            'is_trending'       => ['nullable', 'boolean'],
            'status'            => ['nullable', 'in:active,inactive,draft'],
            'meta_title'        => ['nullable', 'string', 'max:160'],
            'meta_description'  => ['nullable', 'string', 'max:320'],
        ]);

        $data['slug'] ??= Str::slug($data['product_name']) . '-' . substr(uniqid(), -4);

        $product = Product::create($data);

        return $this->created($product->load('category:id,name'), 'Product created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $data = $request->validate([
            'category_id'       => ['sometimes', 'integer', 'exists:categories,id'],
            'product_name'      => ['sometimes', 'string', 'max:200'],
            'slug'              => ['sometimes', 'string', "unique:products,slug,{$id}"],
            'short_description' => ['nullable', 'string', 'max:500'],
            'description'       => ['nullable', 'string'],
            'is_featured'       => ['nullable', 'boolean'],
            'is_trending'       => ['nullable', 'boolean'],
            'status'            => ['nullable', 'in:active,inactive,draft'],
            'meta_title'        => ['nullable', 'string', 'max:160'],
            'meta_description'  => ['nullable', 'string', 'max:320'],
        ]);

        $product->update($data);

        return $this->success($product->fresh(['category:id,name', 'variants']), 'Product updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $product = Product::withCount('variants')->findOrFail($id);
        $product->delete(); // soft delete — variants remain

        return $this->noContent('Product deleted.');
    }

    /** POST /admin/products/{id}/images */
    public function uploadImages(Request $request, int $id): JsonResponse
    {
        $product = Product::findOrFail($id);

        $request->validate([
            'images'   => ['required', 'array', 'max:5'],
            'images.*' => ['required', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $uploaded = [];
        foreach ($request->file('images') as $index => $file) {
            $path     = $file->store("products/{$id}", 'public');
            $isPrimary = $index === 0 && ! ProductImage::where('product_id', $id)->where('is_primary', true)->exists();

            $image = ProductImage::create([
                'product_id'  => $id,
                'image_path'  => $path,
                'alt_text'    => $product->product_name,
                'sort_order'  => ProductImage::where('product_id', $id)->max('sort_order') + 1,
                'is_primary'  => $isPrimary,
            ]);

            // Set primary image on product itself — full URL with APP_URL prefix
            if ($isPrimary) {
                $product->update(['image' => StorageHelper::fullUrl($path)]);
            }

            $uploaded[] = $image;
        }

        return $this->created($uploaded, count($uploaded) . ' image(s) uploaded.');
    }

    /** DELETE /admin/products/{id}/images/{imgId} */
    public function deleteImage(int $id, int $imgId): JsonResponse
    {
        $image = ProductImage::where('product_id', $id)->findOrFail($imgId);

        // Use StorageHelper so we pass the disk-relative path, not a full URL
        \Illuminate\Support\Facades\Storage::disk('public')->delete($image->image_path);

        $wasPrimary = $image->is_primary;
        $image->delete();

        if ($wasPrimary) {
            $next = ProductImage::where('product_id', $id)->orderBy('sort_order')->first();
            if ($next) {
                $next->update(['is_primary' => true]);
                Product::find($id)?->update(['image' => StorageHelper::fullUrl($next->image_path)]);
            }
        }

        return $this->noContent('Image deleted.');
    }
}
