<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class ClaimNotification extends Notification implements ShouldQueue
{
    use Queueable;

    protected $complaint;
    protected $recipientEmail;

    public function __construct($complaint, $recipientEmail)
    {
        $this->complaint = $complaint;
        $this->recipientEmail = $recipientEmail;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }
  /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            
            'nombre'               => 'Nombre del cliente',
            'tipo_documento'       => 'Tipo de documento',
            'numero_identidad'     => 'Número de identidad',
            'celular'              => 'Celular',
            'correo_electronico'   => 'Correo electrónico',
            'departamento'         => 'Departamento',
            'provincia'            => 'Provincia',
            'distrito'             => 'Distrito',
            'direccion'            => 'Dirección',
            'sede'                 => 'Sede/Oficina',
            'tipo_producto'        => 'Tipo de producto',
            'monto_reclamado'      => 'Monto reclamado',
            'descripcion_producto' => 'Descripción del producto',
            'tipo_reclamo'         => 'Tipo de reclamo',
            'fecha_ocurrencia'     => 'Fecha de ocurrencia',
            'pedido'               => 'Pedido',
            'detalle_reclamo'      => 'Detalle del reclamo',
        ];
    }
    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'claim_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre' => $this->complaint->nombre,
                'tipo_documento' => $this->complaint->tipo_documento,
                'numero_identidad' => $this->complaint->numero_documento,
                'celular' => $this->complaint->telefono,
                'correo_electronico' => $this->complaint->email,
                'departamento' => $this->complaint->departamento,
                'provincia' => $this->complaint->provincia,
                'distrito' => $this->complaint->distrito,
                'direccion' => $this->complaint->direccion,
                'sede' => $this->complaint->sede ?? ($this->complaint->office ? $this->complaint->office->name : 'No especificada'),
                'tipo_producto' => $this->complaint->servicio,
                'tipo_reclamo' => $this->complaint->tipo_reclamo,
                'fecha_ocurrencia' => date('d \d\e F \d\e\l Y', strtotime($this->complaint->fecha_incidente)),
                'pedido' => $this->complaint->pedido,
                'detalle_reclamo' => $this->complaint->detalle_reclamo,
                'year' => date('Y'),
                'fecha_reclamo' => date('d \d\e F \d\e\l Y', strtotime($this->complaint->created_at)),
            ])
            : 'Plantilla no encontrada';
        return (new RawHtmlMail($body, 'Hemos recibido tu reclamo', $this->recipientEmail));
    }
}
