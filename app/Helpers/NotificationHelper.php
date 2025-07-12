<?php

namespace App\Helpers;

use App\Models\General;
use App\Notifications\AdminContactNotification;
use App\Notifications\AdminClaimNotification;
use App\Notifications\MessageContactNotification;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Notification;

class NotificationHelper
{
    /**
     * Obtiene el email corporativo desde la configuración
     */
    public static function getCorporateEmail()
    {
        try {
            $corporate = General::where('correlative', 'email_coorporativo')->first();
            $email = $corporate ? $corporate->description : null;
            
            Log::info('NotificationHelper - Email corporativo obtenido', [
                'email' => $email
            ]);
            
            return $email;
        } catch (\Exception $e) {
            Log::error('NotificationHelper - Error obteniendo email corporativo', [
                'error' => $e->getMessage()
            ]);
            return null;
        }
    }

    /**
     * Envía una notificación tanto al destinatario original como al administrador
     */
    public static function sendToClientAndAdmin($originalNotifiable, $notification, $adminNotification = null)
    {
        try {
            // Enviar al cliente/destinatario original
            if ($originalNotifiable->email ?? null) {
                $clientEmail = $originalNotifiable->email;
                Log::info('NotificationHelper - Enviando notificación al cliente', [
                    'client_email' => $clientEmail,
                    'notification_type' => get_class($notification)
                ]);
                
                // Enviar usando Notification::route para que no dependa de que sea un modelo notifiable
                Notification::route('mail', $clientEmail)->notify($notification);
                Log::info('NotificationHelper - Notificación enviada al cliente exitosamente');
            } else {
                Log::warning('NotificationHelper - Cliente sin email, saltando envío al cliente');
            }

            // Enviar al administrador
            $corporateEmail = self::getCorporateEmail();
            if ($corporateEmail) {
                Log::info('NotificationHelper - Preparando envío al administrador', [
                    'admin_email' => $corporateEmail
                ]);

                // Si se proporciona una notificación específica para admin, usarla
                if ($adminNotification) {
                    Log::info('NotificationHelper - Enviando notificación específica al administrador');
                    Notification::route('mail', $corporateEmail)->notify($adminNotification);
                    Log::info('NotificationHelper - Notificación específica enviada al administrador exitosamente');
                } else {
                    // Crear notificación específica basada en la original
                    $autoAdminNotification = self::createAdminNotification($notification);
                    if ($autoAdminNotification) {
                        Log::info('NotificationHelper - Enviando notificación auto-generada al administrador');
                        Notification::route('mail', $corporateEmail)->notify($autoAdminNotification);
                        Log::info('NotificationHelper - Notificación auto-generada enviada al administrador exitosamente');
                    } else {
                        Log::warning('NotificationHelper - No se pudo crear notificación específica para admin');
                    }
                }
            } else {
                Log::warning('NotificationHelper - No se pudo enviar al administrador: email corporativo no configurado');
            }
        } catch (\Exception $e) {
            Log::error('NotificationHelper - Error enviando notificaciones', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Crea una notificación específica para el administrador basada en la notificación original
     */
    private static function createAdminNotification($originalNotification)
    {
        try {
            if ($originalNotification instanceof MessageContactNotification) {
                // Usar reflection para acceder a las propiedades protegidas
                $reflection = new \ReflectionClass($originalNotification);
                $messageProperty = $reflection->getProperty('message');
                $messageProperty->setAccessible(true);
                $message = $messageProperty->getValue($originalNotification);
                
                $corporateEmail = self::getCorporateEmail();
                if ($corporateEmail) {
                    return new AdminContactNotification($message, $corporateEmail);
                }
            }
            
            return null;
        } catch (\Exception $e) {
            Log::error('NotificationHelper - Error creando notificación para admin', [
                'error' => $e->getMessage(),
                'original_notification' => get_class($originalNotification)
            ]);
            return null;
        }
    }

    /**
     * Envía notificación específica de contacto
     */
    public static function sendContactNotification($message)
    {
        try {
            Log::info('NotificationHelper - Iniciando envío de notificaciones de contacto', [
                'message_id' => $message->id ?? 'unknown',
                'client_email' => $message->email ?? 'no_email',
                'contact_type' => $message->contact_type ?? 'unknown'
            ]);

            // Enviar al cliente (si tiene email)
            if ($message->email) {
                Log::info('NotificationHelper - Enviando notificación al cliente');
                $clientNotification = new MessageContactNotification($message, $message->email);
                Notification::route('mail', $message->email)->notify($clientNotification);
                Log::info('NotificationHelper - Notificación enviada al cliente exitosamente');
            }
            
            // Enviar al administrador
            $corporateEmail = self::getCorporateEmail();
            if ($corporateEmail) {
                Log::info('NotificationHelper - Enviando notificación al administrador');
                $adminNotification = new AdminContactNotification($message, $corporateEmail);
                Notification::route('mail', $corporateEmail)->notify($adminNotification);
                Log::info('NotificationHelper - Notificación enviada al administrador exitosamente');
            }
            
            Log::info('NotificationHelper - Todas las notificaciones de contacto enviadas exitosamente');
        } catch (\Exception $e) {
            Log::error('NotificationHelper - Error enviando notificaciones de contacto', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }

    /**
     * Envía notificación específica de reclamo
     */
    public static function sendClaimNotification($complaint)
    {
        try {
            Log::info('NotificationHelper - Iniciando envío de notificaciones de reclamo', [
                'complaint_id' => $complaint->id ?? 'unknown',
                'client_email' => $complaint->email ?? 'no_email',
                'complaint_type' => $complaint->tipo_reclamo ?? 'unknown',
                'numero_reclamo' => $complaint->numero_reclamo ?? 'unknown'
            ]);

            // Enviar al cliente (si tiene email)
            if ($complaint->email) {
                Log::info('NotificationHelper - Enviando notificación de reclamo al cliente');
                $clientNotification = new \App\Notifications\ClaimNotification($complaint, $complaint->email);
                Notification::route('mail', $complaint->email)->notify($clientNotification);
                Log::info('NotificationHelper - Notificación de reclamo enviada al cliente exitosamente');
            }
            
            // Enviar al administrador
            $corporateEmail = self::getCorporateEmail();
            if ($corporateEmail) {
                Log::info('NotificationHelper - Enviando notificación de reclamo al administrador');
                $adminNotification = new AdminClaimNotification($complaint, $corporateEmail);
                Notification::route('mail', $corporateEmail)->notify($adminNotification);
                Log::info('NotificationHelper - Notificación de reclamo enviada al administrador exitosamente');
            }
            
            Log::info('NotificationHelper - Todas las notificaciones de reclamo enviadas exitosamente');
        } catch (\Exception $e) {
            Log::error('NotificationHelper - Error enviando notificaciones de reclamo', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            throw $e;
        }
    }
}
