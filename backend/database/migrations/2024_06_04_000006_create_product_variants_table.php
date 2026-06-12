<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Product Variants — Weight-Based Pricing
     * ─────────────────────────────────────────────────────────────────────────
     * Every physical product (Milk, Ghee, Paneer…) has N variants.
     *
     * Example — Milk:
     *   variant_name: "250g"  | weight: 250 | weight_unit: g | selling_price: 15.00
     *   variant_name: "500g"  | weight: 500 | weight_unit: g | selling_price: 30.00
     *   variant_name: "1kg"   | weight: 1   | weight_unit: kg| selling_price: 55.00
     *
     * The inventory table tracks TOTAL stock in KG.
     * Availability per variant is calculated dynamically:
     *   available_units = floor(available_stock_kg / weight_in_kg)
     */
    public function up(): void
    {
        Schema::create('product_variants', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('variant_name', 100);            // "250g", "500g", "1kg"
            $table->decimal('weight', 10, 3);               // 250.000 / 500.000 / 1.000
            $table->enum('weight_unit', ['g', 'kg', 'ml', 'l', 'piece'])->default('g');

            $table->string('sku', 100)->unique();            // e.g. MILK-500G
            $table->string('barcode', 100)->nullable()->unique();

            // Three-tier pricing
            $table->decimal('mrp_price', 10, 2);            // Max Retail Price (strikethrough)
            $table->decimal('selling_price', 10, 2);        // Customer pays this
            $table->decimal('purchase_price', 10, 2)->nullable(); // Cost price (internal)

            $table->unsignedBigInteger('total_sales')->default(0);
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->enum('status', ['active', 'inactive'])->default('active');
            $table->timestamps();

            // Lookups
            $table->index(['product_id', 'status']);
            $table->index(['product_id', 'sort_order']);
            $table->index('selling_price');         // Price range filtering
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_variants');
    }
};
