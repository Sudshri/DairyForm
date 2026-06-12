<?php

use Illuminate\Support\Facades\Route;

/*
|──────────────────────────────────────────────────────────────────────────────
| DairyForm E-Commerce API  —  /api/v1/
|──────────────────────────────────────────────────────────────────────────────
*/

Route::prefix('v1')->group(function () {

    // ── Public ─────────────────────────────────────────────────────────────

    // Auth
    Route::prefix('auth')->group(function () {
        Route::post('send-otp',  [\App\Http\Controllers\Api\V1\Auth\OtpController::class,  'send']);
        Route::post('verify-otp',[\App\Http\Controllers\Api\V1\Auth\OtpController::class,  'verify']);
        Route::post('login',     [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'login']);
        Route::post('register',  [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'register']);
    });

    // Product catalogue (public read)
    Route::get('categories',                     [\App\Http\Controllers\Api\V1\CategoryController::class,       'index']);
    Route::get('categories/{slug}',              [\App\Http\Controllers\Api\V1\CategoryController::class,       'show']);
    Route::get('categories/{slug}/products',     [\App\Http\Controllers\Api\V1\CategoryController::class,       'products']);

    Route::get('products',                       [\App\Http\Controllers\Api\V1\ProductController::class,        'index']);
    Route::get('products/search',                [\App\Http\Controllers\Api\V1\ProductController::class,        'search']);
    Route::get('products/featured',              [\App\Http\Controllers\Api\V1\ProductController::class,        'featured']);
    Route::get('products/trending',              [\App\Http\Controllers\Api\V1\ProductController::class,        'trending']);
    Route::get('products/{id}',                  [\App\Http\Controllers\Api\V1\ProductController::class,        'show']);
    Route::get('products/{id}/variants',         [\App\Http\Controllers\Api\V1\ProductVariantController::class, 'byProduct']);
    Route::get('products/{id}/reviews',          [\App\Http\Controllers\Api\V1\ReviewController::class,         'index']);

    // Delivery
    Route::get('delivery/check-pincode/{pincode}', [\App\Http\Controllers\Api\V1\DeliveryController::class, 'checkPincode']);

    // Banners
    Route::get('banners',                        [\App\Http\Controllers\Api\V1\BannerController::class, 'index']);

    // ── Protected ────────────────────────────────────────────────────────────
    Route::middleware('auth:sanctum')->group(function () {

        // Auth
        Route::prefix('auth')->group(function () {
            Route::post('logout',  [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'logout']);
            Route::post('refresh', [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'refresh']);
            Route::get('me',       [\App\Http\Controllers\Api\V1\Auth\AuthController::class, 'me']);
        });

        // Profile
        Route::prefix('profile')->group(function () {
            Route::get('/',                   [\App\Http\Controllers\Api\V1\ProfileController::class, 'show']);
            Route::put('/',                   [\App\Http\Controllers\Api\V1\ProfileController::class, 'update']);
            Route::put('change-password',     [\App\Http\Controllers\Api\V1\ProfileController::class, 'changePassword']);
            Route::put('update-fcm-token',    [\App\Http\Controllers\Api\V1\ProfileController::class, 'updateFcmToken']);
        });

        // Addresses
        Route::apiResource('addresses', \App\Http\Controllers\Api\V1\AddressController::class);
        Route::put('addresses/{id}/set-default', [\App\Http\Controllers\Api\V1\AddressController::class, 'setDefault']);

        // Cart
        Route::prefix('cart')->group(function () {
            Route::get('/',          [\App\Http\Controllers\Api\V1\CartController::class, 'index']);
            Route::post('/',         [\App\Http\Controllers\Api\V1\CartController::class, 'addItem']);
            Route::put('{id}',       [\App\Http\Controllers\Api\V1\CartController::class, 'updateQty']);
            Route::delete('{id}',    [\App\Http\Controllers\Api\V1\CartController::class, 'removeItem']);
            Route::delete('/',       [\App\Http\Controllers\Api\V1\CartController::class, 'clear']);
            Route::post('apply-coupon',  [\App\Http\Controllers\Api\V1\CartController::class, 'applyCoupon']);
            Route::post('remove-coupon', [\App\Http\Controllers\Api\V1\CartController::class, 'removeCoupon']);
        });

        // Wishlist
        Route::prefix('wishlist')->group(function () {
            Route::get('/',           [\App\Http\Controllers\Api\V1\WishlistController::class, 'index']);
            Route::post('/',          [\App\Http\Controllers\Api\V1\WishlistController::class, 'toggle']);
            Route::delete('{id}',     [\App\Http\Controllers\Api\V1\WishlistController::class, 'remove']);
            Route::post('{id}/move-to-cart', [\App\Http\Controllers\Api\V1\WishlistController::class, 'moveToCart']);
        });

        // Orders
        Route::prefix('orders')->group(function () {
            Route::get('/',          [\App\Http\Controllers\Api\V1\OrderController::class, 'index']);
            Route::post('/',         [\App\Http\Controllers\Api\V1\OrderController::class, 'store']);
            Route::get('{id}',       [\App\Http\Controllers\Api\V1\OrderController::class, 'show']);
            Route::get('{id}/track', [\App\Http\Controllers\Api\V1\OrderController::class, 'track']);
            Route::post('{id}/cancel', [\App\Http\Controllers\Api\V1\OrderController::class, 'cancel']);
            Route::post('{id}/reorder', [\App\Http\Controllers\Api\V1\OrderController::class, 'reorder']);
        });

        // Payments
        Route::prefix('payments')->group(function () {
            Route::post('create-order', [\App\Http\Controllers\Api\V1\PaymentController::class, 'createOrder']);
            Route::post('verify',       [\App\Http\Controllers\Api\V1\PaymentController::class, 'verify']);
            Route::post('webhook',      [\App\Http\Controllers\Api\V1\PaymentController::class, 'webhook']);
        });

        // Reviews
        Route::post('reviews',         [\App\Http\Controllers\Api\V1\ReviewController::class, 'store']);
        Route::put('reviews/{id}',     [\App\Http\Controllers\Api\V1\ReviewController::class, 'update']);
        Route::delete('reviews/{id}',  [\App\Http\Controllers\Api\V1\ReviewController::class, 'destroy']);
        Route::post('reviews/{id}/helpful', [\App\Http\Controllers\Api\V1\ReviewController::class, 'markHelpful']);

        // ── Admin only ──────────────────────────────────────────────────────
        Route::middleware('role:admin')->prefix('admin')->group(function () {

            // Dashboard
            Route::get('dashboard/stats', [\App\Http\Controllers\Api\V1\Admin\DashboardController::class, 'stats']);

            // Categories (admin CRUD)
            Route::apiResource('categories', \App\Http\Controllers\Api\V1\Admin\CategoryController::class);

            // Products (admin CRUD)
            Route::apiResource('products', \App\Http\Controllers\Api\V1\Admin\ProductController::class);
            Route::post('products/{id}/images',       [\App\Http\Controllers\Api\V1\Admin\ProductController::class, 'uploadImages']);
            Route::delete('products/{id}/images/{imgId}', [\App\Http\Controllers\Api\V1\Admin\ProductController::class, 'deleteImage']);

            // Variants
            Route::apiResource('product-variants', \App\Http\Controllers\Api\V1\Admin\ProductVariantController::class);

            // Inventory
            Route::put('inventory/{variantId}',     [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'update']);
            Route::post('inventory/{variantId}/restock', [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'restock']);
            Route::get('inventory/low-stock',       [\App\Http\Controllers\Api\V1\Admin\InventoryController::class, 'lowStock']);

            // Offers
            Route::apiResource('offers', \App\Http\Controllers\Api\V1\Admin\OfferController::class);
            Route::post('offers/{offerId}/assign-variant',  [\App\Http\Controllers\Api\V1\Admin\OfferController::class, 'assignVariant']);
            Route::delete('offers/{offerId}/remove-variant/{variantId}', [\App\Http\Controllers\Api\V1\Admin\OfferController::class, 'removeVariant']);

            // Banners
            Route::apiResource('banners', \App\Http\Controllers\Api\V1\Admin\BannerController::class);

            // Delivery pincodes
            Route::apiResource('delivery-pincodes', \App\Http\Controllers\Api\V1\Admin\DeliveryPincodeController::class);

            // Orders (admin)
            Route::get('orders',                    [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'index']);
            Route::get('orders/{id}',               [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'show']);
            Route::patch('orders/{id}/status',      [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'updateStatus']);
            Route::post('orders/{id}/add-tracking', [\App\Http\Controllers\Api\V1\Admin\OrderController::class, 'addTracking']);

            // Users (admin)
            Route::get('users',         [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'index']);
            Route::get('users/{id}',    [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'show']);
            Route::patch('users/{id}/toggle-status', [\App\Http\Controllers\Api\V1\Admin\UserController::class, 'toggleStatus']);

            // Reviews moderation
            Route::get('reviews',                  [\App\Http\Controllers\Api\V1\Admin\ReviewController::class, 'index']);
            Route::patch('reviews/{id}/approve',   [\App\Http\Controllers\Api\V1\Admin\ReviewController::class, 'approve']);
            Route::delete('reviews/{id}',          [\App\Http\Controllers\Api\V1\Admin\ReviewController::class, 'destroy']);
        });
    });
});
