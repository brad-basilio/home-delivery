<?php

namespace App\Http\Controllers;

use App\Models\Aboutus;
use App\Models\General;
use App\Models\Indicator;
use App\Models\InstagramPost;
use App\Models\LandingHome;
use App\Models\Lang;
use App\Models\Social;
use App\Models\Specialty;
use App\Models\Staff;
use App\Models\Strength;
use App\Models\Testimony;
use Illuminate\Http\Request;

class AboutController extends BasicController
{
    public $reactView = 'AboutPage';
    public $reactRootView = 'public';

    public function setReactViewProperties(Request $request)
    {
        // ABOUTUSES - Secciones de la página About
        $aboutuses = Aboutus::where('visible', true)
            ->where('status', true)
            ->get();

        // STRENGTHS - Fortalezas de la empresa (sin lang_id)
        $strengths = Strength::where('visible', true)
            ->where('status', true)
            ->get();

        // GENERALS - Configuración general (email, teléfono, etc)
        $generals = General::where('status', true)->get();

        // SOCIALS - Redes sociales
        $socials = Social::where('visible', true)->get();

        return [
            'aboutuses' => $aboutuses,
            'strengths' => $strengths,
            'generals' => $generals,
            'socials' => $socials,
        ];
    }
}
