<?php

namespace Database\Factories;

use App\Models\Product;
use App\Models\Review;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

class ReviewFactory extends Factory
{
    protected $model = Review::class;

    private static array $reviewTitles = [
        5 => ['Absolutely amazing!', 'Best dairy I\'ve tried', 'Pure and fresh', 'Love this product!', 'Excellent quality'],
        4 => ['Very good', 'Fresh and tasty', 'Good value', 'Would recommend', 'Good product'],
        3 => ['Decent product', 'Average quality', 'Okay for the price', 'Could be better'],
        2 => ['Not very fresh', 'Expected better', 'Mediocre', 'Disappointed'],
        1 => ['Poor quality', 'Not fresh', 'Very disappointed', 'Would not recommend'],
    ];

    private static array $reviewComments = [
        'The milk is incredibly fresh. You can taste the difference from store brands.',
        'A2 ghee quality is top-notch. The aroma is exactly like my grandmother used to make.',
        'Paneer is soft and fresh. Perfect for curries and grilling.',
        'Delivery was on time and packaging kept everything fresh.',
        'The curd is thick and creamy, just like homemade.',
        'Value for money. Will definitely order again.',
        'The freshness really comes through. Highly recommend!',
        'Quality could be more consistent. Sometimes excellent, sometimes average.',
        'Good product but slightly expensive for the quantity.',
        'The ghee has a beautiful golden colour and excellent taste.',
    ];

    public function definition(): array
    {
        $rating = fake()->numberBetween(1, 5);

        return [
            'user_id'               => User::where('role', 'customer')->inRandomOrder()->value('id')
                                       ?? User::factory()->create(['role' => 'customer'])->id,
            'product_id'            => Product::where('status', 'active')->inRandomOrder()->value('id')
                                       ?? Product::factory(),
            'order_item_id'         => null,
            'rating'                => $rating,
            'title'                 => fake()->randomElement(self::$reviewTitles[$rating]),
            'comment'               => fake()->randomElement(self::$reviewComments),
            'is_verified_purchase'  => fake()->boolean(60),
            'is_approved'           => fake()->boolean(80),
            'is_featured'           => fake()->boolean(10),
            'helpful_count'         => fake()->numberBetween(0, 50),
            'created_at'            => fake()->dateTimeBetween('-6 months', 'now'),
        ];
    }

    public function approved(): static
    {
        return $this->state(['is_approved' => true]);
    }

    public function verified(): static
    {
        return $this->state(['is_verified_purchase' => true]);
    }

    public function fiveStar(): static
    {
        return $this->state([
            'rating'      => 5,
            'title'       => 'Absolutely amazing!',
            'is_approved' => true,
        ]);
    }
}
