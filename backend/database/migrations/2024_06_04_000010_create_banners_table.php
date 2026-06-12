<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('banners', function (Blueprint $table) {
            $table->id();
            $table->string('title', 150);
            $table->string('subtitle', 250)->nullable();
            $table->string('image');                    // Desktop image
            $table->string('mobile_image')->nullable(); // Mobile-specific image
            $table->string('alt_text', 255)->nullable();

            $table->enum('banner_type', ['slider', 'offer', 'popup', 'category_strip', 'full_width'])
                  ->default('slider');

            // Link configuration
            $table->enum('link_type', ['product', 'category', 'offer', 'external', 'none'])
                  ->default('none');
            $table->unsignedBigInteger('link_id')->nullable();  // product_id or category_id
            $table->string('link_url', 500)->nullable();        // External URL

            $table->string('cta_text', 50)->nullable();         // "Shop Now"
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('open_in_new_tab')->default(false);

            $table->dateTime('start_date')->nullable();
            $table->dateTime('end_date')->nullable();
            $table->timestamps();

            $table->index(['banner_type', 'is_active']);
            $table->index(['is_active', 'sort_order']);
            $table->index('end_date');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('banners');
    }
};
