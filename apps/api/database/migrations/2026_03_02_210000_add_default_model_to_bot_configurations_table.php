<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('bot_configurations', function (Blueprint $table) {
            $table->string('default_model')->nullable()->after('system_prompt');
        });
    }

    public function down(): void
    {
        Schema::table('bot_configurations', function (Blueprint $table) {
            $table->dropColumn('default_model');
        });
    }
};

