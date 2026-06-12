<?php

namespace Database\Factories;

use App\Models\Order;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class OrderFactory extends Factory
{
    protected $model = Order::class;

    public function definition(): array
    {
        $subTotal     = fake()->randomFloat(2, 50, 2000);
        $discount     = fake()->boolean(30) ? fake()->randomFloat(2, 5, 100) : 0;
        $delivery     = $subTotal >= 500 ? 0 : 20;
        $total        = $subTotal - $discount + $delivery;

        $status       = fake()->randomElement([
            'placed', 'placed',
            'confirmed',
            'processing',
            'dispatched',
            'out_for_delivery',
            'delivered', 'delivered', 'delivered',
            'cancelled',
        ]);

        $paymentStatus = match ($status) {
            'delivered'       => 'paid',
            'cancelled'       => fake()->randomElement(['pending', 'refunded']),
            default           => 'pending',
        };

        $userId = User::where('role', 'customer')->inRandomOrder()->value('id')
                  ?? User::factory()->create(['role' => 'customer'])->id;

        return [
            'order_number'       => 'DF' . date('Ymd') . strtoupper(substr(uniqid(), -6)),
            'user_id'            => $userId,
            'user_address_id'    => null,
            'delivery_name'      => fake()->name(),
            'delivery_phone'     => '9' . fake()->numerify('########'),
            'delivery_address'   => fake()->streetAddress(),
            'delivery_city'      => fake()->randomElement(['Pune', 'Mumbai', 'Nashik']),
            'delivery_state'     => 'Maharashtra',
            'delivery_pincode'   => fake()->randomElement(['411001', '411013', '411028', '400001']),
            'sub_total'          => $subTotal,
            'discount_amount'    => $discount,
            'delivery_charge'    => $delivery,
            'tax_amount'         => 0,
            'total_amount'       => $total,
            'order_status'       => $status,
            'payment_method'     => fake()->randomElement(['cod', 'razorpay', 'stripe']),
            'payment_status'     => $paymentStatus,
            'created_at'         => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function delivered(): static
    {
        return $this->state([
            'order_status'   => 'delivered',
            'payment_status' => 'paid',
            'delivered_at'   => fake()->dateTimeBetween('-30 days', '-1 day'),
        ]);
    }

    public function cancelled(): static
    {
        return $this->state([
            'order_status'       => 'cancelled',
            'payment_status'     => 'refunded',
            'cancelled_at'       => fake()->dateTimeBetween('-30 days', 'now'),
            'cancellation_reason'=> fake()->randomElement([
                'Changed my mind', 'Ordered by mistake',
                'Found better price', 'Delivery too slow',
            ]),
        ]);
    }

    public function cod(): static
    {
        return $this->state(['payment_method' => 'cod']);
    }
}
