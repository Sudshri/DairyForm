<?php

namespace App\Http\Controllers\Api\V1\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductVariantInventory;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class InventoryController extends Controller
{
    /** GET /admin/inventory/low-stock */
    public function lowStock(): JsonResponse
    {
        $items = ProductVariantInventory::with([
                'variant:id,product_id,variant_name,sku,weight,weight_unit',
                'variant.product:id,product_name',
            ])
            ->whereIn('stock_status', ['low_stock', 'out_of_stock'])
            ->orderBy('stock_status')
            ->orderBy('stock_kg')
            ->get();

        return $this->success($items);
    }

    /** PUT /admin/inventory/{variantId} */
    public function update(Request $request, int $variantId): JsonResponse
    {
        $data = $request->validate([
            'low_stock_alert_kg' => ['sometimes', 'numeric', 'min:0'],
            'reorder_level_kg'   => ['sometimes', 'numeric', 'min:0'],
            'max_stock_kg'       => ['nullable', 'numeric', 'min:0'],
        ]);

        $inventory = ProductVariantInventory::where('product_variant_id', $variantId)->firstOrFail();
        $inventory->update($data);

        $this->refreshStockStatus($inventory);

        return $this->success($inventory->fresh(), 'Inventory settings updated.');
    }

    /** POST /admin/inventory/{variantId}/restock */
    public function restock(Request $request, int $variantId): JsonResponse
    {
        $data = $request->validate([
            'quantity_kg' => ['required', 'numeric', 'min:0.001'],
            'notes'       => ['nullable', 'string', 'max:300'],
        ]);

        $inventory = ProductVariantInventory::where('product_variant_id', $variantId)->firstOrFail();
        $inventory->increment('stock_kg', $data['quantity_kg']);
        $inventory->update(['last_restocked_at' => now()]);

        $this->refreshStockStatus($inventory);

        return $this->success([
            'stock_kg'     => $inventory->fresh()->stock_kg,
            'stock_status' => $inventory->fresh()->stock_status,
        ], "Added {$data['quantity_kg']} KG to stock.");
    }

    private function refreshStockStatus(ProductVariantInventory $inv): void
    {
        $available = $inv->stock_kg - $inv->reserved_stock_kg;

        $status = match (true) {
            $available <= 0                             => 'out_of_stock',
            $available <= $inv->low_stock_alert_kg      => 'low_stock',
            default                                     => 'in_stock',
        };

        $inv->update(['stock_status' => $status]);
    }
}
