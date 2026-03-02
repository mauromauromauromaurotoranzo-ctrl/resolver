<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('session_id')->constrained('chat_sessions')->onDelete('cascade');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();
            $table->string('company_name')->nullable();
            $table->string('contact_name')->nullable();
            $table->string('industry', 100)->nullable();
            $table->enum('project_type', ['software', 'agent_ai', 'consulting', 'unknown'])->default('unknown');
            $table->text('problem_description')->nullable();
            $table->text('current_solution')->nullable();
            $table->string('timeline', 50)->nullable();
            $table->string('budget_range', 50)->nullable();
            $table->boolean('decision_maker')->nullable();
            $table->integer('complexity_score')->nullable();
            $table->integer('estimated_weeks_min')->nullable();
            $table->integer('estimated_weeks_max')->nullable();
            $table->decimal('estimated_cost_min', 10, 2)->nullable();
            $table->decimal('estimated_cost_max', 10, 2)->nullable();
            $table->enum('status', ['new', 'in_review', 'contacted', 'proposal_sent', 'negotiating', 'won', 'lost', 'archived'])->default('new');
            $table->string('assigned_to')->nullable();
            $table->text('admin_notes')->nullable();
            $table->timestamp('contacted_at')->nullable();
            $table->timestamps();
            
            $table->index('status');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
