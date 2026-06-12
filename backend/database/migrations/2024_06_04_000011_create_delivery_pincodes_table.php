<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('delivery_pincodes', function (Blueprint $table) {
            $table->id();
            $table->string('pincode', 10)->unique();
            $table->string('area_name', 150)->nullable();
            $table->string('city', 100);
            $table->string('state', 100);
            $table->string('country', 5)->default('IN');

            $table->decimal('delivery_charge', 8, 2)->default(0);
            $table->decimal('free_delivery_above', 10, 2)->nullable(); // null = never free
            $table->unsignedTinyInteger('estimated_days')->default(1);
            $table->time('cut_off_time')->nullable();  // Orders before this get same-day

            $table->boolean('is_active')->default(true);
            $table->boolean('is_express_available')->default(false);
            $table->decimal('express_charge', 8, 2)->nullable();
            $table->unsignedTinyInteger('express_hours')->nullable(); // Delivery in N hours

            $table->timestamps();

            // Checkout: check if pincode is serviceable
            $table->index(['pincode', 'is_active']);
            // Admin: group by city/state
            $table->index(['city', 'state', 'is_active']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('delivery_pincodes');
    }
};
