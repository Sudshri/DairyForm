<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class ProductFactory extends Factory
{
    protected $model = Product::class;

    private static array $adjectives = [
        'Farm Fresh', 'Pure', 'Organic', 'Natural', 'Premium',
        'Traditional', 'Artisan', 'Handcrafted', 'Heritage',
    ];

    private static array $products = [
        'Cow Milk', 'Buffalo Milk', 'Desi Ghee', 'Paneer',
        'Dahi', 'Mawa', 'Lassi', 'Chaas', 'Butter', 'Curd',
    ];

    public function definition(): array
    {
        $adj  = fake()->randomElement(self::$adjectives);
        $prod = fake()->randomElement(self::$products);
        $name = "{$adj} {$prod}";

        return [
            'category_id'       => Category::whereNull('parent_id')->inRandomOrder()->value('id')
                                    ?? Category::factory(),
            'product_name'      => $name,
            'slug'              => Str::slug($name) . '-' . fake()->unique()->numerify('####'),
            'short_description' => fake()->sentences(2, true),
            'description'       => fake()->paragraphs(3, true),
            'is_featured'       => fake()->boolean(20),
            'is_trending'       => fake()->boolean(15),
            'total_views'       => fake()->numberBetween(0, 5000),
            'total_sales'       => fake()->numberBetween(0, 1000),
            'status'            => fake()->randomElement(['active', 'active', 'active', 'inactive']),
        ];
    }

    public function featured(): static
    {
        return $this->state([
            'is_featured' => true,
            'status'      => 'active',
        ]);
    }

    public function trending(): static
    {
        return $this->state([
            'is_trending'  => true,
            'total_views'  => fake()->numberBetween(1000, 50000),
            'status'       => 'active',
        ]);
    }

    public function inactive(): static
    {
        return $this->state(['status' => 'inactive']);
    }
}
