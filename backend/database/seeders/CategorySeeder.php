<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            [
                'name'         => 'Milk',
                'description'  => 'Farm-fresh milk in various fat percentages',
                'icon'         => '🥛',
                'sort_order'   => 1,
                'children'     => ['Full Cream Milk', 'Toned Milk', 'Double Toned', 'Buffalo Milk', 'A2 Cow Milk'],
            ],
            [
                'name'         => 'Ghee',
                'description'  => 'Pure cow and buffalo ghee',
                'icon'         => '🍯',
                'sort_order'   => 2,
                'children'     => ['Cow Ghee', 'Buffalo Ghee', 'A2 Ghee'],
            ],
            [
                'name'         => 'Butter',
                'description'  => 'Salted and unsalted butter',
                'icon'         => '🧈',
                'sort_order'   => 3,
                'children'     => ['Salted Butter', 'Unsalted Butter', 'White Butter'],
            ],
            [
                'name'         => 'Paneer',
                'description'  => 'Fresh, soft paneer made daily',
                'icon'         => '🧀',
                'sort_order'   => 4,
                'children'     => ['Soft Paneer', 'Malai Paneer'],
            ],
            [
                'name'         => 'Curd & Dahi',
                'description'  => 'Probiotic and flavoured curd',
                'icon'         => '🥣',
                'sort_order'   => 5,
                'children'     => ['Natural Dahi', 'Probiotic Curd', 'Mishti Doi'],
            ],
            [
                'name'         => 'Khoya & Mawa',
                'description'  => 'For sweets and cooking',
                'icon'         => '🍮',
                'sort_order'   => 6,
                'children'     => ['Plain Khoya', 'Granular Khoya'],
            ],
            [
                'name'         => 'Dairy Drinks',
                'description'  => 'Lassi, chaas, flavoured milk',
                'icon'         => '🥤',
                'sort_order'   => 7,
                'children'     => ['Lassi (Sweet)', 'Lassi (Salt)', 'Chaas', 'Flavoured Milk'],
            ],
            [
                'name'         => 'Cheese',
                'description'  => 'Processed and natural cheese',
                'icon'         => '🧀',
                'sort_order'   => 8,
                'children'     => ['Mozzarella', 'Cheddar', 'Processed Cheese'],
            ],
        ];

        foreach ($categories as $data) {
            $parent = Category::create([
                'name'         => $data['name'],
                'slug'         => Str::slug($data['name']),
                'description'  => $data['description'],
                'icon'         => $data['icon'],
                'sort_order'   => $data['sort_order'],
                'is_active'    => true,
                'show_in_menu' => true,
            ]);

            foreach ($data['children'] as $i => $childName) {
                Category::create([
                    'parent_id'    => $parent->id,
                    'name'         => $childName,
                    'slug'         => Str::slug($childName),
                    'sort_order'   => $i + 1,
                    'is_active'    => true,
                    'show_in_menu' => false,
                ]);
            }
        }
    }
}
