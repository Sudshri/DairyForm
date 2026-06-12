<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Shopping Cart
     * ─────────────────────────────────────────────────────────────────────────
     * One row per (user, variant) — enforced by UNIQUE constraint.
     * CartService increments qty if the same variant is added again.
     *
     * price is stored at add-time for cart display; actual order price is
     * recalculated at checkout to reflect any price changes.
     *
     * No guest cart — users must be logged in (OTP auth is fast).
     */
    public function up(): void
    {
        Schema::create('carts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('product_variant_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->unsignedSmallInteger('qty')->default(1);

            // Price snapshot at add-time (used for display only)
            $table->decimal('price', 10, 2);

            $table->timestamps();

            // Prevent duplicate variant in same cart
            $table->unique(['user_id', 'product_variant_id']);

            // Fetch full cart: WHERE user_id = ?
            $table->index(['user_id', 'product_variant_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carts');
    }
};
