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
        
        $services = \App\Models\Service::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'ASC')
            ->get();
        
        $generals = \App\Models\General::where('lang_id', $langId)->get();
        $socials = \App\Models\Social::where('status', true)->where('visible', true)->get();
        
        return [
            'sliders' => $sliders,
            'indicators' => $indicators,
            'services' => $services,
            'generals' => $generals,
            'socials' => $socials,
        ];
    }
}
