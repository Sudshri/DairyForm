<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Variant-Offer Assignment
     * ─────────────────────────────────────────────────────────────────────────
     * Maps a specific offer to a specific product variant.
     *
     * Examples:
     *   Milk 1kg   (variant_id=3) → ₹5 OFF         (offer_id=1, type=fixed)
     *   Milk 500g  (variant_id=2) → 10% OFF         (offer_id=2, type=percentage)
     *   Milk 250g  (variant_id=1) → No Offer
     */
    public function up(): void
    {
        Schema::create('variant_offers', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_variant_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('offer_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // One offer per variant (prevent duplicate assignments)
            $table->unique(['product_variant_id', 'offer_id']);

            // PLP: fetch active offer for each visible variant
            $table->index(['product_variant_id', 'is_active']);
            $table->index(['offer_id', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('variant_offers');
    }
};
