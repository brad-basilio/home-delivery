<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class AdminClaimNotification extends Notification
{
    use Queueable;

    protected $complaint;
    protected $recipientEmail;

    public function __construct($complaint, $recipientEmail)
    {
        $this->complaint = $complaint;
        $this->recipientEmail = $recipientEmail;
    }

    /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'nombre_completo' => 'Nombre completo del cliente',
            'nombre' => 'Nombre del cliente',
            'apellido' => 'Apellido del cliente',
            'tipo_documento' => 'Tipo de documento',
            'numero_documento' => 'Número de documento',
            'telefono' => 'Teléfono del cliente',
            'email' => 'Email del cliente',
            'direccion' => 'Dirección del cliente',
            'departamento' => 'Departamento',
            'provincia' => 'Provincia',
            'distrito' => 'Distrito',
            'sede' => 'Sede donde ocurrió el incidente',
            'servicio' => 'Tipo de servicio/producto',
            'tipo_reclamo' => 'Tipo de reclamo (queja/reclamo)',
            'fecha_incidente' => 'Fecha del incidente',
            'hora_incidente' => 'Hora del incidente',
            'detalle_reclamo' => 'Detalle del reclamo',
            'pedido' => 'Pedido del cliente',
            'numero_reclamo' => 'Número de reclamo',
            'fecha_registro' => 'Fecha de registro',
            'ip_address' => 'Dirección IP',
            'year' => 'Año actual',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'admin_claim_notification_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre_completo' => $this->complaint->nombre . ' ' . $this->complaint->apellido,
                'nombre' => $this->complaint->nombre,
                'apellido' => $this->complaint->apellido,
                'tipo_documento' => strtoupper($this->complaint->tipo_documento),
                'numero_documento' => $this->complaint->numero_documento,
                'telefono' => $this->complaint->telefono,
                'email' => $this->complaint->email,
                'direccion' => $this->complaint->direccion,
                'departamento' => $this->complaint->departamento,
                'provincia' => $this->complaint->provincia,
                'distrito' => $this->complaint->distrito,
                'sede' => $this->complaint->sede ?? ($this->complaint->office ? $this->complaint->office->name : 'No especificada'),
                'servicio' => $this->complaint->servicio,
                'tipo_reclamo' => ucfirst($this->complaint->tipo_reclamo),
                'fecha_incidente' => $this->complaint->fecha_incidente
                    ? $this->complaint->fecha_incidente->translatedFormat('d \d\e F \d\e\l Y')
                    : 'No especificada',
                'hora_incidente' => $this->complaint->hora_incidente ?? 'No especificada',
                'detalle_reclamo' => $this->complaint->detalle_reclamo,
                'pedido' => $this->complaint->pedido,
                'numero_reclamo' => $this->complaint->numero_reclamo,
                'fecha_registro' => $this->complaint->created_at
                    ? $this->complaint->created_at->translatedFormat('d \d\e F \d\e\l Y \a \l\a\s H:i')
                    : '',
                'ip_address' => $this->complaint->ip_address ?? 'No disponible',
                'year' => date('Y'),
            ])
            : 'Plantilla no encontrada';

        return (new RawHtmlMail(
            $body, 
            'Nuevo reclamo recibido - ' . $this->complaint->numero_reclamo, 
            $this->recipientEmail
        ));
    }
}
