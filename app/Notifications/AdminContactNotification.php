<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;
use App\Mail\RawHtmlMail;

class AdminContactNotification extends Notification
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
            'tipo_contacto' => 'Tipo de contacto (empresa/cliente)',
            'asunto' => 'Asunto del mensaje',
            'descripcion' => 'Descripción del mensaje',
            'fecha_contacto' => 'Fecha de contacto',
            'ruc' => 'RUC (solo para empresas)',
            'year' => 'Año actual',
            'nombre_servicio' => 'Nombre del servicio (si aplica)',
        ];
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $template = \App\Models\General::where('correlative', 'admin_contact_notification_email')->first();
        $body = $template
            ? \App\Helpers\Text::replaceData($template->description, [
                'customer_name' => $this->message->name,
                'customer_email' => $this->message->email,
                'customer_phone' => $this->message->subject ?? 'No especificado',
                'tipo_contacto' => $this->message->contact_type ?? 'No especificado',
                'message_subject' => $this->message->subject,
                'message_content' => $this->message->description,
                'ruc' => $this->message->ruc ?? 'No especificado',
                'nombre_servicio' => $this->message->service_id ? $this->message->service->title : 'No especificado',
                'year' => date('Y'),
                'fecha_contacto' => $this->message->created_at
                    ? $this->message->created_at->translatedFormat('d \d\e F \d\e\l Y')
                    : '',
            ])
            : 'Plantilla no encontrada';

        return (new RawHtmlMail(
            $body, 
            'Nuevo mensaje de contacto - ' . $this->message->name, 
            $this->recipientEmail
        ));
    }
}
