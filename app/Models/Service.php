<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Service extends Model
{
    use HasFactory, HasUuids;
    public $incrementing = false;
    protected $keyType = 'string';
    protected $fillable = ['title', 'description', 'image', 'link', 'status', 'visible', 'slug', 'characteristics', 'gallery', 'featured', 'lang_id','icon','color'];
    protected $casts = [
        'characteristics' => 'array', // Convierte automáticamente el JSON a array de PHP
        'gallery' => 'array',
        'featured' => 'boolean', // Convierte featured a boolean
        'status' => 'boolean',
        'visible' => 'boolean'
    ];

    public function lang()
    {
        return $this->belongsTo(Lang::class);
    }
}
