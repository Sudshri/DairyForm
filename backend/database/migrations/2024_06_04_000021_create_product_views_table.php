<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Product Views — Analytics & Trending Calculation
     * ─────────────────────────────────────────────────────────────────────────
     * Inserted on every PDP page load (queued job to avoid slowing response).
     *
     * products.total_views is updated by a nightly aggregation job rather than
     * a real-time counter increment to avoid hot-row contention at scale.
     *
     * Retention: raw rows are partitioned / pruned after 90 days.
     * Aggregated counts are persisted in products.total_views.
     */
    public function up(): void
    {
        Schema::create('product_views', function (Blueprint $table) {
            $table->id();

            $table->foreignId('product_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->unsignedBigInteger('user_id')->nullable();  // NULL = guest
            $table->string('session_id', 100)->nullable();      // Guest session
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 500)->nullable();
            $table->string('referrer', 500)->nullable();        // Traffic source

            $table->timestamp('viewed_at');
            $table->timestamps();

            // Analytics: views per product over time
            $table->index(['product_id', 'viewed_at']);
            // De-duplicate user views within a session
            $table->index(['user_id', 'product_id']);
            // Guest de-duplication
            $table->index(['session_id', 'product_id']);
            // Cleanup/partition job
            $table->index('viewed_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('product_views');
    }
};
