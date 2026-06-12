<?php

namespace Database\Seeders;

use App\Models\Offer;
use App\Models\ProductVariant;
use App\Models\VariantOffer;
use Illuminate\Database\Seeder;

class OfferSeeder extends Seeder
{
    public function run(): void
    {
        // ── 1. Flat ₹5 OFF on Milk 1L variant ────────────────────────────────
        $fixed5 = Offer::create([
            'offer_name'    => '₹5 OFF on Milk 1 Litre',
            'offer_code'    => null,        // Auto-applied, no code needed
            'offer_type'    => 'fixed',
            'discount_value'=> 5.00,
            'start_date'    => now(),
            'end_date'      => now()->addMonths(3),
            'is_active'     => true,
            'is_public'     => true,
        ]);

        $milkVariant1L = ProductVariant::where('sku', 'FFFCMA-1L')->first();
        if ($milkVariant1L) {
            VariantOffer::create([
                'product_variant_id' => $milkVariant1L->id,
                'offer_id'           => $fixed5->id,
                'is_active'          => true,
            ]);
        }

        // ── 2. 10% OFF on Milk 500ml ──────────────────────────────────────────
        $percent10 = Offer::create([
            'offer_name'           => '10% OFF on Milk 500ml',
            'offer_type'           => 'percentage',
            'discount_value'       => 10.00,
            'max_discount_amount'  => 5.00,
            'start_date'           => now(),
            'end_date'             => now()->addMonths(2),
            'is_active'            => true,
            'is_public'            => true,
        ]);

        $milkVariant500 = ProductVariant::where('sku', 'FFFCMA-500ML')->first();
        if ($milkVariant500) {
            VariantOffer::create([
                'product_variant_id' => $milkVariant500->id,
                'offer_id'           => $percent10->id,
                'is_active'          => true,
            ]);
        }

        // ── 3. Coupon: GHEE50 — ₹50 OFF on orders above ₹500 ────────────────
        Offer::create([
            'offer_name'       => '₹50 OFF on Ghee Order',
            'offer_code'       => 'GHEE50',
            'offer_type'       => 'fixed',
            'discount_value'   => 50.00,
            'min_order_amount' => 500.00,
            'start_date'       => now(),
            'end_date'         => now()->addMonth(),
            'is_active'        => true,
            'is_public'        => false,   // Coupon-code only
            'usage_limit'      => 200,
            'per_user_limit'   => 1,
        ]);

        // ── 4. Coupon: FRESH20 — 20% OFF first order ─────────────────────────
        Offer::create([
            'offer_name'           => '20% OFF Your First Order',
            'offer_code'           => 'FRESH20',
            'offer_type'           => 'percentage',
            'discount_value'       => 20.00,
            'max_discount_amount'  => 100.00,
            'start_date'           => now(),
            'end_date'             => now()->addMonths(6),
            'is_active'            => true,
            'is_public'            => false,
            'usage_limit'          => 1000,
            'per_user_limit'       => 1,
        ]);

        // ── 5. Category offer: 5% OFF on all Butter variants ─────────────────
        $butterCategory = \App\Models\Category::where('name', 'Butter')->first();

        Offer::create([
            'offer_name'                => '5% OFF on All Butter',
            'offer_type'                => 'category',
            'discount_value'            => 5.00,
            'applicable_category_id'    => $butterCategory?->id,
            'start_date'                => now(),
            'end_date'                  => now()->addMonths(2),
            'is_active'                 => true,
            'is_public'                 => true,
        ]);

        // Assign butter category offer to all butter variants
        if ($butterCategory) {
            $butterProducts = $butterCategory->products()->with('variants')->get();
            $butterProducts->each(function ($product) use ($percent10) {
                // Re-use percent10 offer or create a dedicated one
            });
        }
    }
}
