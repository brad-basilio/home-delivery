<?php

namespace Database\Seeders;

use App\Models\Strength;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class StrengthSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $strengths = [
            [
                'name' => 'Entrega Rápida y Confiable',
                'description' => 'Garantizamos entregas puntuales con un sistema de seguimiento en tiempo real para que tus clientes siempre sepan dónde está su pedido.',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Cobertura Nacional',
                'description' => 'Llegamos a todas las regiones del país con una red de distribución robusta y eficiente que no conoce límites.',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Tecnología de Vanguardia',
                'description' => 'Plataforma digital intuitiva que facilita la gestión de pedidos, tracking en vivo y reportes detallados para tu negocio.',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Atención al Cliente 24/7',
                'description' => 'Soporte dedicado disponible en todo momento para resolver cualquier inquietud o necesidad de manera inmediata.',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Soluciones Personalizadas',
                'description' => 'Adaptamos nuestros servicios a las necesidades específicas de tu negocio con planes flexibles y escalables.',
                'visible' => true,
                'status' => true,
            ],
            [
                'name' => 'Compromiso con la Sostenibilidad',
                'description' => 'Implementamos prácticas ecológicas en nuestras operaciones para reducir el impacto ambiental y construir un futuro más verde.',
                'visible' => true,
                'status' => true,
            ]
        ];

        foreach ($strengths as $strength) {
            Strength::updateOrCreate([
                'name' => $strength['name']
            ], $strength);
        }
    }
}
