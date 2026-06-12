<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('products', function (Blueprint $table) {
            $table->id();
            $table->foreignId('category_id')
                  ->constrained()
                  ->restrictOnDelete();

            $table->string('product_name', 200);
            $table->string('slug', 220)->unique();
            $table->string('short_description', 500)->nullable();
            $table->longText('description')->nullable();
            $table->string('image')->nullable();         // Primary/thumbnail image

            // SEO
            $table->string('meta_title', 160)->nullable();
            $table->string('meta_description', 320)->nullable();

            // Merchandising flags
            $table->boolean('is_trending')->default(false);
            $table->boolean('is_featured')->default(false);

            // Analytics counters (denormalized for performance)
            $table->unsignedBigInteger('total_views')->default(0);
            $table->unsignedBigInteger('total_sales')->default(0);

            $table->enum('status', ['active', 'inactive', 'draft'])->default('active');
            $table->timestamps();
            $table->softDeletes();

            // Standard indexes
            $table->index(['category_id', 'status']);
            $table->index(['is_featured', 'status']);
            $table->index(['is_trending', 'status']);
            $table->index('status');
            $table->index('total_sales');   // For "Best Sellers" query
            $table->index('total_views');   // For "Most Viewed" query
        });

        /*
         * FULLTEXT index for product search.
         *
         * Covers: product_name, short_description, description
         *
         * Usage in queries:
         *   MATCH(product_name, short_description, description)
         *   AGAINST ('milk ghee' IN BOOLEAN MODE)
         *
         * In Laravel:
         *   Product::whereRaw(
         *       "MATCH(product_name, short_description, description) AGAINST(? IN BOOLEAN MODE)",
         *       ["+{$query}*"]
         *   )
         */
        DB::statement(
            'ALTER TABLE products ADD FULLTEXT INDEX ft_products_search
             (product_name, short_description, description)'
        );
    }

    public function down(): void
    {
        Schema::dropIfExists('products');
    }
};
