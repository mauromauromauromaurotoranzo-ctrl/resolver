<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BotConfiguration extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'version',
        'system_prompt',
        'flow_config',
        'is_active',
    ];

    protected $casts = [
        'flow_config' => 'array',
        'is_active' => 'boolean',
    ];
}
