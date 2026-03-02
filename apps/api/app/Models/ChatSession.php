<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ChatSession extends Model
{
    use HasFactory;

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'visitor_id',
        'status',
        'source_url',
        'utm_data',
        'collected_data',
        'started_at',
        'ended_at',
        'lead_score',
    ];

    protected $casts = [
        'utm_data' => 'array',
        'collected_data' => 'array',
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function messages(): HasMany
    {
        return $this->hasMany(ChatMessage::class, 'session_id');
    }

    public function lead(): HasMany
    {
        return $this->hasMany(Lead::class, 'session_id');
    }
}
