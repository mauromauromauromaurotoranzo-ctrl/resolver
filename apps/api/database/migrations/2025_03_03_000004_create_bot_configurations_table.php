<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bot_configurations', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('version');
            $table->text('system_prompt');
            $table->jsonb('flow_config')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bot_configurations');
    }
};
