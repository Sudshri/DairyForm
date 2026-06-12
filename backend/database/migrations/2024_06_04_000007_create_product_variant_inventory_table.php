<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Inventory is managed at the TOTAL KG level per variant.
     * The service layer calculates how many units can be sold:
     *
     *   available_kg = stock_kg - reserved_stock_kg
     *   available_units = floor(available_kg / variant_weight_in_kg)
     *
     * Example — Milk (total stock: 500 KG):
     *   Milk 250g → floor(500 / 0.25) = 2000 units
     *   Milk 500g → floor(500 / 0.50) = 1000 units
     *   Milk 1kg  → floor(500 / 1.00) = 500  units
     *
     * stock_status is updated by a DB observer after every inventory change.
     *
     * Locking Strategy (high concurrency):
     *   Use SELECT ... FOR UPDATE on this row when decrementing during order placement.
     *   Decrement reserved_stock_kg on order placement.
     *   Decrement stock_kg on dispatch confirmation.
     *   Release reserved_stock_kg on order cancellation.
     */
    public function up(): void
    {
        Schema::create('product_variant_inventory', function (Blueprint $table) {
            $table->id();

            // 1:1 with product_variants
            $table->foreignId('product_variant_id')
                  ->unique()
                  ->constrained()
                  ->cascadeOnDelete();

            $table->decimal('stock_kg', 12, 3)->default(0);            // Total physical stock
            $table->decimal('reserved_stock_kg', 12, 3)->default(0);  // Held for pending orders
            $table->decimal('low_stock_alert_kg', 10, 3)->default(5); // Trigger alert below this
            $table->decimal('reorder_level_kg', 10, 3)->default(10);  // Auto-reorder trigger
            $table->decimal('max_stock_kg', 12, 3)->nullable();       // Warehouse capacity

            $table->enum('stock_status', ['in_stock', 'low_stock', 'out_of_stock'])
                  ->default('out_of_stock');

            $table->timestamp('last_restocked_at')->nullable();
            $table->timestamps();

            // Storefront filters by stock_status
            $table->index('stock_status');
            // Admin dashboard: low stock alerts
            $table->index(['stock_status', 'low_stock_alert_kg']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variant_inventory');
    }
};
