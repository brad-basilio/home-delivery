<?php

namespace App\Http\Controllers;

use App\Helpers\NotificationHelper;
use App\Models\Complaint;
use App\Models\ComplaintAttachment;
use App\Models\Facility;
use App\Models\General;
use App\Models\LandingHome;
use App\Models\Office;
use App\Models\Service;
use App\Models\Social;
use App\Models\Staff;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Text;

class ComplaintController extends BasicController
{
    public $reactView = 'LibroDeReclamaciones';
    public $reactRootView = 'public';
    public $model = Complaint::class;


    public function setReactViewProperties(Request $request)
    {
        $landing = LandingHome::where('correlative', 'like', 'page_contact%')->get();
        $offices = Office::where('visible', true)->where('status', true)->get();
        $terms = General::where('correlative', '=', 'terms_conditions')->first();
        $services = Service::where('status', true)->where('visible', true)->get();
        $whatsapp = Social::where('status', true)->where('visible', true)->where('description', '=', 'WhatsApp')->first();
        return [
            'landing' => $landing,
            'offices' => $offices,
            'whatsapp' => $whatsapp,
            'servicios' => $services,
            'terms' => $terms,
        ];
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'apellido' => 'required|string|max:100',
            'tipoDocumento' => 'required|in:dni,ce,pasaporte,ruc',
            'numeroDocumento' => 'required|string|max:20',
            'telefono' => 'required|string|max:20',
            'email' => 'required|email|max:100',
            'direccion' => 'required|string|max:255',
            'office_id' => 'required|exists:offices,id',
            'servicio' => 'required|string|max:100',
            'tipoReclamo' => 'required|in:queja,reclamo',
            'fechaIncidente' => 'required|date',
            'detalleReclamo' => 'required|string|min:10',
            'pedido' => 'required|string|min:10',
            'aceptaTerminos' => 'required|accepted',
        ]);

        try {
            // Obtener el nombre de la oficina para guardar en sede (retrocompatibilidad)
            $office = Office::find($validated['office_id']);
            
            // Crear el reclamo
            $complaint = Complaint::create([
                'nombre' => $validated['nombre'],
                'apellido' => $validated['apellido'],
                'tipo_documento' => $validated['tipoDocumento'],
                'numero_documento' => $validated['numeroDocumento'],
                'telefono' => $validated['telefono'],
                'email' => $validated['email'],
                'direccion' => $validated['direccion'],
                'office_id' => $validated['office_id'],
                'sede' => $office ? $office->name : '',
                'servicio' => $validated['servicio'],
                'tipo_reclamo' => $validated['tipoReclamo'],
                'fecha_incidente' => $validated['fechaIncidente'],
                'hora_incidente' => $request->input('horaIncidente'),
                'detalle_reclamo' => $validated['detalleReclamo'],
                'pedido' => $validated['pedido'],
                'autoriza_notificacion' => $request->boolean('autorizaNotificacion'),
                'acepta_terminos' => true,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);
            $snake_case = Text::camelToSnakeCase(str_replace('App\\Models\\', '', $this->model));
            // Manejo de archivos adjuntos (nueva forma consistente)
            if ($request->hasFile('archivos')) {
                foreach ($request->file('archivos') as $file) {
                    if ($file->isValid()) {
                        $full = $request->file($file);
                        $uuid = Crypto::randomUUID();
                        $ext = $full->getClientOriginalExtension();
                        $path = "files/{$snake_case}/{$uuid}.{$ext}";
                        Storage::put($path, file_get_contents($full));
                        $ruta_archivo = "{$uuid}.{$ext}";

                        ComplaintAttachment::create([
                            'complaint_id' => $complaint->id,
                            'nombre_archivo' => $file->getClientOriginalName(),
                            'ruta_archivo' => $ruta_archivo,
                            'mime_type' => $file->getMimeType(),
                            'tamanio' => $file->getSize(),
                        ]);
                    }
                }
            }

            // Enviar notificaciones al usuario y al administrador
            try {
                Log::info('ComplaintController - Iniciando envío de notificaciones', [
                    'complaint_id' => $complaint->id,
                    'numero_reclamo' => $complaint->numero_reclamo,
                    'client_email' => $complaint->email,
                    'tipo_reclamo' => $complaint->tipo_reclamo
                ]);

                NotificationHelper::sendClaimNotification($complaint);

                Log::info('ComplaintController - Notificaciones enviadas exitosamente');
            } catch (\Exception $e) {
                Log::error('ComplaintController - Error al enviar notificaciones de reclamo', [
                    'complaint_id' => $complaint->id,
                    'numero_reclamo' => $complaint->numero_reclamo,
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString()
                ]);
                // No lanzamos la excepción para que el reclamo se registre aunque falle el email
            }

            return response()->json([
                'success' => true,
                'numero_reclamo' => $complaint->numero_reclamo,
                'message' => 'Reclamo registrado exitosamente'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar el reclamo: ' . $e->getMessage()
            ], 500);
        }
    }
}
