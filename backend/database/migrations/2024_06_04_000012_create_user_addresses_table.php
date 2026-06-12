<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('user_addresses', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')
                  ->constrained()
                  ->cascadeOnDelete();

            $table->string('full_name', 150);
            $table->string('phone', 15);
            $table->string('alternate_phone', 15)->nullable();

            $table->string('address_line1', 300);
            $table->string('address_line2', 300)->nullable();
            $table->string('landmark', 150)->nullable();

            $table->string('city', 100);
            $table->string('state', 100);
            $table->string('pincode', 10);
            $table->string('country', 5)->default('IN');

            $table->enum('address_type', ['home', 'office', 'other'])->default('home');
            $table->string('address_label', 50)->nullable(); // Custom label

            $table->decimal('latitude', 10, 8)->nullable();   // GPS for delivery optimization
            $table->decimal('longitude', 11, 8)->nullable();

            $table->boolean('is_default')->default(false);
            $table->timestamps();

            // Fetch user's addresses; default first
            $table->index(['user_id', 'is_default']);
            // Pincode validation at checkout (no FK — user may enter unserviceable areas)
            $table->index(['user_id', 'pincode']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('user_addresses');
    }
};
