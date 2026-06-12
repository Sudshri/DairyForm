<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Order Items — Full Snapshot Design
     * ─────────────────────────────────────────────────────────────────────────
     * product_id and product_variant_id are stored as plain integers (NO FK).
     *
     * Reason: Products/variants may be soft-deleted or hard-deleted after purchase.
     * All customer-facing fields (name, weight, price) are snapshotted at order time
     * so invoices/history remain accurate forever.
     *
     * Analytics queries use product_id/product_variant_id directly with
     * LEFT JOINs so deleted products still appear in sales reports.
     *
     * Example row:
     *   product_name:  "Fresh Milk"
     *   variant_name:  "500g"
     *   weight:        500.000
     *   weight_unit:   g
     *   sku:           MILK-500G
     *   mrp_price:     35.00
     *   price:         30.00
     *   discount_amt:  5.00
     *   qty:           2
     *   total:         60.00   (30 * 2 - 0 or (30-discount) * 2)
     */
    public function up(): void
    {
        Schema::create('order_items', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // No FK — intentional snapshot approach
            $table->unsignedBigInteger('product_id');
            $table->unsignedBigInteger('product_variant_id');

            // Product snapshot
            $table->string('product_name', 200);
            $table->string('variant_name', 100);        // "500g", "1kg"
            $table->decimal('weight', 10, 3);
            $table->enum('weight_unit', ['g', 'kg', 'ml', 'l', 'piece'])->default('g');
            $table->string('sku', 100)->nullable();
            $table->string('product_image')->nullable();

            // Pricing snapshot
            $table->decimal('mrp_price', 10, 2);
            $table->decimal('price', 10, 2);            // Selling price per unit
            $table->decimal('discount_amount', 10, 2)->default(0); // Per-item discount

            $table->unsignedSmallInteger('qty');
            $table->decimal('total', 12, 2);            // (price - discount) * qty

            // Review status
            $table->boolean('is_reviewed')->default(false);

            $table->timestamps();

            // Fetch all items in an order
            $table->index('order_id');
            // Sales analytics: product performance across all orders
            $table->index(['product_id', 'product_variant_id']);
            // Variant sales count
            $table->index('product_variant_id');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_items');
    }
};
