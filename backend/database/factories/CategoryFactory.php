<?php

namespace Database\Factories;

use App\Models\Category;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

class CategoryFactory extends Factory
{
    protected $model = Category::class;

    private static array $dairyCategories = [
        'Organic Milk', 'Goat Milk', 'Cheese Spreads',
        'Cream', 'Ice Cream Mix', 'Whey Protein',
    ];

    private static int $index = 0;

    public function definition(): array
    {
        $name = self::$dairyCategories[self::$index % count(self::$dairyCategories)] ?? fake()->words(2, true);
        self::$index++;

        return [
            'parent_id'    => null,
            'name'         => $name,
            'slug'         => Str::slug($name) . '-' . fake()->unique()->numerify('##'),
            'description'  => fake()->sentence(),
            'sort_order'   => fake()->numberBetween(1, 20),
            'is_active'    => true,
            'show_in_menu' => fake()->boolean(70),
        ];
    }

    public function subcategory(Category $parent): static
    {
        return $this->state(['parent_id' => $parent->id]);
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }
}
