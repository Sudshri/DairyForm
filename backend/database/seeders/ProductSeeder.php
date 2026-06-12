<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductVariantInventory;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /*
     * Variant matrix format:
     * [ variant_name, weight, weight_unit, mrp, selling_price, purchase_price, sku_suffix, stock_kg ]
     */
    private array $products = [
        [
            'name'        => 'Farm Fresh Full Cream Milk A2',
            'category'    => 'Milk',
            'description' => 'Premium A2 full cream milk from Gir cows, rich in natural vitamins and calcium.',
            'is_featured' => true,
            'is_trending' => true,
            'variants'    => [
                ['250ml', 250, 'ml', 18,  15,  8,  '250ML', 50],
                ['500ml', 500, 'ml', 35,  30,  16, '500ML', 100],
                ['1 Litre', 1, 'l', 65,  58,  30, '1L',   200],
                ['2 Litre', 2, 'l', 125, 110, 58, '2L',   100],
            ],
        ],
        [
            'name'        => 'Pure Cow Ghee A2',
            'category'    => 'Ghee',
            'description' => 'Handcrafted A2 cow ghee using traditional bilona method. Rich aroma and taste.',
            'is_featured' => true,
            'is_trending' => true,
            'variants'    => [
                ['250g', 250, 'g', 380,  350, 220, '250G', 25],
                ['500g', 500, 'g', 720,  680, 430, '500G', 50],
                ['1kg',  1000,'g', 1400, 1300,840, '1KG',  30],
            ],
        ],
        [
            'name'        => 'Homestyle Butter Unsalted',
            'category'    => 'Butter',
            'description' => 'Creamy, white unsalted butter made from fresh cream. Perfect for cooking and baking.',
            'is_featured' => false,
            'is_trending' => true,
            'variants'    => [
                ['100g', 100, 'g', 80,  72,  45, '100G', 20],
                ['250g', 250, 'g', 185, 170, 105,'250G', 40],
                ['500g', 500, 'g', 360, 330, 205,'500G', 30],
            ],
        ],
        [
            'name'        => 'Fresh Soft Paneer',
            'category'    => 'Paneer',
            'description' => 'Freshly made, soft paneer. Made fresh each morning with pure whole milk.',
            'is_featured' => true,
            'is_trending' => false,
            'variants'    => [
                ['200g', 200, 'g', 100, 90,  55, '200G', 15],
                ['500g', 500, 'g', 240, 220, 135,'500G', 25],
                ['1kg',  1000,'g', 460, 420, 260,'1KG',  10],
            ],
        ],
        [
            'name'        => 'Probiotic Dahi',
            'category'    => 'Curd & Dahi',
            'description' => 'Naturally fermented probiotic dahi with live cultures. Promotes healthy digestion.',
            'is_featured' => false,
            'is_trending' => false,
            'variants'    => [
                ['200g', 200, 'g', 35,  30,  18, '200G', 30],
                ['400g', 400, 'g', 65,  58,  34, '400G', 40],
                ['1kg',  1000,'g', 150, 135, 80, '1KG',  25],
            ],
        ],
        [
            'name'        => 'Pure Buffalo Ghee',
            'category'    => 'Ghee',
            'description' => 'Rich and flavourful buffalo ghee. Higher fat content, great for traditional recipes.',
            'is_featured' => false,
            'is_trending' => false,
            'variants'    => [
                ['250g', 250, 'g', 340, 310, 190,'250G', 20],
                ['500g', 500, 'g', 650, 600, 375,'500G', 35],
                ['1kg',  1000,'g', 1250,1150,730,'1KG',  15],
            ],
        ],
        [
            'name'        => 'Sweet Lassi',
            'category'    => 'Dairy Drinks',
            'description' => 'Thick, chilled sweet lassi made from full cream dahi. Refreshing and energising.',
            'is_featured' => false,
            'is_trending' => true,
            'variants'    => [
                ['200ml', 200, 'ml', 50,  45,  25, '200ML', 40],
                ['500ml', 500, 'ml', 115, 100, 55, '500ML', 30],
            ],
        ],
        [
            'name'        => 'Mishti Doi',
            'category'    => 'Curd & Dahi',
            'description' => 'Bengali-style sweetened yogurt, set in traditional clay pots for authentic flavour.',
            'is_featured' => true,
            'is_trending' => false,
            'variants'    => [
                ['100g', 100, 'g', 45,  40,  22, '100G', 20],
                ['250g', 250, 'g', 105, 95,  52, '250G', 25],
                ['500g', 500, 'g', 200, 180, 100,'500G', 15],
            ],
        ],
    ];

    public function run(): void
    {
        foreach ($this->products as $productData) {
            $category = Category::where('name', $productData['category'])->first();

            if (! $category) {
                $this->command->warn("Category '{$productData['category']}' not found — skipping.");
                continue;
            }

            $slug = Str::slug($productData['name']);
            $baseSkuPrefix = strtoupper(
                implode('', array_map(fn($w) => $w[0], explode(' ', $productData['name'])))
            );

            $product = Product::create([
                'category_id'       => $category->id,
                'product_name'      => $productData['name'],
                'slug'              => $slug,
                'short_description' => substr($productData['description'], 0, 150),
                'description'       => $productData['description'],
                'is_featured'       => $productData['is_featured'],
                'is_trending'       => $productData['is_trending'],
                'status'            => 'active',
            ]);

            foreach ($productData['variants'] as $v) {
                [$variantName, $weight, $unit, $mrp, $selling, $purchase, $skuSuffix, $stockKg] = $v;

                $variant = ProductVariant::create([
                    'product_id'     => $product->id,
                    'variant_name'   => $variantName,
                    'weight'         => $weight,
                    'weight_unit'    => $unit,
                    'sku'            => "{$baseSkuPrefix}-{$skuSuffix}",
                    'mrp_price'      => $mrp,
                    'selling_price'  => $selling,
                    'purchase_price' => $purchase,
                    'status'         => 'active',
                ]);

                $availableKg = $stockKg;
                ProductVariantInventory::create([
                    'product_variant_id' => $variant->id,
                    'stock_kg'           => $availableKg,
                    'reserved_stock_kg'  => 0,
                    'low_stock_alert_kg' => max(2, $availableKg * 0.1),
                    'reorder_level_kg'   => max(5, $availableKg * 0.2),
                    'stock_status'       => $availableKg > 10 ? 'in_stock' : ($availableKg > 0 ? 'low_stock' : 'out_of_stock'),
                ]);
            }
        }

        // Additional random products via factory
        \App\Models\Category::whereNull('parent_id')->get()->each(function ($category) {
            Product::factory()
                ->count(3)
                ->for($category)
                ->has(
                    ProductVariant::factory()
                        ->count(3)
                        ->has(ProductVariantInventory::factory(), 'inventory'),
                    'variants'
                )
                ->create();
        });
    }
}
