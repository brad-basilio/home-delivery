<?php

namespace App\Http\Controllers;

use App\Helpers\NotificationHelper;
use App\Models\Message;
use App\Http\Requests\StoreMessageRequest;
use App\Http\Requests\UpdateMessageRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MessageController extends BasicController
{
    public $model = Message::class;

    public function beforeSave(Request $request): array
    {
        $messages = [
            'name.required' => 'El nombre es obligatorio.',
            'name.string' => 'El nombre debe ser una cadena de texto.',
            'email.email' => 'El correo electrónico debe tener el formato user@domain.com.',
            'email.max' => 'El correo electrónico no debe exceder los 320 caracteres.',
            'subject.required' => 'El asunto es obligatorio.',
            'subject.string' => 'El asunto debe ser una cadena de texto.',
            'description.required' => 'El mensaje es obligatorio.',
            'description.string' => 'El mensaje debe ser una cadena de texto.'
        ];

        // Validación de los datos
        $validatedData = $request->validate([
            'name' => 'required|string',
            'email' => 'nullable|email|max:320',
            'subject' => 'required|string',
            'description' => 'required|string',
            'service_id' => 'nullable|exists:services,id',
        ], $messages);

        return $validatedData;
    }

    public function afterSave(Request $request, object $jpa)
    {
        try {
            Log::info('MessageController - Iniciando envío de notificaciones', [
                'message_id' => $jpa->id,
                'client_email' => $jpa->email,
                'contact_type' => $jpa->contact_type ?? 'unknown',
                'name' => $jpa->name
            ]);

            // Enviar notificación al cliente y al administrador usando el helper
            NotificationHelper::sendContactNotification($jpa);

            Log::info('MessageController - Notificaciones enviadas exitosamente');

        } catch (\Exception $e) {
            Log::error('MessageController - Error al enviar notificaciones de contacto', [
                'message_id' => $jpa->id ?? 'unknown',
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
        }
    }
}
