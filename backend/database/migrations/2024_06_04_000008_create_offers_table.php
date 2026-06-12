<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Master Offer / Coupon Table
     * ─────────────────────────────────────────────────────────────────────────
     * Offer Types:
     *   percentage   → discount_value = 10  means 10% OFF
     *   fixed        → discount_value = 50  means ₹50 OFF
     *   bogo         → Buy 1 Get 1 Free (logic in OrderService)
     *   category     → Applied to all variants in a category
     *
     * Variant-level offer assignment is in variant_offers table.
     * Category-level offers use applicable_category_id.
     */
    public function up(): void
    {
        Schema::create('offers', function (Blueprint $table) {
            $table->id();
            $table->string('offer_name', 150);
            $table->string('offer_code', 50)->nullable()->unique(); // e.g. "MILK10"
            $table->text('description')->nullable();

            $table->enum('offer_type', ['percentage', 'fixed', 'bogo', 'category'])
                  ->default('percentage');

            $table->decimal('discount_value', 8, 2);          // % or ₹ amount
            $table->decimal('min_order_amount', 10, 2)->nullable();    // Min cart value
            $table->decimal('max_discount_amount', 10, 2)->nullable(); // Cap for % discounts

            // Category offer scope
            $table->unsignedBigInteger('applicable_category_id')->nullable();

            $table->dateTime('start_date');
            $table->dateTime('end_date');
            $table->boolean('is_active')->default(true);

            $table->unsignedInteger('usage_limit')->nullable();     // Total uses allowed
            $table->unsignedInteger('used_count')->default(0);
            $table->unsignedTinyInteger('per_user_limit')->default(1);

            $table->boolean('is_public')->default(true);     // false = coupon-code only
            $table->string('banner_image')->nullable();

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('applicable_category_id')
                  ->references('id')
                  ->on('categories')
                  ->nullOnDelete();

            // Active offer lookup: most frequent query
            $table->index(['is_active', 'start_date', 'end_date']);
            $table->index('offer_type');
            $table->index('end_date');   // Cron job to deactivate expired offers
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('offers');
    }
};
