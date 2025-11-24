<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Facility;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;

class FacilityController extends BasicController

{
    public $model = Facility::class;
    public $reactView = 'Admin/Facilities';


    public function beforeSave(Request $request)
    {
        $body = $request->all();

        // Procesar galería de imágenes
        $gallery = [];

        // Agregar imágenes nuevas
        if ($request->hasFile('gallery')) {
            foreach ($request->file('gallery') as $file) {
                $uuid = Crypto::randomUUID();
                $ext = $file->getClientOriginalExtension();
                $path = "images/facility/{$uuid}.{$ext}";
                Storage::put($path, file_get_contents($file));
                $gallery[] = "{$uuid}.{$ext}";
            }
        }

        // Mantener imágenes existentes
        if ($request->has('existing_gallery')) {
            $existing = json_decode($request->existing_gallery, true);
            $gallery = array_merge($gallery, $existing);
        }

        $body['gallery'] = $gallery;

        // Procesar características
        if ($request->has('ubications')) {
            $ubications = json_decode($request->ubications, true);
            $body['ubications'] = array_values(array_filter($ubications, function ($item) {
                return !empty(trim($item));
            }));
        }
        if ($request->has('phones')) {
            $phones = json_decode($request->phones, true);
            $body['phones'] = array_values(array_filter($phones, function ($item) {
                return !empty(trim($item));
            }));
        }
        if ($request->has('emails')) {
            $emails = json_decode($request->emails, true);
            $body['emails'] = array_values(array_filter($emails, function ($item) {
                return !empty(trim($item));
            }));
        }
        if ($request->has('business_hours')) {
            $business_hours = json_decode($request->business_hours, true);
            $body['business_hours'] = array_values(array_filter($business_hours, function ($item) {
                return !empty(trim($item));
            }));
        }

        return $body;
    }

    public function afterSave(Request $request, object $jpa, ?bool $isNew)
    {
        // Eliminar imágenes marcadas para borrar (si implementas esta función)
        return $jpa;
    }
}
