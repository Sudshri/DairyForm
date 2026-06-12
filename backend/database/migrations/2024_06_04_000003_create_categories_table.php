<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('categories', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('parent_id')->nullable(); // self-referential for sub-categories
            $table->string('name', 100);
            $table->string('slug', 120)->unique();
            $table->text('description')->nullable();
            $table->string('image')->nullable();
            $table->string('icon')->nullable();         // CSS icon class or SVG path
            $table->string('meta_title', 160)->nullable();
            $table->string('meta_description', 320)->nullable();
            $table->unsignedSmallInteger('sort_order')->default(0);
            $table->boolean('is_active')->default(true);
            $table->boolean('show_in_menu')->default(true);
            $table->timestamps();
            $table->softDeletes();

            $table->foreign('parent_id')
                  ->references('id')
                  ->on('categories')
                  ->nullOnDelete();

            $table->index(['parent_id', 'is_active']);
            $table->index(['is_active', 'show_in_menu']);
            $table->index('sort_order');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('categories');
    }
};
