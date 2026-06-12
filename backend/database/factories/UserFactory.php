<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    protected $model = User::class;

    public function definition(): array
    {
        return [
            'name'               => fake()->name(),
            'email'              => fake()->unique()->safeEmail(),
            'phone'              => '9' . fake()->unique()->numerify('########'),
            'email_verified_at'  => now(),
            'phone_verified_at'  => now(),
            'password'           => Hash::make('password'),
            'gender'             => fake()->randomElement(['male', 'female', 'other']),
            'date_of_birth'      => fake()->dateTimeBetween('-60 years', '-18 years')->format('Y-m-d'),
            'role'               => 'customer',
            'is_active'          => true,
            'last_login_at'      => fake()->dateTimeBetween('-30 days', 'now'),
        ];
    }

    public function admin(): static
    {
        return $this->state(['role' => 'admin']);
    }

    public function inactive(): static
    {
        return $this->state(['is_active' => false]);
    }

    public function unverified(): static
    {
        return $this->state([
            'email_verified_at' => null,
            'phone_verified_at' => null,
        ]);
    }
}
