<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;
use Illuminate\Support\Facades\Storage;

class MessageContactNotification extends Notification
{
    use Queueable;

    protected $message;
    protected $recipientEmail;

    public function __construct($message, $recipientEmail)
    {
        $this->message = $message;
        $this->recipientEmail = $recipientEmail;
    }

      /**
     * Variables disponibles para la plantilla de email.
     */
    public static function availableVariables()
    {
        return [
            'nombre' => 'Nombre del remitente',
            'email' => 'Correo electrónico del remitente',
            'telefono' => 'Teléfono del remitente',
            'descripcion' => 'Descripción del mensaje',
            'fecha_contacto' => 'Fecha de contacto',
            'year' => 'Año actual',
            'nombre_servicio'=> 'Nombre del servicio (si aplica)',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'message_contact_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'nombre' => $this->message->name,
                'email' => $this->message->email,
                'telefono' => $this->message->phone ?? $this->message->subject ?? 'No especificado',
                'descripcion' => $this->message->description,
                'nombre_servicio' => $this->message->service_id ? $this->message->service->title : 'No especificado',
                'year' => date('Y'),
                'fecha_contacto' => $this->message->created_at
                    ? $this->message->created_at->translatedFormat('d \d\e F \d\e\l Y')
                    : '',
            ])
            : 'Plantilla no encontrada';
        
        return (new RawHtmlMail($body, 'Gracias por contactarnos - ' . $this->message->name, $this->recipientEmail));
    }
}
