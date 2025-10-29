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
        $sliders = \App\Models\Slider::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'DESC')
            ->get();
        
        $indicators = \App\Models\Indicator::where('visible', true)
            ->where('status', true)
            ->orderBy('created_at', 'ASC')
            ->get();
        
        return [
            'sliders' => $sliders,
            'indicators' => $indicators,
            // Aquí puedes agregar más datos dinámicos en el futuro:
            // 'services' => Service::where('visible', true)->get(),
            // 'testimonials' => Testimonial::where('visible', true)->get(),
        ];
    }
}
