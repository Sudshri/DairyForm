<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Helpers\StorageHelper;
use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\ProductVariant;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            'image'             => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        $variantsInput = $request->validate([
            'variants'                       => ['nullable', 'array'],
            'variants.*.variant_name'        => ['required_with:variants', 'string', 'max:100'],
            'variants.*.weight'              => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.weight_unit'         => ['required_with:variants', 'in:g,kg,ml,l,piece'],
            'variants.*.sku'                 => ['required_with:variants', 'string', 'max:100'],
            'variants.*.mrp_price'           => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.selling_price'       => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.purchase_price'      => ['nullable', 'numeric', 'min:0'],
            'variants.*.status'              => ['nullable', 'in:active,inactive'],
        ])['variants'] ?? [];

        $data['slug'] ??= Str::slug($data['product_name']) . '-' . substr(uniqid(), -4);

        if ($request->hasFile('image')) {
            $data['image'] = StorageHelper::storePublic($request->file('image'), 'products');
        }

        $product = Product::create($data);

        // Save variants
        foreach ($variantsInput as $i => $v) {
            $product->variants()->create([
                'variant_name'   => $v['variant_name'],
                'weight'         => $v['weight'],
                'weight_unit'    => $v['weight_unit'],
                'sku'            => $v['sku'],
                'mrp_price'      => $v['mrp_price'],
                'selling_price'  => $v['selling_price'],
                'purchase_price' => $v['purchase_price'] ?? null,
                'status'         => $v['status'] ?? 'active',
                'sort_order'     => $i,
            ]);
        }

        // Create a primary ProductImage entry if an image was uploaded
        if (isset($data['image'])) {
            ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $data['image'],
                'alt_text'   => $product->product_name,
                'sort_order' => 1,
                'is_primary' => true,
            ]);
        }

        return $this->created($product->load(['category:id,name', 'variants', 'images']), 'Product created.');
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
            'image'             => ['nullable', 'image', 'max:5120', 'mimes:jpg,jpeg,png,webp'],
        ]);

        if ($request->hasFile('image')) {
            Storage::disk('public')->delete($product->getRawOriginal('image'));
            $data['image'] = StorageHelper::storePublic($request->file('image'), 'products');

            // Keep primary ProductImage record in sync
            $primary = ProductImage::where('product_id', $id)->where('is_primary', true)->first();
            if ($primary) {
                Storage::disk('public')->delete($primary->getRawOriginal('image_path'));
                $primary->update(['image_path' => $data['image'], 'alt_text' => $product->getAttribute('product_name')]);
            } else {
                ProductImage::create([
                    'product_id' => $id,
                    'image_path' => $data['image'],
                    'alt_text'   => $product->getAttribute('product_name'),
                    'sort_order' => 1,
                    'is_primary' => true,
                ]);
            }
        }

        $variantsInput = $request->validate([
            'variants'                       => ['nullable', 'array'],
            'variants.*.id'                  => ['nullable', 'integer', 'exists:product_variants,id'],
            'variants.*.variant_name'        => ['required_with:variants', 'string', 'max:100'],
            'variants.*.weight'              => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.weight_unit'         => ['required_with:variants', 'in:g,kg,ml,l,piece'],
            'variants.*.sku'                 => ['required_with:variants', 'string', 'max:100'],
            'variants.*.mrp_price'           => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.selling_price'       => ['required_with:variants', 'numeric', 'min:0'],
            'variants.*.purchase_price'      => ['nullable', 'numeric', 'min:0'],
            'variants.*.status'              => ['nullable', 'in:active,inactive'],
        ])['variants'] ?? [];

        $product->update($data);

        if (!empty($variantsInput)) {
            $submittedIds = array_filter(array_column($variantsInput, 'id'));

            // Delete variants removed by the user
            $product->variants()->whereNotIn('id', $submittedIds)->delete();

            foreach ($variantsInput as $i => $v) {
                $fields = [
                    'variant_name'   => $v['variant_name'],
                    'weight'         => $v['weight'],
                    'weight_unit'    => $v['weight_unit'],
                    'sku'            => $v['sku'],
                    'mrp_price'      => $v['mrp_price'],
                    'selling_price'  => $v['selling_price'],
                    'purchase_price' => $v['purchase_price'] ?? null,
                    'status'         => $v['status'] ?? 'active',
                    'sort_order'     => $i,
                ];

                if (!empty($v['id'])) {
                    ProductVariant::where('product_id', $id)->where('id', $v['id'])->update($fields);
                } else {
                    $product->variants()->create($fields);
                }
            }
        }

        return $this->success($product->fresh(['category:id,name', 'variants', 'images']), 'Product updated.');
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

            if ($isPrimary) {
                $product->update(['image' => $path]);
            }

            $uploaded[] = $image;
        }

        return $this->created($uploaded, count($uploaded) . ' image(s) uploaded.');
    }

    /** DELETE /admin/products/{id}/images/{imgId} */
    public function deleteImage(int $id, int $imgId): JsonResponse
    {
        $image = ProductImage::where('product_id', $id)->findOrFail($imgId);

        Storage::disk('public')->delete($image->getRawOriginal('image_path'));

        $wasPrimary = $image->is_primary;
        $image->delete();

        if ($wasPrimary) {
            $next = ProductImage::where('product_id', $id)->orderBy('sort_order')->first();
            if ($next) {
                $next->update(['is_primary' => true]);
                Product::find($id)?->update(['image' => $next->getRawOriginal('image_path')]);
            }
        }

        return $this->noContent('Image deleted.');
    }
}
