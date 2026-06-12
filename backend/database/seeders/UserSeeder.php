<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // ── Super Admin ──────────────────────────────────────────────────────
        User::create([
            'name'               => 'Admin',
            'email'              => 'admin@dairyform.local',
            'phone'              => '9000000001',
            'email_verified_at'  => now(),
            'phone_verified_at'  => now(),
            'password'           => Hash::make('password'),
            'role'               => 'admin',
            'is_active'          => true,
        ]);

        // ── Delivery Agent ───────────────────────────────────────────────────
        User::create([
            'name'               => 'Delivery Agent 1',
            'email'              => 'agent1@dairyform.local',
            'phone'              => '9000000002',
            'phone_verified_at'  => now(),
            'password'           => Hash::make('password'),
            'role'               => 'delivery_agent',
            'is_active'          => true,
        ]);

        // ── Sample Customers ─────────────────────────────────────────────────
        $customers = [
            ['name' => 'Ramesh Kumar',   'phone' => '9876543210', 'email' => 'ramesh@example.com'],
            ['name' => 'Priya Sharma',   'phone' => '9876543211', 'email' => 'priya@example.com'],
            ['name' => 'Anita Desai',    'phone' => '9876543212', 'email' => 'anita@example.com'],
            ['name' => 'Suresh Patel',   'phone' => '9876543213', 'email' => 'suresh@example.com'],
            ['name' => 'Kavita Singh',   'phone' => '9876543214', 'email' => 'kavita@example.com'],
        ];

        foreach ($customers as $customer) {
            User::create([
                'name'               => $customer['name'],
                'email'              => $customer['email'],
                'phone'              => $customer['phone'],
                'phone_verified_at'  => now(),
                'password'           => Hash::make('password'),
                'role'               => 'customer',
                'is_active'          => true,
            ]);
        }

        // ── Random customers via Factory ─────────────────────────────────────
        User::factory()->count(50)->create(['role' => 'customer']);
    }
}
