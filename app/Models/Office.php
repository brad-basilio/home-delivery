<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Office extends Model
{
    use HasFactory, HasUuids;

    protected $fillable = [
        'name',
        'type',
        'address',
        'phone',
        'email',
        'description',
        'ubigeo',
        'latitude',
        'longitude',
        'manager',
        'capacity',
        'link',
        'business_hours',
        'image',
        'visible',
        'status'
    ];

    protected $casts = [
        'business_hours' => 'array',
        'visible' => 'boolean',
        'status' => 'boolean',
        'latitude' => 'decimal:8',
        'longitude' => 'decimal:8'
    ];

    public $incrementing = false;
    protected $keyType = 'string';
}
