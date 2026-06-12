<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariant;
use App\Models\ProductVariantInventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ProductVariantController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $variants = ProductVariant::with(['product:id,product_name', 'inventory'])
            ->when($request->integer('product_id'), fn($q, $v) => $q->where('product_id', $v))
            ->paginate($request->integer('per_page', 15));

        return $this->paginated($variants);
    }

    public function show(int $id): JsonResponse
    {
        return $this->success(
            ProductVariant::with(['product:id,product_name', 'inventory', 'variantOffers.offer'])->findOrFail($id)
        );
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'product_id'     => ['required', 'integer', 'exists:products,id'],
            'variant_name'   => ['required', 'string', 'max:100'],
            'weight'         => ['required', 'numeric', 'min:0.001'],
            'weight_unit'    => ['required', 'in:g,kg,ml,l,piece'],
            'sku'            => ['required', 'string', 'max:100', 'unique:product_variants,sku'],
            'barcode'        => ['nullable', 'string', 'max:100', 'unique:product_variants,barcode'],
            'mrp_price'      => ['required', 'numeric', 'min:0'],
            'selling_price'  => ['required', 'numeric', 'min:0'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'sort_order'     => ['nullable', 'integer'],
            'status'         => ['nullable', 'in:active,inactive'],
            // Initial stock
            'stock_kg'          => ['nullable', 'numeric', 'min:0'],
            'low_stock_alert_kg'=> ['nullable', 'numeric', 'min:0'],
        ]);

        $variant = ProductVariant::create($data);

        // Auto-create inventory record
        ProductVariantInventory::create([
            'product_variant_id' => $variant->id,
            'stock_kg'           => $data['stock_kg'] ?? 0,
            'reserved_stock_kg'  => 0,
            'low_stock_alert_kg' => $data['low_stock_alert_kg'] ?? 5,
            'stock_status'       => ($data['stock_kg'] ?? 0) > 0 ? 'in_stock' : 'out_of_stock',
        ]);

        return $this->created($variant->load(['inventory']), 'Variant created.');
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $variant = ProductVariant::findOrFail($id);

        $data = $request->validate([
            'variant_name'   => ['sometimes', 'string', 'max:100'],
            'weight'         => ['sometimes', 'numeric', 'min:0.001'],
            'weight_unit'    => ['sometimes', 'in:g,kg,ml,l,piece'],
            'sku'            => ['sometimes', 'string', "unique:product_variants,sku,{$id}"],
            'barcode'        => ['nullable', 'string', "unique:product_variants,barcode,{$id}"],
            'mrp_price'      => ['sometimes', 'numeric', 'min:0'],
            'selling_price'  => ['sometimes', 'numeric', 'min:0'],
            'purchase_price' => ['nullable', 'numeric', 'min:0'],
            'sort_order'     => ['nullable', 'integer'],
            'status'         => ['nullable', 'in:active,inactive'],
        ]);

        $variant->update($data);

        return $this->success($variant->fresh(['inventory']), 'Variant updated.');
    }

    public function destroy(int $id): JsonResponse
    {
        $variant = ProductVariant::findOrFail($id);
        $variant->inventory?->delete();
        $variant->delete();

        return $this->noContent('Variant deleted.');
    }
}
