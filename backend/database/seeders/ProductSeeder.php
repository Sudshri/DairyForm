<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /*
     * Pricing reference — Rajasthan market rates
     * ─────────────────────────────────────────────────────────────
     * Milk       250ml  MRP  16 | Sell  14 | Purchase   9
     * Milk       500ml  MRP  30 | Sell  27 | Purchase  17
     * Milk      1000ml  MRP  58 | Sell  52 | Purchase  33
     *
     * Dairy       250g  MRP  55 | Sell  48 | Purchase  32
     * Dairy       500g  MRP 105 | Sell  92 | Purchase  62
     * Dairy        1kg  MRP 200 | Sell 178 | Purchase 118
     *
     * Ice Cream   250g  MRP  75 | Sell  65 | Purchase  42
     * Ice Cream   500g  MRP 140 | Sell 122 | Purchase  80
     * Ice Cream    1kg  MRP 260 | Sell 228 | Purchase 148
     */

    // ── Variant helpers ────────────────────────────────────────────────────────

    private static function milkVariants(string $prefix): array
    {
        return [
            [
                'variant_name'   => '250ml',
                'weight'         => 250,
                'weight_unit'    => 'ml',
                'sku'            => $prefix . '-250',
                'mrp_price'      => 16.00,
                'selling_price'  => 14.00,
                'purchase_price' => 9.00,
                'sort_order'     => 0,
            ],
            [
                'variant_name'   => '500ml',
                'weight'         => 500,
                'weight_unit'    => 'ml',
                'sku'            => $prefix . '-500',
                'mrp_price'      => 30.00,
                'selling_price'  => 27.00,
                'purchase_price' => 17.00,
                'sort_order'     => 1,
            ],
            [
                'variant_name'   => '1L',
                'weight'         => 1000,
                'weight_unit'    => 'ml',
                'sku'            => $prefix . '-1000',
                'mrp_price'      => 58.00,
                'selling_price'  => 52.00,
                'purchase_price' => 33.00,
                'sort_order'     => 2,
            ],
        ];
    }

    private static function dairyVariants(string $prefix, array $p250, array $p500, array $p1kg): array
    {
        return [
            [
                'variant_name'   => '250g',
                'weight'         => 250,
                'weight_unit'    => 'g',
                'sku'            => $prefix . '-250G',
                'mrp_price'      => $p250[0],
                'selling_price'  => $p250[1],
                'purchase_price' => $p250[2],
                'sort_order'     => 0,
            ],
            [
                'variant_name'   => '500g',
                'weight'         => 500,
                'weight_unit'    => 'g',
                'sku'            => $prefix . '-500G',
                'mrp_price'      => $p500[0],
                'selling_price'  => $p500[1],
                'purchase_price' => $p500[2],
                'sort_order'     => 1,
            ],
            [
                'variant_name'   => '1kg',
                'weight'         => 1,
                'weight_unit'    => 'kg',
                'sku'            => $prefix . '-1KG',
                'mrp_price'      => $p1kg[0],
                'selling_price'  => $p1kg[1],
                'purchase_price' => $p1kg[2],
                'sort_order'     => 2,
            ],
        ];
    }

    // ── Product catalogue ──────────────────────────────────────────────────────

    private function products(): array
    {
        return [

            /* ─── Category 1 : Milk ──────────────────────────────────────── */

            [
                'category_id'       => 1,
                'product_name'      => 'Mixed Milk',
                'slug'              => 'mixed-milk',
                'short_description' => 'A perfectly balanced blend of cow and buffalo milk — delivering the richness of both in every sip.',
                'description'       => 'EverFresh Mixed Milk is crafted from a carefully balanced combination of fresh cow and buffalo milk collected from our partnered farms in Rajasthan. The blend delivers the ideal fat percentage for everyday use — creamy enough for tea and lassi, yet light enough for direct consumption. Processed under strict hygiene protocols within hours of collection, it retains natural proteins, calcium, and vitamins essential for your family\'s daily nutrition.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Mixed Milk – Cow & Buffalo Blend | Pure & Fresh',
                'meta_description'  => 'Buy EverFresh Mixed Milk online. A balanced blend of fresh cow and buffalo milk from Rajasthan farms. Available in 250ml, 500ml & 1L packs.',
                'variants'          => self::milkVariants('MIXED-MILK'),
            ],

            [
                'category_id'       => 1,
                'product_name'      => 'Buffalo Milk',
                'slug'              => 'buffalo-milk',
                'short_description' => 'Rich, creamy buffalo milk sourced fresh from well-cared Murrah buffalo herds for superior taste and nutrition.',
                'description'       => 'EverFresh Buffalo Milk is sourced exclusively from healthy Murrah breed buffaloes raised on natural fodder across our network of farms in Rajasthan. With a naturally higher fat content compared to cow milk, it is the preferred choice for making paneer, khoa, ghee, and rich desserts at home. Each batch is chilled within two hours of milking and processed same-day to preserve its fresh, creamy character. A trusted choice for families who value full-bodied, nutritious dairy.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => true,
                'meta_title'        => 'EverFresh Buffalo Milk – Rich & Creamy | Farm Fresh Daily',
                'meta_description'  => 'Order EverFresh Buffalo Milk – high-fat, creamy milk from Murrah buffaloes. Perfect for tea, sweets & daily use. Available in 250ml, 500ml & 1L.',
                'variants'          => self::milkVariants('BUFFALO-MILK'),
            ],

            [
                'category_id'       => 1,
                'product_name'      => 'Cow Milk',
                'slug'              => 'cow-milk',
                'short_description' => 'Pure, wholesome cow milk from indigenous breeds — light, easily digestible and ideal for daily family consumption.',
                'description'       => 'EverFresh Cow Milk is sourced from indigenous Gir and Sahiwal cows maintained at our partner farms under ethical, free-grazing conditions. Known for its lighter texture and easy digestibility, it is particularly suited for children, the elderly, and health-conscious individuals. Rich in natural A2 proteins, calcium and essential micro-nutrients, our cow milk supports strong bones, better immunity and overall wellness. Collected twice daily and dispatched fresh, it reaches you in optimal condition every morning.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Cow Milk – Pure A2 Milk | Light & Nutritious',
                'meta_description'  => 'Buy EverFresh Cow Milk from indigenous breeds. Light, easily digestible and rich in natural proteins. Fresh delivery in 250ml, 500ml & 1L.',
                'variants'          => self::milkVariants('COW-MILK'),
            ],

            [
                'category_id'       => 1,
                'product_name'      => 'Double Toned Milk',
                'slug'              => 'double-toned-milk',
                'short_description' => 'Low-fat double toned milk ideal for calorie-conscious individuals without compromising on essential nutrition.',
                'description'       => 'EverFresh Double Toned Milk is standardised to 1.5% fat and 9% SNF, making it the perfect choice for health-conscious consumers who need the nutrition of dairy without excess calories. It retains natural calcium, Vitamin D and proteins essential for daily bodily functions while helping manage weight effectively. Ideal for individuals on a low-fat diet, diabetic patients and fitness enthusiasts. Processed using advanced pasteurisation and packed fresh daily for purity you can taste.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Double Toned Milk – Low Fat | Healthy Daily Milk',
                'meta_description'  => 'EverFresh Double Toned Milk with 1.5% fat. Low-calorie, high-nutrition milk ideal for health-conscious families. Available in 250ml, 500ml & 1L.',
                'variants'          => self::milkVariants('DTONED-MILK'),
            ],

            [
                'category_id'       => 1,
                'product_name'      => 'Skimmed Milk',
                'slug'              => 'skimmed-milk',
                'short_description' => 'Fat-free skimmed milk retaining all essential proteins and calcium — the smart choice for a healthy lifestyle.',
                'description'       => 'EverFresh Skimmed Milk contains less than 0.5% fat with all the natural goodness of milk intact. Fortified with Vitamins A and D to compensate for fat-soluble nutrient reduction during skimming, it delivers a high-protein, low-calorie profile that supports muscle recovery, bone strength and metabolic health. An excellent choice for gym-goers, weight management programmes, cardiac patients and anyone seeking the full benefits of dairy without the fat. Hygienically processed and packed fresh every day.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Skimmed Milk – Fat Free | High Protein Dairy',
                'meta_description'  => 'Buy EverFresh Skimmed Milk – fat-free, fortified with Vitamins A & D. Ideal for weight management and healthy living. Available in 250ml, 500ml & 1L.',
                'variants'          => self::milkVariants('SKIM-MILK'),
            ],

            [
                'category_id'       => 1,
                'product_name'      => 'Toned Milk',
                'slug'              => 'toned-milk',
                'short_description' => 'Standardised toned milk with 3% fat — nutritious, affordable and versatile for every kitchen and lifestyle.',
                'description'       => 'EverFresh Toned Milk is standardised to 3% fat and 8.5% SNF, making it one of the most widely preferred everyday milk variants across Rajasthan. It strikes the perfect balance between creaminess and lightness — suitable for tea, coffee, cooking, and direct consumption alike. Processed using advanced pasteurisation technology to eliminate harmful bacteria while retaining natural nutrients. Packed hygienically and delivered fresh every day, EverFresh Toned Milk is the everyday dairy companion for millions of Indian households.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => true,
                'meta_title'        => 'EverFresh Toned Milk – 3% Fat | Everyday Pure Milk',
                'meta_description'  => 'Order EverFresh Toned Milk – standardised to 3% fat. Perfect for tea, cooking & daily use. Fresh, hygienic, affordable. 250ml, 500ml & 1L packs.',
                'variants'          => self::milkVariants('TONED-MILK'),
            ],

            /* ─── Category 2 : Paneer & Cheese ──────────────────────────── */

            [
                'category_id'       => 2,
                'product_name'      => 'Chhana & Paneer',
                'slug'              => 'chhana-paneer',
                'short_description' => 'Soft, fresh chhana and paneer made daily from full-fat milk — perfect for sweets, curries and everyday cooking.',
                'description'       => 'EverFresh Chhana & Paneer is prepared fresh every morning using full-fat buffalo and cow milk, coagulated naturally with food-grade acids to achieve the ideal soft, spongy texture. Our paneer holds its shape through cooking while remaining melt-in-the-mouth tender. Rich in protein and calcium, it is the foundation of classic Indian dishes like palak paneer, paneer tikka, rasgulla and sandesh. Free from additives and preservatives — a staple every Indian kitchen deserves.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => true,
                'meta_title'        => 'EverFresh Chhana & Paneer – Fresh Daily | Soft & Pure',
                'meta_description'  => 'Buy EverFresh Chhana & Paneer – made fresh daily from full-fat milk. No additives, perfect for curries and sweets. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('CHHANA-PANEER',
                    [55.00,  48.00,  32.00],
                    [105.00, 92.00,  62.00],
                    [200.00, 178.00, 118.00]
                ),
            ],

            /* ─── Category 4 : Traditional Dairy Products ───────────────── */

            [
                'category_id'       => 4,
                'product_name'      => 'Khoa',
                'slug'              => 'khoa',
                'short_description' => 'Traditional slow-cooked khoa made from pure buffalo milk — the essential base for authentic Indian sweets.',
                'description'       => 'EverFresh Khoa is prepared using the traditional method of slow-simmering fresh buffalo milk in open iron vessels until it reduces to a dense, granular solid. It forms the foundation of India\'s most beloved mithai — gulab jamun, barfi, halwa, kalakand and peda. We use no powder milk, no starch fillers and no artificial thickeners. What you get is pure, naturally concentrated milk solids with the authentic aroma and texture that no shortcut can replicate. Trusted by halwais and home cooks across Rajasthan.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Khoa – Pure Traditional Mawa | No Fillers',
                'meta_description'  => 'Order EverFresh Khoa (Mawa) – slow-cooked from pure buffalo milk. No fillers or powder. Perfect for gulab jamun, barfi & halwa. 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('KHOA',
                    [80.00,  70.00,  46.00],
                    [155.00, 136.00, 90.00],
                    [295.00, 258.00, 170.00]
                ),
            ],

            [
                'category_id'       => 4,
                'product_name'      => 'Chakka',
                'slug'              => 'chakka',
                'short_description' => 'Thick, strained chakka (hung curd) made from fresh full-fat milk — the base for shrikhand and mishti doi.',
                'description'       => 'EverFresh Chakka is produced by straining fresh full-fat dahi through muslin cloth until it achieves a dense, creamy consistency free of excess whey. It is the primary ingredient for shrikhand — the iconic Rajasthani and Maharashtrian dessert — as well as for chakka basundi and flavoured mishti doi. With a naturally rich texture and mild tangy flavour, EverFresh Chakka saves hours of preparation while delivering the same authentic result. Hygienically packed in cold storage conditions to maintain freshness and probiotic culture integrity.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Chakka – Hung Curd for Shrikhand | Fresh Daily',
                'meta_description'  => 'Buy EverFresh Chakka – thick strained curd ideal for shrikhand and desserts. Made from fresh full-fat milk. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('CHAKKA',
                    [60.00,  52.00,  34.00],
                    [115.00, 100.00, 66.00],
                    [218.00, 190.00, 125.00]
                ),
            ],

            /* ─── Category 5 : Cheese Products ──────────────────────────── */

            [
                'category_id'       => 5,
                'product_name'      => 'Danbo Cheese',
                'slug'              => 'danbo-cheese',
                'short_description' => 'Mild, semi-hard Danbo cheese with a smooth texture and delicate flavour — ideal for sandwiches, snacks and cooking.',
                'description'       => 'EverFresh Danbo Cheese is crafted using the traditional Danish cheese-making technique adapted with locally sourced premium cow milk from Rajasthan. It is a semi-hard, mild-flavoured cheese that ages gracefully, developing a smooth, slightly elastic body with small irregular eyes. Its clean, buttery taste makes it highly versatile — slice it for sandwiches and wraps, cube it for salads, melt it into sauces or enjoy it as a snack with crackers. Made without artificial colouring or preservatives, matured under controlled cold-room conditions for consistent quality every block.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Danbo Cheese – Semi-Hard | Mild & Creamy',
                'meta_description'  => 'Buy EverFresh Danbo Cheese – mild, semi-hard Danish-style cheese made from premium Rajasthan milk. No artificial additives. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('DANBO-CHEESE',
                    [120.00, 105.00,  68.00],
                    [230.00, 200.00, 130.00],
                    [440.00, 384.00, 248.00]
                ),
            ],

            /* ─── Category 3 : Ice Cream & Frozen Desserts ──────────────── */

            [
                'category_id'       => 3,
                'product_name'      => 'Ice Cream',
                'slug'              => 'ice-cream',
                'short_description' => 'Classic, creamy vanilla ice cream made from fresh full-fat milk and natural flavours — a timeless family treat.',
                'description'       => 'EverFresh Ice Cream begins with fresh full-fat milk and cream sourced directly from our farm network, churned to perfection with natural vanilla extract and just the right measure of cane sugar. No synthetic emulsifiers, no artificial colours — just pure dairy indulgence in every scoop. The slow-freeze process creates a consistently smooth, dense texture that resists quick melting in Rajasthan\'s warm climate. Whether served in a cone, cup, or alongside hot gulab jamun, EverFresh Ice Cream delivers the classic flavour that never goes out of style.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => true,
                'meta_title'        => 'EverFresh Ice Cream – Classic Vanilla | Pure & Creamy',
                'meta_description'  => 'Order EverFresh Vanilla Ice Cream – made from fresh milk and natural flavours. No artificial colours. Perfect for family desserts. 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('ICE-CREAM',
                    [75.00,  65.00,  42.00],
                    [140.00, 122.00, 80.00],
                    [260.00, 228.00, 148.00]
                ),
            ],

            [
                'category_id'       => 3,
                'product_name'      => 'Kulfi',
                'slug'              => 'kulfi',
                'short_description' => 'Authentic slow-frozen kulfi made from reduced full-fat milk, cardamom and real pistachios — a traditional Indian indulgence.',
                'description'       => 'EverFresh Kulfi is prepared the traditional way — fresh full-fat milk is slowly simmered and reduced to half its volume before being flavoured with green cardamom, crushed pistachios and a hint of saffron. Unlike regular ice cream, kulfi is not aerated, resulting in a denser, richer texture that melts slowly and delivers an intensely creamy, nutty experience. Poured into classic kulfi moulds and slow-frozen to lock in every nuance of flavour. A beloved summer tradition and festive staple, EverFresh Kulfi brings authentic Indian mithai culture to your doorstep.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => true,
                'meta_title'        => 'EverFresh Kulfi – Traditional Malai Kulfi | Pista & Cardamom',
                'meta_description'  => 'Buy EverFresh Kulfi – slow-frozen traditional kulfi with cardamom and pistachios. Dense, creamy and authentic. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('KULFI',
                    [80.00,  70.00,  46.00],
                    [150.00, 132.00, 86.00],
                    [280.00, 245.00, 160.00]
                ),
            ],

            [
                'category_id'       => 3,
                'product_name'      => 'Chocolate Ice Cream',
                'slug'              => 'chocolate-ice-cream',
                'short_description' => 'Rich, velvety chocolate ice cream made with real cocoa and fresh dairy — an irresistible treat for every age.',
                'description'       => 'EverFresh Chocolate Ice Cream is blended with premium quality unsweetened cocoa powder and a touch of dark chocolate compound, combined with fresh cream and full-fat milk from our Rajasthan farms. The result is a deeply flavoured, velvety dessert with rich chocolate intensity that lingers on the palate. No artificial chocolate flavours — only real cocoa for that bold, satisfying taste. Churned slowly for maximum creaminess, it is the most popular flavour in our EverFresh range and the definitive crowd-pleaser at every occasion.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => true,
                'meta_title'        => 'EverFresh Chocolate Ice Cream – Real Cocoa | Rich & Creamy',
                'meta_description'  => 'Order EverFresh Chocolate Ice Cream – made with real cocoa and fresh dairy. No artificial flavours. A family favourite. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('CHOC-ICE-CREAM',
                    [80.00,  70.00,  46.00],
                    [150.00, 132.00, 86.00],
                    [280.00, 245.00, 160.00]
                ),
            ],

            [
                'category_id'       => 3,
                'product_name'      => 'Softy Ice Cream',
                'slug'              => 'softy-ice-cream',
                'short_description' => 'Smooth, airy softy ice cream that yields perfect soft-serve texture — ready for cones, cups and toppings.',
                'description'       => 'EverFresh Softy Ice Cream is our signature soft-serve formulation created from fresh milk, cream and select stabilisers that produce the characteristic light, airy swirl texture of classic soft ice cream. Balanced in sweetness with a clean milky finish, it pairs beautifully with chocolate sauce, strawberry crush, dry fruits and wafer cones. It overruns optimally in standard soft-serve machines for consistent volume and texture every time. Ideal for restaurants, cafes, food courts and home soft-serve machines. Packed fresh under optimal cold-chain conditions.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Softy Ice Cream – Soft-Serve | Smooth & Airy',
                'meta_description'  => 'Buy EverFresh Softy Ice Cream – perfect soft-serve texture for cones & cups. Ideal for cafes and home use. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('SOFTY-ICE-CREAM',
                    [70.00,  60.00,  39.00],
                    [130.00, 114.00, 74.00],
                    [248.00, 216.00, 140.00]
                ),
            ],

            [
                'category_id'       => 3,
                'product_name'      => 'Milk Ice',
                'slug'              => 'milk-ice',
                'short_description' => 'Refreshing milk ice bars made from pure dairy milk and natural fruit essences — a cool treat for sunny Rajasthan days.',
                'description'       => 'EverFresh Milk Ice is a frozen dairy treat made from fresh pasteurised milk sweetened naturally and flavoured with food-grade fruit essences including mango, strawberry and rose. Unlike synthetic ice pops, our milk ice contains real dairy solids that lend a creamy richness beneath the light, icy texture. Low in calories compared to full-fat ice cream, it is a perfect cooling option for children and health-conscious adults during the scorching Rajasthan summers. Made without artificial colours and packed in individual portion-ready formats for convenience.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Milk Ice – Dairy Frozen Bar | Natural Fruit Flavours',
                'meta_description'  => 'Buy EverFresh Milk Ice – frozen dairy bars with natural fruit flavours. No artificial colours. A refreshing summer treat. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('MILK-ICE',
                    [50.00,  44.00,  29.00],
                    [95.00,  83.00,  54.00],
                    [180.00, 158.00, 102.00]
                ),
            ],

            [
                'category_id'       => 3,
                'product_name'      => 'Milk Lolly',
                'slug'              => 'milk-lolly',
                'short_description' => 'Delightful milk lollies made from creamy dairy milk and natural flavours — the classic childhood favourite reimagined.',
                'description'       => 'EverFresh Milk Lolly is a stick-format frozen dairy treat crafted from fresh milk, cream and natural flavour extracts — available in classic vanilla, butterscotch and mixed fruit varieties. Each lolly is slowly frozen to achieve a smooth, lick-worthy texture that does not turn icy or crystalline. Rich enough to feel indulgent, light enough to enjoy guilt-free, it is the perfect after-school snack and summer dessert for kids. Produced under FSSAI-compliant food safety standards with no synthetic flavours or colours.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Milk Lolly – Creamy Frozen Stick | Natural Flavours',
                'meta_description'  => 'Buy EverFresh Milk Lolly – creamy frozen sticks in vanilla, butterscotch & fruit flavours. No synthetic additives. Kids\' favourite. 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('MILK-LOLLY',
                    [45.00,  39.00,  25.00],
                    [85.00,  74.00,  48.00],
                    [160.00, 140.00, 90.00]
                ),
            ],

            /* ─── Category 6 : Frozen & Dessert Mixes ───────────────────── */

            [
                'category_id'       => 6,
                'product_name'      => 'Dried Ice Cream Mix',
                'slug'              => 'dried-ice-cream-mix',
                'short_description' => 'Convenient shelf-stable ice cream powder mix that reconstitutes into smooth, creamy ice cream with just milk and churning.',
                'description'       => 'EverFresh Dried Ice Cream Mix is a carefully formulated powder blend of skimmed milk solids, sugar, vegetable fat powder, natural vanilla flavouring and food-grade stabilisers. Simply reconstitute with fresh chilled milk, blend for two minutes, churn in any standard ice cream maker and freeze — the result is a consistently smooth, professional-quality ice cream with a clean, natural finish. Ideal for catering businesses, home kitchen enthusiasts, small dairy cafes and confectionery outlets. Shelf-stable for six months when stored in a cool, dry place, with each pack yielding multiple servings of predictable quality.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Dried Ice Cream Mix – Instant Powder | Easy to Use',
                'meta_description'  => 'Buy EverFresh Dried Ice Cream Mix – shelf-stable powder for smooth homemade ice cream. Just add milk and churn. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('DRIED-ICE-MIX',
                    [90.00,  78.00,  50.00],
                    [170.00, 148.00, 96.00],
                    [320.00, 280.00, 182.00]
                ),
            ],

            [
                'category_id'       => 6,
                'product_name'      => 'Frozen Dessert',
                'slug'              => 'frozen-dessert',
                'short_description' => 'Smooth, indulgent frozen dessert from dairy and vegetable fat — a creamy, affordable everyday frozen treat.',
                'description'       => 'EverFresh Frozen Dessert is a FSSAI-compliant frozen confection made from a blend of dairy solids and vegetable fat, whipped to a smooth, creamy consistency and flavoured with premium vanilla extract. While technically distinct from pure ice cream, it delivers a remarkably similar eating experience at a more accessible price point, making it popular for large events, bulk catering, and everyday family consumption. Available in vanilla and mixed-fruit variants, it is a versatile base that pairs equally well with hot sauces, fresh fruits, nuts and wafer toppings. Produced hygienically under strict cold-chain standards.',
                'status'            => 'active',
                'is_featured'       => false,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Frozen Dessert – Creamy & Smooth | Affordable Treat',
                'meta_description'  => 'Order EverFresh Frozen Dessert – creamy, smooth and budget-friendly. Perfect for events and daily use. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('FROZEN-DESSERT',
                    [65.00,  57.00,  37.00],
                    [125.00, 109.00, 71.00],
                    [235.00, 205.00, 133.00]
                ),
            ],

            /* ─── Category 7 : Premium Products ─────────────────────────── */

            [
                'category_id'       => 7,
                'product_name'      => 'Premium Paneer',
                'slug'              => 'premium-paneer',
                'short_description' => 'Restaurant-grade premium paneer made from A2 cow milk — exceptionally soft, protein-rich and chef-preferred.',
                'description'       => 'EverFresh Premium Paneer is crafted exclusively from A2 cow milk sourced from indigenous Gir and Sahiwal cows to deliver a product preferred by five-star kitchens, specialty restaurants and discerning home cooks. The coagulation process uses natural citric acid at precisely controlled temperatures, resulting in a finer grain structure, silkier texture and cleaner flavour compared to standard paneer. It holds its form beautifully through high-heat cooking — tandoor, stir-fry and deep fry — while remaining succulent inside. No artificial binders or texture agents. The benchmark for paneer quality in Rajasthan.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Premium Paneer – A2 Cow Milk | Restaurant Grade',
                'meta_description'  => 'Buy EverFresh Premium Paneer – made from A2 cow milk. Restaurant-grade, silky texture, no artificial binders. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('PREM-PANEER',
                    [75.00,  65.00,  42.00],
                    [145.00, 126.00, 82.00],
                    [275.00, 240.00, 155.00]
                ),
            ],

            [
                'category_id'       => 7,
                'product_name'      => 'Premium Danbo Cheese',
                'slug'              => 'premium-danbo-cheese',
                'short_description' => 'Artisan-matured premium Danbo cheese with a deeper flavour profile — crafted for gourmets and specialty culinary use.',
                'description'       => 'EverFresh Premium Danbo Cheese is our extended-maturation variant of the classic Danbo, aged for a minimum of 60 days under controlled temperature and humidity conditions. The extended ripening develops a more pronounced, complex flavour profile with subtle earthy notes, a firmer body and the characteristic small-eye interior that cheese connoisseurs associate with superior quality. Made exclusively from premium Rajasthan cow milk and traditional Danish cheese cultures, with no artificial ripening agents. An exceptional table cheese and culinary ingredient for gourmet pizzas, cheese boards, fondues and fine-dining preparations.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Premium Danbo Cheese – Matured 60 Days | Artisan',
                'meta_description'  => 'Buy EverFresh Premium Danbo Cheese – aged 60 days for complex flavour. Artisan quality, no artificial agents. Ideal for gourmet cooking. 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('PREM-DANBO',
                    [160.00, 140.00,  90.00],
                    [305.00, 266.00, 173.00],
                    [580.00, 506.00, 328.00]
                ),
            ],

            [
                'category_id'       => 7,
                'product_name'      => 'Premium Chakka',
                'slug'              => 'premium-chakka',
                'short_description' => 'Luxuriously thick premium chakka from A2 cow milk — the finest base for artisan shrikhand and gourmet desserts.',
                'description'       => 'EverFresh Premium Chakka is produced from full-fat A2 cow dahi cultured with heirloom probiotic strains and strained through fine muslin cloth for a minimum of 18 hours to achieve an exceptionally thick, luscious consistency far superior to standard chakka. The resulting product has a naturally creamy white colour, a delicate yoghurt aroma and a clean, mildly tangy taste that forms the perfect canvas for artisan shrikhand flavoured with saffron, cardamom, pistachio and dry fruits. Free from thickeners, stabilisers and added cream — pure, honest dairy craftsmanship in every gram.',
                'status'            => 'active',
                'is_featured'       => true,
                'is_trending'       => false,
                'meta_title'        => 'EverFresh Premium Chakka – A2 Cow Milk | 18-Hour Strained',
                'meta_description'  => 'Buy EverFresh Premium Chakka – 18-hour strained A2 cow milk hung curd. Perfect for artisan shrikhand. No additives. Available in 250g, 500g & 1kg.',
                'variants'          => self::dairyVariants('PREM-CHAKKA',
                    [80.00,  70.00,  46.00],
                    [155.00, 135.00, 88.00],
                    [295.00, 258.00, 168.00]
                ),
            ],

        ];
    }

    // ── Run ────────────────────────────────────────────────────────────────────

    public function run(): void
    {
        foreach ($this->products() as $entry) {
            $variants = $entry['variants'];
            unset($entry['variants']);

            $product = Product::create($entry);

            foreach ($variants as $variant) {
                ProductVariant::create(array_merge($variant, [
                    'product_id' => $product->id,
                    'status'     => 'active',
                ]));
            }
        }
    }
}
