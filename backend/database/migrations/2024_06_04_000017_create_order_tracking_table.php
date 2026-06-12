<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Order Tracking — Append-Only Log
     * ─────────────────────────────────────────────────────────────────────────
     * Every status transition creates a new row.
     * Never UPDATE; always INSERT. Timeline is reconstructed from created_at.
     *
     * Example timeline for order DF202406040001:
     *   placed          → "Order received"
     *   confirmed       → "Payment confirmed"
     *   processing      → "Being packed at warehouse"
     *   dispatched      → "Handed to BlueDart | AWB: BD1234"
     *   out_for_delivery→ "Out for delivery in your area"
     *   delivered       → "Delivered to Ramesh Kumar"
     */
    public function up(): void
    {
        Schema::create('order_tracking', function (Blueprint $table) {
            $table->id();

            $table->foreignId('order_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->enum('status', [
                'placed',
                'confirmed',
                'processing',
                'dispatched',
                'out_for_delivery',
                'delivered',
                'cancelled',
                'returned',
                'refunded',
            ]);

            $table->string('title', 150)->nullable();        // Short display title
            $table->text('message')->nullable();             // Detailed message to customer
            $table->string('location', 200)->nullable();     // "Mumbai Hub"

            // Courier tracking
            $table->string('courier_name', 100)->nullable();
            $table->string('tracking_id', 100)->nullable();
            $table->string('tracking_url', 500)->nullable();

            $table->unsignedBigInteger('updated_by')->nullable(); // admin/system user ID
            $table->boolean('notify_customer')->default(true);    // Send SMS/push/email

            $table->timestamps();

            // Timeline for a specific order
            $table->index(['order_id', 'created_at']);
            // Admin dashboard: filter by status
            $table->index('status');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('order_tracking');
    }
};
