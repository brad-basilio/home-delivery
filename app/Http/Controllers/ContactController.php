<?php

namespace App\Http\Controllers;

use App\Models\General;
use App\Models\Office;
use App\Models\Social;
use Illuminate\Http\Request;

class ContactController extends BasicController
{
    public $reactView = 'ContactoPage';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        // Obtener todas las oficinas visibles y activas
        $offices = Office::where('visible', true)
            ->where('status', true)
            ->orderByRaw("CASE WHEN type = 'oficina_principal' THEN 1 WHEN type = 'oficina' THEN 2 ELSE 3 END")
            ->get();

        // Obtener generals y socials para footer y whatsapp
        $generals = General::all();
        $socials = Social::where('status', true)->get();

        return [
            'offices' => $offices,
            'generals' => $generals,
            'socials' => $socials,
        ];
    }
}
