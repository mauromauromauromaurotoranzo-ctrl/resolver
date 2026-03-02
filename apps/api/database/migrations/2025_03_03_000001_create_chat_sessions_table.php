<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('chat_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('visitor_id')->unique();
            $table->enum('status', ['active', 'completed', 'abandoned'])->default('active');
            $table->string('source_url', 500)->nullable();
            $table->jsonb('utm_data')->nullable();
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('ended_at')->nullable();
            $table->integer('lead_score')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('chat_sessions');
    }
};
