<?php

namespace Database\Factories;

use App\Models\ProductVariantInventory;
use Illuminate\Database\Eloquent\Factories\Factory;

class ProductVariantInventoryFactory extends Factory
{
    protected $model = ProductVariantInventory::class;

    public function definition(): array
    {
        $stock = fake()->randomFloat(2, 0, 500);

        $status = match (true) {
            $stock <= 0    => 'out_of_stock',
            $stock <= 10   => 'low_stock',
            default        => 'in_stock',
        };

        return [
            // product_variant_id set by relationship
            'stock_kg'             => $stock,
            'reserved_stock_kg'    => fake()->randomFloat(2, 0, min($stock * 0.1, 20)),
            'low_stock_alert_kg'   => fake()->randomFloat(1, 2, 10),
            'reorder_level_kg'     => fake()->randomFloat(1, 5, 20),
            'stock_status'         => $status,
            'last_restocked_at'    => $stock > 0 ? fake()->dateTimeBetween('-30 days', 'now') : null,
        ];
    }

    public function inStock(): static
    {
        return $this->state([
            'stock_kg'           => fake()->randomFloat(2, 50, 500),
            'reserved_stock_kg'  => 0,
            'stock_status'       => 'in_stock',
            'last_restocked_at'  => now()->subDays(rand(1, 7)),
        ]);
    }

    public function lowStock(): static
    {
        return $this->state([
            'stock_kg'    => fake()->randomFloat(2, 1, 9.99),
            'stock_status'=> 'low_stock',
        ]);
    }

    public function outOfStock(): static
    {
        return $this->state([
            'stock_kg'           => 0,
            'reserved_stock_kg'  => 0,
            'stock_status'       => 'out_of_stock',
        ]);
    }
}
