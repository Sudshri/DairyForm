<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Orders Table — High Concurrency Design
     * ─────────────────────────────────────────────────────────────────────────
     * Address snapshot: delivery_* columns store the address AT ORDER TIME.
     * user_address_id is kept for reference but is NULLable to allow address
     * deletion without breaking order history.
     *
     * Financial snapshot: all amounts are immutable once the order is placed.
     *
     * Optimistic concurrency for order_number generation:
     *   OrderService generates via: "DF" . date('Ymd') . str_pad($sequence, 5, '0', STR_PAD_LEFT)
     *   Falls back to UUID on collision.
     */
    public function up(): void
    {
        Schema::create('orders', function (Blueprint $table) {
            $table->id();
            $table->string('order_number', 25)->unique();       // DF202406040001

            $table->foreignId('user_id')
                  ->constrained()
                  ->restrictOnDelete();

            // Address reference (nullable so users can delete addresses later)
            $table->foreignId('user_address_id')
                  ->nullable()
                  ->constrained()
                  ->nullOnDelete();

            // ── Address Snapshot (immutable at order time) ──────────────────
            $table->string('delivery_name', 150);
            $table->string('delivery_phone', 15);
            $table->text('delivery_address');
            $table->string('delivery_city', 100);
            $table->string('delivery_state', 100);
            $table->string('delivery_pincode', 10);
            $table->string('delivery_country', 5)->default('IN');

            // ── Pricing Snapshot ────────────────────────────────────────────
            $table->decimal('sub_total', 12, 2)->default(0);
            $table->decimal('discount_amount', 10, 2)->default(0);
            $table->string('coupon_code', 50)->nullable();
            $table->unsignedBigInteger('offer_id')->nullable(); // applied offer reference
            $table->decimal('delivery_charge', 8, 2)->default(0);
            $table->decimal('tax_amount', 8, 2)->default(0);
            $table->decimal('total_amount', 12, 2)->default(0);

            // ── Status ──────────────────────────────────────────────────────
            $table->enum('order_status', [
                'placed',
                'confirmed',
                'processing',
                'dispatched',
                'out_for_delivery',
                'delivered',
                'cancelled',
                'returned',
                'refunded',
            ])->default('placed');

            $table->enum('payment_method', [
                'razorpay', 'stripe', 'cod', 'wallet',
            ])->default('cod');

            $table->enum('payment_status', [
                'pending', 'paid', 'failed', 'refunded', 'partial_refund',
            ])->default('pending');

            // ── Metadata ────────────────────────────────────────────────────
            $table->text('notes')->nullable();
            $table->text('admin_notes')->nullable();
            $table->text('cancellation_reason')->nullable();
            $table->string('cancelled_by')->nullable();       // 'customer' | 'admin' | 'system'

            $table->string('delivery_agent_id')->nullable();
            $table->timestamp('expected_delivery_date')->nullable();
            $table->timestamp('delivered_at')->nullable();
            $table->timestamp('cancelled_at')->nullable();

            $table->timestamps();
            $table->softDeletes();

            // ── Indexes ──────────────────────────────────────────────────────
            // Admin order list with status filter
            $table->index(['order_status', 'payment_status']);
            // User order history
            $table->index(['user_id', 'order_status']);
            $table->index(['user_id', 'created_at']);
            // Revenue reports
            $table->index(['payment_status', 'created_at']);
            // Delivery management
            $table->index(['order_status', 'delivery_pincode']);
            // Date range queries (analytics)
            $table->index('created_at');
            $table->index('delivered_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('orders');
    }
};
