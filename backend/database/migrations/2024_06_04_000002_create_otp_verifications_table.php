<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('otp_verifications', function (Blueprint $table) {
            $table->id();
            $table->string('phone', 15);
            $table->string('otp', 6);
            $table->enum('purpose', ['login', 'register', 'password_reset', 'phone_change'])
                  ->default('login');
            $table->boolean('is_verified')->default(false);
            $table->tinyInteger('attempts')->unsigned()->default(0); // max 5 attempts
            $table->timestamp('expires_at');
            $table->timestamp('verified_at')->nullable();
            $table->string('ip_address', 45)->nullable();
            $table->timestamps();

            // Composite: lookup by phone+purpose (most frequent query)
            $table->index(['phone', 'purpose']);
            // Cleanup job uses this to purge expired records
            $table->index('expires_at');
            $table->index(['phone', 'is_verified']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('otp_verifications');
    }
};
