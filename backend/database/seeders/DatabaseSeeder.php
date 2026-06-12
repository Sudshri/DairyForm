<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /*
     * Seed order matters — respect foreign key dependencies.
     * Use --class=DatabaseSeeder to run all, or individual class names.
     *
     * php artisan db:seed
     * php artisan db:seed --class=ProductSeeder
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,           // 1. Users first (no deps)
            CategorySeeder::class,       // 2. Categories (self-ref)
            ProductSeeder::class,        // 3. Products + Variants + Images + Inventory
            OfferSeeder::class,          // 4. Offers + VariantOffer assignments
            BannerSeeder::class,         // 5. Banners
            DeliveryPincodeSeeder::class,// 6. Serviceable pincodes
            OrderSeeder::class,          // 7. Sample orders + items + tracking + payments
        ]);
    }
}
