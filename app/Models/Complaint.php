<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory, HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'nombre',
        'apellido',
        'tipo_documento',
        'numero_documento',
        'telefono',
        'email',
        'direccion',
        'office_id',
        'sede',
        'servicio',
        'tipo_reclamo',
        'fecha_incidente',
        'hora_incidente',
        'detalle_reclamo',
        'pedido',
        'autoriza_notificacion',
        'acepta_terminos',
        'numero_reclamo',
        'estado',
        'respuesta',
        'fecha_respuesta',
        'ip_address',
        'user_agent',
        'status',
        'visible',
    ];

    protected $casts = [
        'autoriza_notificacion' => 'boolean',
        'acepta_terminos' => 'boolean',
        'fecha_incidente' => 'date',
        'fecha_respuesta' => 'datetime',
    ];

    public function office()
    {
        return $this->belongsTo(Office::class);
    }

    public function attachments()
    {
        return $this->hasMany(ComplaintAttachment::class);
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $year = date('Y');
            $correlativo = str_pad(Complaint::whereYear('created_at', $year)->count() + 1, 5, '0', STR_PAD_LEFT);
            $model->numero_reclamo = 'LR-' . $year . '-' . $correlativo;
        });
    }

    // Métodos para tipos y estados
    public static function getTipoReclamoOptions(): array
    {
        return [
            'queja' => 'Queja',
            'reclamo' => 'Reclamo'
        ];
    }

    public static function getEstadoOptions(): array
    {
        return [
            'pendiente' => 'Pendiente',
            'en_proceso' => 'En Proceso',
            'resuelto' => 'Resuelto',
            'rechazado' => 'Rechazado'
        ];
    }

    public function getTipoReclamoTextAttribute(): string
    {
        return self::getTipoReclamoOptions()[$this->tipo_reclamo] ?? $this->tipo_reclamo;
    }

    public function getEstadoTextAttribute(): string
    {
        return self::getEstadoOptions()[$this->estado] ?? $this->estado;
    }
}
