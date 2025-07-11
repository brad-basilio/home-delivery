<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;
use SoDe\Extend\Response;

class ServiceController extends BasicController

{
    public $model = Service::class;
    public $reactView = 'Admin/Services';
    public $imageFields = ['image','icon'];

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
                $path = "images/service/{$uuid}.{$ext}";
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
        if ($request->has('characteristics')) {
            $characteristics = json_decode($request->characteristics, true);
            $body['characteristics'] = array_values(array_filter($characteristics, function ($item) {
                return !empty(trim($item));
            }));
        }

        return $body;
    }

    public function afterSave(Request $request, $service)
    {
        // Eliminar imágenes marcadas para borrar (si implementas esta función)
        return $service;
    }
}
