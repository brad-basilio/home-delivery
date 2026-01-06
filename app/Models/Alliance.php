<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Alliance extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'correlative',
        'description',
        'image',
        'website',
        'order',
        'visible',
        'status',
        'lang_id',
    ];

    protected $casts = [
        'visible' => 'boolean',
        'status' => 'boolean',
        'order' => 'integer',
    ];

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
