<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Payments Table — Gateway-Agnostic Design
     * ─────────────────────────────────────────────────────────────────────────
     * One order may have multiple payment attempts (failed → retry).
     * Only one payment per order should ever reach status='success'.
     *
     * Razorpay flow:
     *   1. Create Razorpay order → store gateway_order_id
     *   2. Customer pays → store gateway_payment_id + gateway_signature
     *   3. Verify signature → update status to 'success'
     *
     * Stripe flow:
     *   1. Create PaymentIntent → store gateway_order_id (intent ID)
     *   2. Confirm → store gateway_payment_id (charge ID)
     *
     * COD flow:
     *   1. Create payment record with status 'pending'
     *   2. Mark 'success' on delivery confirmation
     */
    public function up(): void
    {
        Schema::create('payments', function (Blueprint $table) {
            $table->id();

            $table->string('payment_reference', 40)->unique(); // Internal: PAY20240604XXXX

            $table->foreignId('order_id')
                  ->constrained()
                  ->restrictOnDelete();

            $table->foreignId('user_id')
                  ->constrained()
                  ->restrictOnDelete();

            $table->enum('payment_gateway', ['razorpay', 'stripe', 'cod', 'wallet'])
                  ->default('cod');

            // Gateway-specific identifiers
            $table->string('gateway_order_id')->nullable();    // razorpay_order_id / stripe PI id
            $table->string('gateway_payment_id')->nullable();  // razorpay_payment_id / charge id
            $table->string('gateway_signature')->nullable();   // Razorpay HMAC signature

            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('INR');

            $table->enum('status', [
                'pending', 'success', 'failed', 'refunded', 'partial_refund',
            ])->default('pending');

            $table->json('gateway_response')->nullable();      // Full raw response (audit)
            $table->text('failure_reason')->nullable();

            $table->decimal('refund_amount', 10, 2)->default(0);
            $table->string('refund_id')->nullable();           // Gateway refund ID
            $table->timestamp('refunded_at')->nullable();

            $table->timestamp('paid_at')->nullable();
            $table->string('payment_mode')->nullable();        // 'card', 'upi', 'netbanking'

            $table->timestamps();

            // Order's payment status lookup
            $table->index(['order_id', 'status']);
            // Gateway webhook: find payment by gateway reference
            $table->index(['gateway_order_id', 'payment_gateway']);
            $table->index(['gateway_payment_id', 'payment_gateway']);
            // Revenue reports
            $table->index(['status', 'paid_at']);
            $table->index('paid_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('payments');
    }
};
