<?php

namespace Database\Seeders;

use App\Models\General;
use App\Models\Lang;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class EmailsGeneralSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener el idioma por defecto
        $defaultLang = Lang::where('is_default', true)->first();
        if (!$defaultLang) {
            // Si no hay idioma por defecto, crear uno o usar el primero disponible
            $defaultLang = Lang::first();
            if (!$defaultLang) {
                echo "No se encontró ningún idioma en la base de datos. Creando idioma por defecto...\n";
                $defaultLang = Lang::create([
                    'name' => 'Español',
                    'description' => 'es',
                    'status' => true,
                    'visible' => true,
                    'is_default' => true
                ]);
            }
        }
        
        echo "Usando idioma: {$defaultLang->name} (ID: {$defaultLang->id})\n";
        // Helper para limpiar llaves y caracteres invisibles
        $clean_blade_vars = function($html) {
            // Reemplaza comillas y caracteres raros por los normales
            $html = str_replace([
                '“', '”', '‘', '’', '′', '‵', '‹', '›', '«', '»',
                '‐', '–', '—', '−',
                ' ', // espacio no-break
            ], [
                '"', '"', "'", "'", "'", "'", "'", "'", '"', '"',
                '-', '-', '-', '-',
                ' ',
            ], $html);
            // Elimina espacios invisibles
            $html = preg_replace('/[\x{00A0}\x{200B}\x{200C}\x{200D}\x{FEFF}]/u', '', $html);
            // Normaliza las llaves: {{   variable   }} => {{variable}}
            $html = preg_replace('/\{\s*\{\s*/', '{{', $html);
            $html = preg_replace('/\s*}\s*}/', '}}', $html);
            // Elimina $ en variables tipo {{ $variable }} => {{variable}}
            $html = preg_replace('/{{\s*\$([a-zA-Z0-9_]+)\s*}}/', '{{$1}}', $html);
            // Elimina cualquier instrucción Blade o PHP
            $html = preg_replace('/@\w+\s*\(.*?\)/', '', $html); // directivas @if, @foreach, etc
            $html = preg_replace('/{{\s*[^\s}]+\(.*?\)\s*}}/', '', $html); // funciones dentro de {{ }}
            return $html;
        };
        $generalData = [
            [
                'correlative' => 'order_status_changed_email',
                'name' => 'Diseño de email de cambio de estado de pedido',
                'description' => $clean_blade_vars(<<<'HTML'

<h1>¡Hola!</h1>
<p>El estado de tu pedido #{{ orderId }} ha cambiado a: <strong>{{ status }}</strong></p>
<p>Gracias por tu compra.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
                ),
            ],
            [
                'correlative' => 'claim_email',
                'name' => 'Diseño de email de reclamo (plantilla heredada)',
                'description' => $clean_blade_vars(<<<'HTML'

<h1>¡Hola {{ nombre }}!</h1>
<p>Hemos recibido tu {{ tipo_reclamo }} y te enviamos un respaldo de lo que registraste:</p>
<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Datos de tu {{ tipo_reclamo }}:</h3>
    <p><strong>Nombre:</strong> {{ nombre }}</p>
    <p><strong>Documento:</strong> {{ tipo_documento }} {{ numero_identidad }}</p>
    <p><strong>Email:</strong> {{ correo_electronico }}</p>
    <p><strong>Teléfono:</strong> {{ celular }}</p>
    <p><strong>Dirección:</strong> {{ direccion }}, {{ distrito }}, {{ provincia }}, {{ departamento }}</p>
    <p><strong>Tipo:</strong> {{ tipo_reclamo }}</p>
    <p><strong>Producto/Servicio:</strong> {{ tipo_producto }}</p>
    <p><strong>Fecha del incidente:</strong> {{ fecha_ocurrencia }}</p>
    <p><strong>Detalle:</strong></p>
    <p>{{ detalle_reclamo }}</p>
    <p><strong>Pedido:</strong></p>
    <p>{{ pedido }}</p>
    <p><strong>Fecha de registro:</strong> {{ fecha_reclamo }}</p>
</div>
<p>Nuestro equipo revisará tu caso y te responderemos en un plazo máximo de 30 días hábiles.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
                ),
            ],
            [
                'correlative' => 'password_changed_email',
                'name' => 'Diseño de email de contraseña cambiada',
                'description' => <<<HTML

<h1>¡Hola!</h1>
<p>Te informamos que tu contraseña ha sido cambiada exitosamente.</p>
<p>Si no realizaste este cambio, por favor contacta con soporte de inmediato.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
            ],
            [
                'correlative' => 'reset_password_email',
                'name' => 'Diseño de email de restablecer contraseña',
                'description' => <<<HTML
<h1>Restablecer contraseña</h1>
<p>Hemos recibido una solicitud para restablecer tu contraseña.</p>
<p>Haz clic en el siguiente enlace para continuar:</p>
<a href="{{ resetUrl }}">Restablecer contraseña</a>
<p>Si no has solicitado esto, ignora este correo.</p>
HTML
            ],
            [
                'correlative' => 'subscription_email',
                'name' => 'Diseño de email de suscripción',
                'description' => <<<HTML

<h1>¡Hola!</h1>
<p>Te has suscrito exitosamente. Pronto recibirás novedades y actualizaciones.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
            ],
            [
                'correlative' => 'verify_account_email',
                'name' => 'Diseño de email de verificación de cuenta',
                'description' => <<<HTML

<h1>¡Hola!</h1>
<p>Gracias por registrarte. Por favor, haz clic en el botón para verificar tu cuenta:</p>
<p>
    <a href="{{ verificationUrl }}">Verificar cuenta</a>
</p>
<p>Si no creaste una cuenta, ignora este correo.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
            ],
            [
                'correlative' => 'blog_published_email',
                'name' => 'Diseño de email de blog publicado',
                'description' => <<<HTML

<h1>¡Hola!</h1>
<p>Se ha publicado un nuevo blog: <strong>{{ title }}</strong></p>
<p>
    <a href="{{ url }}">Leer blog</a>
</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
            ],
            [
                'correlative' => 'purchase_summary_email',
                'name' => 'Diseño de email de resumen de compra',
                'description' => <<<HTML

<h1>¡Gracias por tu compra!</h1>
<p>Hola {{ nombre }},</p>
<p><strong>Código de pedido:</strong> {{ codigo }}<br><strong>Total:</strong> S/ {{ total }}</p>
<table width="100%">
    <thead>
        <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
        </tr>
    </thead>
    <tbody>
        {{ productos }}
    </tbody>
</table>
<p>¡Gracias por confiar en nosotros!</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
            ],
            [
                'correlative' => 'message_contact_email',
                'name' => 'Diseño de email de confirmación de contacto (para cliente)',
                'description' => $clean_blade_vars(<<<'HTML'

<h1>¡Hola {{ nombre }}!</h1>
<p>Gracias por contactarnos. Hemos recibido tu mensaje y te responderemos pronto.</p>
<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Resumen de tu consulta:</h3>
    <p><strong>Nombre:</strong> {{ nombre }}</p>
    <p><strong>Email:</strong> {{ email }}</p>
    <p><strong>Teléfono:</strong> {{ telefono }}</p>
    <p><strong>Mensaje:</strong></p>
    <p>{{ descripcion }}</p>
    <p><strong>Fecha:</strong> {{ fecha_contacto }}</p>
</div>
<p>Nuestro equipo se pondrá en contacto contigo dentro de las próximas 24 horas.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
                ),
            ],
            
            [
                'correlative' => 'admin_contact_notification_email',
                'name' => 'Diseño de email de notificación de contacto (para admin)',
                'description' => $clean_blade_vars(<<<'HTML'

<h1>Nuevo mensaje de contacto</h1>
<p>Se ha recibido un nuevo mensaje de contacto desde el sitio web:</p>
<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Datos del contacto:</h3>
    <p><strong>Nombre:</strong> {{ nombre }}</p>
    <p><strong>Email:</strong> {{ email }}</p>
    <p><strong>Teléfono:</strong> {{ telefono }}</p>
    <p><strong>Tipo de contacto:</strong> {{ tipo_contacto }}</p>
    <p><strong>Asunto:</strong> {{ asunto }}</p>
    <p><strong>Mensaje:</strong></p>
    <p>{{ descripcion }}</p>
    <p><strong>Fecha:</strong> {{ fecha_contacto }}</p>
    <p><strong>RUC:</strong> {{ ruc }}</p>
</div>
<p>Por favor, responde a este cliente lo antes posible.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
                ),
            ],
            
            [
                'correlative' => 'admin_claim_notification_email',
                'name' => 'Diseño de email de notificación de reclamo (para admin)',
                'description' => $clean_blade_vars(<<<'HTML'

<h1>Nuevo reclamo recibido</h1>
<p>Se ha recibido un nuevo reclamo/queja desde el libro de reclamaciones:</p>
<div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3>Datos del reclamo:</h3>
    <p><strong>Número de reclamo:</strong> {{ numero_reclamo }}</p>
    <p><strong>Cliente:</strong> {{ nombre_completo }}</p>
    <p><strong>Documento:</strong> {{ tipo_documento }} {{ numero_documento }}</p>
    <p><strong>Email:</strong> {{ email }}</p>
    <p><strong>Teléfono:</strong> {{ telefono }}</p>
    <p><strong>Dirección:</strong> {{ direccion }}, {{ distrito }}, {{ provincia }}, {{ departamento }}</p>
    <p><strong>Sede:</strong> {{ sede }}</p>
    <p><strong>Tipo:</strong> {{ tipo_reclamo }}</p>
    <p><strong>Servicio/Producto:</strong> {{ servicio }}</p>
    <p><strong>Fecha del incidente:</strong> {{ fecha_incidente }} {{ hora_incidente }}</p>
    <p><strong>Detalle del reclamo:</strong></p>
    <p>{{ detalle_reclamo }}</p>
    <p><strong>Pedido del cliente:</strong></p>
    <p>{{ pedido }}</p>
    <p><strong>Fecha de registro:</strong> {{ fecha_registro }}</p>
    <p><strong>IP del cliente:</strong> {{ ip_address }}</p>
</div>
<p>Por favor, gestiona este reclamo lo antes posible según los plazos establecidos.</p>
<p>{{ config('app.name') }}<br>&copy; {{ date('Y') }}</p>
HTML
                ),
            ],
            // [
            //     'correlative' => 'phone_contact',
            //     'name' => 'Teléfono de contacto',
            //     'description' => '+51 945 622 983'
            // ],
            // [
            //     'correlative' => 'email_contact',
            //     'name' => 'Correo de contacto',
            //     'description' => 'soporte@trasciende.com'
            // ],
            [
                'correlative' => 'email_coorporativo',
                'name' => 'Email corporativo (para recibir notificaciones)',
                'description' => 'admin@cambiafx.com'
            ],
            // [
            //     'correlative' => 'address',
            //     'name' => 'Dirección',
            //     'description' => 'Calle Nicanor Rocca de Vergallo 493, Magdalena del Mar Lima -Perú'
            // ],
            // [
            //     'correlative' => 'opening_hours',
            //     'name' => 'Horarios de atención',
            //     'description' => 'De lunes a viernes - 10 am a 7pm'
            // ],
            // [
            //     'correlative' => 'support_phone',
            //     'name' => 'Número de soporte',
            //     'description' => '+51 945 622 983'
            // ],
            // [
            //     'correlative' => 'support_email',
            //     'name' => 'Correo de soporte',
            //     'description' => 'soporte@trasciende.com'
            // ],
            // [
            //     'correlative' => 'privacy_policy',
            //     'name' => 'Política de privacidad',
            //     'description' => 'Nuestra política de privacidad protege la información personal de nuestros usuarios...'
            // ],
            // [
            //     'correlative' => 'terms_conditions',
            //     'name' => 'Términos y condiciones',
            //     'description' => 'Al usar nuestros servicios, usted acepta los siguientes términos y condiciones...'
            // ],
            // [
            //     'correlative' => 'location',
            //     'name' => 'Ubicación',
            //     'description' => '-12.097029,-77.037251'
            // ]
        ];

        foreach ($generalData as $data) {
            $data['description'] = $clean_blade_vars($data['description']);
            
            // Solo crear si no existe, no actualizar
            $exists = General::where('correlative', $data['correlative'])
                           ->where('lang_id', $defaultLang->id)
                           ->exists();
            
            if (!$exists) {
                General::create([
                    'correlative' => $data['correlative'],
                    'name' => $data['name'],
                    'description' => $data['description'],
                    'lang_id' => $defaultLang->id
                ]);
                echo "✓ Creado: {$data['correlative']}\n";
            } else {
                echo "- Ya existe: {$data['correlative']}\n";
            }
        }
        
        echo "Seeder completado. Se crearon/actualizaron " . count($generalData) . " plantillas de email.\n";
    }
}
