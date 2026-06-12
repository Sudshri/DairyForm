<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductVariantFactory extends Factory
{
    protected $model = ProductVariant::class;

    /*
     * Weight tiers for weight-based dairy products.
     * [ variant_name, weight, unit, mrp_multiplier ]
     */
    private static array $weightTiers = [
        ['250g',   250,  'g',  1.0],
        ['500g',   500,  'g',  1.9],
        ['1kg',    1000, 'g',  3.5],
        ['250ml',  250,  'ml', 1.0],
        ['500ml',  500,  'ml', 1.85],
        ['1 Litre', 1,   'l',  3.4],
        ['2 Litre', 2,   'l',  6.5],
    ];

    public function definition(): array
    {
        $tier      = fake()->randomElement(self::$weightTiers);
        $basePrice = fake()->numberBetween(20, 200);
        $mrp       = round($basePrice * $tier[3] * 1.15, 2);
        $selling   = round($basePrice * $tier[3], 2);
        $purchase  = round($selling * 0.6, 2);

        $productId = Product::inRandomOrder()->value('id') ?? Product::factory();

        // Generate unique SKU: ProductId-Weight-RandomSuffix
        $sku = strtoupper(
            "P{$productId}-{$tier[0]}-" . strtoupper(Str::random(4))
        );

        return [
            'product_id'     => $productId,
            'variant_name'   => $tier[0],
            'weight'         => $tier[1],
            'weight_unit'    => $tier[2],
            'sku'            => $sku,
            'mrp_price'      => $mrp,
            'selling_price'  => $selling,
            'purchase_price' => $purchase,
            'total_sales'    => fake()->numberBetween(0, 500),
            'sort_order'     => fake()->numberBetween(1, 5),
            'status'         => 'active',
        ];
    }

    public function inactive(): static
    {
        return $this->state(['status' => 'inactive']);
    }

    // Create the three most common weight variants for a product
    public function milkVariants(): static
    {
        static $call = 0;
        $tiers = [['250ml', 250, 'ml'], ['500ml', 500, 'ml'], ['1 Litre', 1, 'l']];
        $tier  = $tiers[$call % 3];
        $call++;

        return $this->state([
            'variant_name' => $tier[0],
            'weight'       => $tier[1],
            'weight_unit'  => $tier[2],
        ]);
    }
}
