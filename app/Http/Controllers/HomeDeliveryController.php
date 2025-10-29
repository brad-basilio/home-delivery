<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class HomeDeliveryController extends BasicController
{
    /**
     * Vista React que se va a renderizar
     */
    public $reactView = 'HomeDeliveryPage';
    
    /**
     * Vista raíz de React
     */
    public $reactRootView = 'public';

    /**
     * Define las propiedades que se pasarán al componente React
     * 
     * @param Request $request
     * @return array
     */
    public function setReactViewProperties(Request $request)
    {
        $langId = app('current_lang_id');
        
        $sliders = \App\Models\Slider::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'DESC')
            ->get();
        
        $indicators = \App\Models\Indicator::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'ASC')
            ->get();
        
        // Solo servicios destacados (featured)
        $services = \App\Models\Service::where('visible', true)
            ->where('status', true)
            ->where('featured', true)
            ->orderBy('created_at', 'ASC')
            ->get();
        
        $strengths = \App\Models\Strength::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'ASC')
            ->get();
        
        // Testimonios más recientes
        $testimonies = \App\Models\Testimony::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'DESC')
            ->limit(6)
            ->get();
        
        // Posts más recientes del blog (Post solo tiene 'status', no 'visible')
        $posts = \App\Models\Post::where('status', true)
            ->orderBy('created_at', 'DESC')
            ->limit(3)
            ->get();
        
        $generals = \App\Models\General::where('lang_id', $langId)->get();
        $socials = \App\Models\Social::where('status', true)->where('visible', true)->get();
        
        return [
            'sliders' => $sliders,
            'indicators' => $indicators,
            'services' => $services,
            'strengths' => $strengths,
            'testimonies' => $testimonies,
            'posts' => $posts,
            'generals' => $generals,
            'socials' => $socials,
        ];
    }
}
