<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('product_images', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('image_path');
            $table->string('thumbnail_path')->nullable();   // Pre-generated thumbnail
            $table->string('alt_text', 255)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_primary')->default(false);  // One per product
            $table->timestamps();

            // Fetch all images for a product ordered by sort_order
            $table->index(['product_id', 'sort_order']);
            // Quick check for primary image
            $table->index(['product_id', 'is_primary']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_images');
    }
};
