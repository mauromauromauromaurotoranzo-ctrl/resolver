<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Lead extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'session_id',
        'email',
        'phone',
        'company_name',
        'industry',
        'project_type',
        'problem_description',
        'current_solution',
        'timeline',
        'budget_range',
        'decision_maker',
        'complexity_score',
        'estimated_weeks_min',
        'estimated_weeks_max',
        'estimated_cost_min',
        'estimated_cost_max',
        'status',
        'assigned_to',
        'calendly_event_id',
        'notes',
    ];

    protected $casts = [
        'decision_maker' => 'boolean',
        'estimated_cost_min' => 'decimal:2',
        'estimated_cost_max' => 'decimal:2',
    ];

    public function session(): BelongsTo
    {
        return $this->belongsTo(ChatSession::class, 'session_id');
    }
}
