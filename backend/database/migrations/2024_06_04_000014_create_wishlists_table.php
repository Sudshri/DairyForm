<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('wishlists', function (Blueprint $table) {
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

            $table->timestamps();

            // Each (user, variant) pair is unique — toggle behavior
            $table->unique(['user_id', 'product_variant_id']);

            // Fetch user wishlist
            $table->index(['user_id', 'product_variant_id']);
            // Check if specific variant is wishlisted (PDP heart icon)
            $table->index(['user_id', 'product_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('wishlists');
    }
};
