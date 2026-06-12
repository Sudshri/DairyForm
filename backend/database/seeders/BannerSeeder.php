<?php

namespace Database\Seeders;

use App\Models\Banner;
use App\Models\Category;
use Illuminate\Database\Seeder;

class BannerSeeder extends Seeder
{
    public function run(): void
    {
        $milkCategoryId = Category::where('name', 'Milk')->value('id');
        $gheeCategoryId = Category::where('name', 'Ghee')->value('id');

        $banners = [
            // Hero slider banners
            [
                'title'         => 'Farm Fresh A2 Milk – Delivered Daily',
                'subtitle'      => 'Pure, natural, no preservatives',
                'image'         => 'banners/hero-milk.jpg',
                'banner_type'   => 'slider',
                'link_type'     => 'category',
                'link_id'       => $milkCategoryId,
                'cta_text'      => 'Shop Milk',
                'sort_order'    => 1,
                'is_active'     => true,
            ],
            [
                'title'         => 'Pure Bilona Cow Ghee',
                'subtitle'      => 'Handcrafted in small batches',
                'image'         => 'banners/hero-ghee.jpg',
                'banner_type'   => 'slider',
                'link_type'     => 'category',
                'link_id'       => $gheeCategoryId,
                'cta_text'      => 'Buy Ghee',
                'sort_order'    => 2,
                'is_active'     => true,
            ],
            [
                'title'         => 'First Order 20% OFF',
                'subtitle'      => 'Use code FRESH20',
                'image'         => 'banners/hero-offer.jpg',
                'banner_type'   => 'slider',
                'link_type'     => 'none',
                'cta_text'      => 'Shop Now',
                'sort_order'    => 3,
                'is_active'     => true,
            ],
            // Offer strip banner
            [
                'title'         => '⚡ Limited Time: ₹5 OFF on 1L Milk',
                'image'         => 'banners/strip-offer.jpg',
                'banner_type'   => 'offer',
                'link_type'     => 'category',
                'link_id'       => $milkCategoryId,
                'sort_order'    => 1,
                'is_active'     => true,
                'end_date'      => now()->addDays(7),
            ],
        ];

        foreach ($banners as $banner) {
            Banner::create($banner);
        }
    }
}
