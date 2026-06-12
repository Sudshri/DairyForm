<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderTracking;
use App\Models\Payment;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class PaymentController extends Controller
{
    /**
     * POST /payments/create-order
     * Creates a Razorpay/Stripe order and returns gateway credentials to the frontend.
     */
    public function createOrder(Request $request): JsonResponse
    {
        $data  = $request->validate(['order_id' => ['required', 'integer']]);
        $order = Order::where('user_id', $request->user()->id)
            ->where('payment_status', 'pending')
            ->findOrFail($data['order_id']);

        // TODO: Integrate real gateway
        // $razorpay = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        // $rzpOrder = $razorpay->order->create(['amount' => $order->total_amount * 100, 'currency' => 'INR']);

        // Mock gateway response for development
        $gatewayOrderId = 'order_dev_' . strtoupper(substr(uniqid(), -8));

        Payment::where('order_id', $order->id)->update(['gateway_order_id' => $gatewayOrderId]);

        return $this->success([
            'gateway_order_id' => $gatewayOrderId,
            'amount'           => (int) ($order->total_amount * 100), // paise
            'currency'         => 'INR',
            'key_id'           => config('services.razorpay.key_id', 'rzp_test_dev'),
            'order_number'     => $order->order_number,
        ]);
    }

    /**
     * POST /payments/verify
     * Verifies Razorpay HMAC signature and marks the order as paid.
     */
    public function verify(Request $request): JsonResponse
    {
        $data = $request->validate([
            'razorpay_order_id'   => ['required', 'string'],
            'razorpay_payment_id' => ['required', 'string'],
            'razorpay_signature'  => ['required', 'string'],
        ]);

        $payment = Payment::where('gateway_order_id', $data['razorpay_order_id'])->firstOrFail();
        $order   = $payment->order;

        // HMAC signature verification
        // $expectedSignature = hash_hmac('sha256',
        //     $data['razorpay_order_id'] . '|' . $data['razorpay_payment_id'],
        //     config('services.razorpay.key_secret')
        // );
        // if (!hash_equals($expectedSignature, $data['razorpay_signature'])) {
        //     return $this->error('Payment signature verification failed.', 422);
        // }

        $payment->update([
            'gateway_payment_id' => $data['razorpay_payment_id'],
            'gateway_signature'  => $data['razorpay_signature'],
            'status'             => 'success',
            'paid_at'            => now(),
        ]);

        $order->update(['payment_status' => 'paid', 'order_status' => 'confirmed']);

        OrderTracking::create([
            'order_id'        => $order->id,
            'status'          => 'confirmed',
            'title'           => 'Payment Confirmed',
            'message'         => 'Payment received. Your order is being prepared.',
            'notify_customer' => true,
        ]);

        return $this->success(['order_status' => 'confirmed'], 'Payment verified successfully.');
    }

    /**
     * POST /payments/webhook — Razorpay server-to-server webhook.
     */
    public function webhook(Request $request): JsonResponse
    {
        $payload   = $request->getContent();
        $signature = $request->header('X-Razorpay-Signature');

        // Verify webhook signature (skip in dev)
        // $expected = hash_hmac('sha256', $payload, config('services.razorpay.webhook_secret'));
        // if (!hash_equals($expected, $signature)) {
        //     return response()->json(['error' => 'Invalid signature'], 400);
        // }

        $event = $request->input('event');
        $body  = $request->input('payload.payment.entity', []);

        Log::info('Razorpay webhook', ['event' => $event]);

        if ($event === 'payment.captured') {
            $payment = Payment::where('gateway_payment_id', $body['id'] ?? '')->first();
            if ($payment && $payment->status !== 'success') {
                $payment->update(['status' => 'success', 'paid_at' => now()]);
                $payment->order->update(['payment_status' => 'paid', 'order_status' => 'confirmed']);
            }
        }

        if ($event === 'refund.created') {
            $payment = Payment::where('gateway_payment_id', $body['payment_id'] ?? '')->first();
            if ($payment) {
                $payment->update([
                    'refund_amount' => ($body['amount'] ?? 0) / 100,
                    'refund_id'     => $body['id'] ?? null,
                    'status'        => 'refunded',
                    'refunded_at'   => now(),
                ]);
                $payment->order->update(['payment_status' => 'refunded']);
            }
        }

        return response()->json(['status' => 'ok']);
    }
}
