<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class BotConfiguration extends Model
{
    use HasFactory;

    protected $fillable = [
        'id',
        'name',
        'version',
        'system_prompt',
        'default_model',
        'flow_config',
        'is_active',
    ];

    protected $primaryKey = 'id';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $casts = [
        'flow_config' => 'array',
        'is_active' => 'boolean',
    ];
}
