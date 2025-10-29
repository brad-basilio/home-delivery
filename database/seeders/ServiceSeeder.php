<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Service;
use Illuminate\Support\Str;

class ServiceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     * Seedea los servicios principales de Home Delivery Logistics
     */
    public function run()
    {
        // Obtener el idioma por defecto
        $defaultLang = \App\Models\Lang::first();
        
        if (!$defaultLang) {
            $this->command->error('❌ No hay idiomas en la base de datos. Ejecuta primero los seeders de Lang.');
            return;
        }

        $services = [
            [
                'title' => 'Distribución de Última Milla',
                'description' => 'Nos encargamos de que tus productos lleguen de forma segura y puntual al cliente final, con entregas puerta a puerta, cobertura en todas las regiones y seguimiento en tiempo real.',
                'characteristics' => [
                    'Entregas puerta a puerta en todo el Perú',
                    'Seguimiento GPS en tiempo real',
                    'Cobertura nacional con más de 8 almacenes'
                ],
                'icon' => null, // Se subirá desde el admin panel
                'image' => null,
                'gallery' => [],
            ],
            [
                'title' => 'Logística Inversa',
                'description' => 'Gestionamos devoluciones con trazabilidad completa y cobertura nacional, asegurando procesos eficientes y confiables que permiten a tus clientes realizar cambios o devoluciones sin complicaciones.',
                'characteristics' => [
                    'Trazabilidad completa de devoluciones',
                    'Cobertura nacional para retornos',
                    'Procesos ágiles y certificados'
                ],
                'icon' => null,
                'image' => null,
                'gallery' => [],
            ],
            [
                'title' => 'Distribución a Puntos de Venta',
                'description' => 'Aseguramos el abastecimiento de tus puntos de venta mediante entregas corporativas con ventanas horarias definidas, para que tu operación funcione sin interrupciones.',
                'characteristics' => [
                    'Ventanas horarias personalizadas',
                    'Entregas corporativas programadas',
                    'Control de inventario en tiempo real'
                ],
                'icon' => null,
                'image' => null,
                'gallery' => [],
            ],
            [
                'title' => 'Same Day Delivery',
                'description' => 'Ofrecemos entregas el mismo día en Lima y principales ciudades, un servicio diseñado para empresas que requieren velocidad y eficiencia, con seguimiento en tiempo real en cada envío.',
                'characteristics' => [
                    'Entrega en menos de 24 horas',
                    'Cobertura en Lima y ciudades principales',
                    'Seguimiento en tiempo real'
                ],
                'icon' => null,
                'image' => null,
                'gallery' => [],
            ],
            [
                'title' => 'Retiro en Puntos Mall Plaza',
                'description' => 'Brindamos la opción de entregar tus productos en cualquiera de los 5 Puntos Mall Plaza presentes a nivel nacional. Ubicados estratégicamente para facilitar tus operaciones y optimizar la experiencia de retiro.',
                'characteristics' => [
                    '5 puntos estratégicos a nivel nacional',
                    'Horarios extendidos de atención',
                    'Notificaciones automáticas de llegada'
                ],
                'icon' => null,
                'image' => null,
                'gallery' => [],
            ],
        ];

        foreach ($services as $serviceData) {
            Service::updateOrCreate(
                ['title' => $serviceData['title']], // Buscar por título
                [
                    'description' => $serviceData['description'],
                    'characteristics' => $serviceData['characteristics'],
                    'icon' => $serviceData['icon'],
                    'image' => $serviceData['image'],
                    'gallery' => $serviceData['gallery'],
                    'visible' => true,
                    'status' => true,
                    'featured' => false,
                    'slug' => Str::slug($serviceData['title']),
                    'color' => 'transparent',
                    'link' => null,
                    'lang_id' => $defaultLang->id, // Idioma por defecto
                ]
            );
        }

        $this->command->info('✅ 5 Servicios creados/actualizados exitosamente!');
        $this->command->warn('⚠️  SIGUIENTE PASO: Sube los iconos PNG desde el panel admin (/admin/services)');
        $this->command->info('');
        $this->command->info('📋 Iconos recomendados (PNG blancos, tamaño 512x512):');
        $this->command->info('   1. Distribución de Última Milla: Ícono de camión/delivery');
        $this->command->info('   2. Logística Inversa: Ícono de flecha de retorno/caja');
        $this->command->info('   3. Distribución a Puntos de Venta: Ícono de tienda/edificio');
        $this->command->info('   4. Same Day Delivery: Ícono de reloj/rápido');
        $this->command->info('   5. Retiro en Puntos Mall Plaza: Ícono de ubicación/shopping');
        $this->command->info('');
        $this->command->info('🎨 Los iconos se mostrarán en BLANCO sobre los colores de la empresa');
    }
}
