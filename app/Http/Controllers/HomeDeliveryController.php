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
        // Aquí puedes pasar datos dinámicos desde la base de datos
        // Por ahora retornamos un array vacío ya que el componente
        // tiene todos los datos hardcodeados
        
        return [
            // Ejemplo si necesitas datos dinámicos:
            // 'services' => Service::where('visible', true)->get(),
            // 'testimonials' => Testimonial::where('visible', true)->get(),
        ];
    }
}
