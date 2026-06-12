<?php

namespace Database\Seeders;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\OrderTracking;
use App\Models\Payment;
use App\Models\ProductVariant;
use App\Models\User;
use App\Models\UserAddress;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class OrderSeeder extends Seeder
{
    public function run(): void
    {
        $customers = User::where('role', 'customer')->take(5)->get();
        $variants  = ProductVariant::with('product', 'inventory')
                         ->where('status', 'active')
                         ->get();

        if ($customers->isEmpty() || $variants->isEmpty()) {
            $this->command->warn('No customers or variants found — skipping OrderSeeder.');
            return;
        }

        $statuses = ['placed', 'confirmed', 'dispatched', 'delivered', 'delivered', 'delivered'];

        foreach ($customers as $customer) {
            // Create address for the customer
            $address = UserAddress::create([
                'user_id'       => $customer->id,
                'full_name'     => $customer->name,
                'phone'         => $customer->phone,
                'address_line1' => fake()->streetAddress(),
                'city'          => 'Pune',
                'state'         => 'Maharashtra',
                'pincode'       => '411001',
                'address_type'  => 'home',
                'is_default'    => true,
            ]);

            // Create 2 orders per customer
            for ($i = 0; $i < 2; $i++) {
                $orderVariants = $variants->random(rand(1, 3));
                $subTotal      = 0;
                $orderStatus   = $statuses[array_rand($statuses)];

                $orderNumber = 'DF' . date('Ymd') . strtoupper(substr(uniqid(), -6));

                $order = Order::create([
                    'order_number'      => $orderNumber,
                    'user_id'           => $customer->id,
                    'user_address_id'   => $address->id,
                    'delivery_name'     => $address->full_name,
                    'delivery_phone'    => $address->phone,
                    'delivery_address'  => $address->address_line1,
                    'delivery_city'     => $address->city,
                    'delivery_state'    => $address->state,
                    'delivery_pincode'  => $address->pincode,
                    'sub_total'         => 0, // updated below
                    'discount_amount'   => 0,
                    'delivery_charge'   => 20,
                    'tax_amount'        => 0,
                    'total_amount'      => 0,
                    'order_status'      => $orderStatus,
                    'payment_method'    => 'cod',
                    'payment_status'    => $orderStatus === 'delivered' ? 'paid' : 'pending',
                ]);

                // Create order items
                foreach ($orderVariants as $variant) {
                    $qty   = rand(1, 3);
                    $price = $variant->selling_price;
                    $total = $price * $qty;
                    $subTotal += $total;

                    OrderItem::create([
                        'order_id'           => $order->id,
                        'product_id'         => $variant->product_id,
                        'product_variant_id' => $variant->id,
                        'product_name'       => $variant->product->product_name,
                        'variant_name'       => $variant->variant_name,
                        'weight'             => $variant->weight,
                        'weight_unit'        => $variant->weight_unit,
                        'sku'                => $variant->sku,
                        'mrp_price'          => $variant->mrp_price,
                        'price'              => $price,
                        'discount_amount'    => 0,
                        'qty'                => $qty,
                        'total'              => $total,
                    ]);
                }

                // Update order totals
                $grandTotal = $subTotal + 20;
                $order->update([
                    'sub_total'    => $subTotal,
                    'total_amount' => $grandTotal,
                ]);

                // Create tracking records up to current status
                $this->createTracking($order, $orderStatus);

                // Create payment
                Payment::create([
                    'payment_reference'  => 'PAY' . strtoupper(Str::random(12)),
                    'order_id'           => $order->id,
                    'user_id'            => $customer->id,
                    'payment_gateway'    => 'cod',
                    'amount'             => $grandTotal,
                    'currency'           => 'INR',
                    'status'             => $orderStatus === 'delivered' ? 'success' : 'pending',
                    'paid_at'            => $orderStatus === 'delivered' ? now()->subDays(rand(1, 10)) : null,
                ]);
            }
        }

        // Bulk factory orders for load testing
        Order::factory()->count(100)->create();
    }

    private function createTracking(Order $order, string $finalStatus): void
    {
        $timeline = [
            'placed'           => ['Order Placed',    'Your order has been placed successfully.'],
            'confirmed'        => ['Order Confirmed',  'Payment confirmed. Order is being prepared.'],
            'processing'       => ['Processing',       'Your order is being packed.'],
            'dispatched'       => ['Dispatched',       'Order handed to delivery partner.'],
            'out_for_delivery' => ['Out for Delivery', 'Your order is out for delivery.'],
            'delivered'        => ['Delivered',        'Order delivered successfully. Enjoy!'],
        ];

        $reachedFinal = false;
        foreach ($timeline as $status => $info) {
            if (! $reachedFinal) {
                OrderTracking::create([
                    'order_id'        => $order->id,
                    'status'          => $status,
                    'title'           => $info[0],
                    'message'         => $info[1],
                    'notify_customer' => true,
                ]);
            }
            if ($status === $finalStatus) {
                $reachedFinal = true;
            }
        }
    }
}
