<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\BasicController;
use App\Models\Office;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use SoDe\Extend\Crypto;

class OfficeController extends BasicController
{
    public $model = Office::class;
    public $reactView = 'Admin/Offices';
    public $imageFields = ['image'];

    public function setReactViewProperties(Request $request)
    {
        return [];
    }

    public function beforeSave(Request $request)
    {
        $body = $request->all();

        // Procesar imagen
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $uuid = Crypto::randomUUID();
            $ext = $file->getClientOriginalExtension();
            $path = "images/office/{$uuid}.{$ext}";
            Storage::put($path, file_get_contents($file));
            $body['image'] = "{$uuid}.{$ext}";
        }

        // Procesar horarios de atención
        if ($request->has('business_hours')) {
            $businessHours = json_decode($request->business_hours, true);
            if (is_array($businessHours)) {
                $body['business_hours'] = $businessHours;
            }
        }

        return $body;
    }
}
