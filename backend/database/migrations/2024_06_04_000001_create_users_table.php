<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email', 191)->nullable()->unique();
            $table->string('phone', 15)->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->timestamp('phone_verified_at')->nullable();
            $table->string('password')->nullable();       // nullable for OTP-only auth
            $table->string('avatar')->nullable();
            $table->enum('gender', ['male', 'female', 'other'])->nullable();
            $table->date('date_of_birth')->nullable();
            $table->enum('role', ['customer', 'admin', 'delivery_agent'])->default('customer');
            $table->boolean('is_active')->default(true);
            $table->string('fcm_token')->nullable();      // Firebase push notifications
            $table->timestamp('last_login_at')->nullable();
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            // Indexes
            $table->index(['role', 'is_active']);
            $table->index('last_login_at');
        });

        // Sanctum personal access tokens (created by Sanctum but listed here for reference)
        // Run: php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};
