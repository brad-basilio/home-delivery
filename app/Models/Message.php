<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'email',
        'subject',
        'phone',
        'company',
        'business_sector',
        'daily_shipments',
        'location_type',
        'description',
        'service_id',
        'seen',
        'status',
    ];

    // Relación con el servicio
    public function service()
    {
        return $this->belongsTo(\App\Models\Service::class);
    }
}
