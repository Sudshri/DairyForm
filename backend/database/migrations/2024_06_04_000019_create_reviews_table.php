<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reviews', function (Blueprint $table) {
            $table->id();

            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            // Links to order_item for verified purchase badge
            // NOT a FK — order_items.id may be 0/null for legacy reviews
            $table->unsignedBigInteger('order_item_id')->nullable();

            $table->unsignedTinyInteger('rating');              // 1–5 stars
            $table->string('title', 150)->nullable();
            $table->text('comment')->nullable();
            $table->json('images')->nullable();                 // Array of image paths

            $table->boolean('is_verified_purchase')->default(false);
            $table->boolean('is_approved')->default(false);    // Moderation flag
            $table->boolean('is_featured')->default(false);    // Pinned review
            $table->unsignedInteger('helpful_count')->default(0);

            $table->timestamps();
            $table->softDeletes();

            // One review per product per user
            $table->unique(['user_id', 'product_id']);

            // PDP: fetch approved reviews with pagination
            $table->index(['product_id', 'is_approved']);
            // PDP: average rating calculation
            $table->index(['product_id', 'is_approved', 'rating']);
            // Admin moderation queue
            $table->index(['is_approved', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reviews');
    }
};
