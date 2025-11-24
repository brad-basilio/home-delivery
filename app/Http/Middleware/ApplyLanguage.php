<?php

namespace App\Http\Middleware;

use App\Models\Lang;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ApplyLanguage
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        // 1. Intenta obtener el idioma desde la sesión
        $langId = $request->session()->get('current_lang_id')
            // 2. Si no hay en la sesión, lo toma desde el header personalizado
            ?: $request->header('X-Lang-Id');

        // Validar que el ID exista en la DB
        if ($langId && !Lang::where('id', $langId)->exists()) {
            $langId = null;
        }

        // Si no es válido, usar el por defecto
        $langId = $langId ?: optional(Lang::where('is_default', true)->first())->id;

        // 4. Si encontró un lang_id válido, lo guarda en la sesión y lo expone a la app
        if ($langId) {
            session(['current_lang_id' => $langId]);
            app()->instance('current_lang_id', $langId);
        }

        return $next($request);
    }
}
