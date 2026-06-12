<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /*
     * Email Log — Audit trail for every outbound email.
     * Queued by Laravel Mail with the 'queue' driver.
     * Status updated by Mailable events.
     */
    public function up(): void
    {
        Schema::create('email_logs', function (Blueprint $table) {
            $table->id();

            $table->string('to_email', 191);
            $table->string('to_name', 150)->nullable();
            $table->string('subject', 250);

            $table->string('template', 100)->nullable();          // View template name
            $table->string('mailable_class', 200)->nullable();    // Laravel Mailable FQCN

            // Polymorphic relation to source entity (order, user, etc.)
            $table->unsignedBigInteger('related_id')->nullable();
            $table->string('related_type', 100)->nullable();      // 'App\Models\Order'

            $table->enum('status', ['queued', 'sent', 'failed', 'bounced'])
                  ->default('queued');

            $table->text('error_message')->nullable();
            $table->unsignedTinyInteger('retry_count')->default(0);

            $table->timestamp('sent_at')->nullable();
            $table->timestamp('opened_at')->nullable();           // Via tracking pixel
            $table->string('message_id')->nullable();             // SMTP message-id header

            $table->timestamps();

            $table->index(['to_email', 'status']);
            $table->index('status');
            $table->index(['related_id', 'related_type']);
            $table->index('created_at');    // Cron cleanup job
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('email_logs');
    }
};
