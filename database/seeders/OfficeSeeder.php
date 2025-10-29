<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Office;
use Illuminate\Support\Str;

class OfficeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // 1. Oficina Principal - San Isidro Begonias
        Office::create([
            'id' => Str::uuid(),
            'name' => 'Oficina Principal - Begonias',
            'type' => 'oficina_principal',
            'address' => 'Av. Las Begonias 441, San Isidro, Lima',
            'phone' => '(01) 421-5800',
            'email' => 'contacto@homedelivery.pe',
            'description' => 'Nuestra sede principal ubicada en el corazón empresarial de San Isidro. Aquí centralizamos todas nuestras operaciones administrativas y de atención al cliente.',
            'ubigeo' => '150130', // San Isidro
            'latitude' => -12.0964,
            'longitude' => -77.0364,
            'manager' => 'Carlos Rodríguez',
            'capacity' => 50,
            'link' => 'https://maps.app.goo.gl/example1',
            'business_hours' => [
                ['day' => 'Lunes', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                ['day' => 'Martes', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                ['day' => 'Miércoles', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                ['day' => 'Jueves', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                ['day' => 'Viernes', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                ['day' => 'Sábado', 'open' => '09:00', 'close' => '13:00', 'closed' => false],
                ['day' => 'Domingo', 'open' => '', 'close' => '', 'closed' => true],
            ],
            'visible' => true,
            'status' => true,
        ]);

        // 2. Almacén - Villa El Salvador
        Office::create([
            'id' => Str::uuid(),
            'name' => 'Almacén Logístico - Villa El Salvador',
            'type' => 'almacen',
            'address' => 'Av. El Sol Mz. A Lt. 1, Sector 3, Villa El Salvador, Lima',
            'phone' => '(01) 287-9500',
            'email' => 'almacen.ves@homedelivery.pe',
            'description' => 'Nuestro principal centro de distribución y almacenamiento, equipado con tecnología de punta para gestionar grandes volúmenes de mercadería.',
            'ubigeo' => '150142', // Villa El Salvador
            'latitude' => -12.2164,
            'longitude' => -76.9394,
            'manager' => 'Miguel Ángel Torres',
            'capacity' => 5000,
            'link' => 'https://maps.app.goo.gl/example2',
            'business_hours' => [
                ['day' => 'Lunes', 'open' => '07:00', 'close' => '19:00', 'closed' => false],
                ['day' => 'Martes', 'open' => '07:00', 'close' => '19:00', 'closed' => false],
                ['day' => 'Miércoles', 'open' => '07:00', 'close' => '19:00', 'closed' => false],
                ['day' => 'Jueves', 'open' => '07:00', 'close' => '19:00', 'closed' => false],
                ['day' => 'Viernes', 'open' => '07:00', 'close' => '19:00', 'closed' => false],
                ['day' => 'Sábado', 'open' => '08:00', 'close' => '14:00', 'closed' => false],
                ['day' => 'Domingo', 'open' => '', 'close' => '', 'closed' => true],
            ],
            'visible' => true,
            'status' => true,
        ]);

        // 3-10. Almacenes en Provincia (8 almacenes con datos faker)
        $provincias = [
            [
                'name' => 'Almacén Arequipa',
                'city' => 'Arequipa',
                'address' => 'Av. Aviación 401, Parque Industrial, Arequipa',
                'ubigeo' => '040101',
                'latitude' => -16.4090,
                'longitude' => -71.5375,
            ],
            [
                'name' => 'Almacén Trujillo',
                'city' => 'Trujillo',
                'address' => 'Av. América Sur 3145, Urb. San Andrés, Trujillo',
                'ubigeo' => '130101',
                'latitude' => -8.1116,
                'longitude' => -79.0288,
            ],
            [
                'name' => 'Almacén Chiclayo',
                'city' => 'Chiclayo',
                'address' => 'Carretera Panamericana Norte Km 773, Chiclayo',
                'ubigeo' => '140101',
                'latitude' => -6.7714,
                'longitude' => -79.8407,
            ],
            [
                'name' => 'Almacén Piura',
                'city' => 'Piura',
                'address' => 'Av. Grau 850, Zona Industrial, Piura',
                'ubigeo' => '200101',
                'latitude' => -5.1945,
                'longitude' => -80.6328,
            ],
            [
                'name' => 'Almacén Cusco',
                'city' => 'Cusco',
                'address' => 'Av. La Cultura 2350, Wanchaq, Cusco',
                'ubigeo' => '080101',
                'latitude' => -13.5319,
                'longitude' => -71.9675,
            ],
            [
                'name' => 'Almacén Iquitos',
                'city' => 'Iquitos',
                'address' => 'Av. Abelardo Quiñones Km 4.5, Iquitos',
                'ubigeo' => '160101',
                'latitude' => -3.7437,
                'longitude' => -73.2516,
            ],
            [
                'name' => 'Almacén Huancayo',
                'city' => 'Huancayo',
                'address' => 'Av. Ferrocarril 1245, El Tambo, Huancayo',
                'ubigeo' => '120101',
                'latitude' => -12.0653,
                'longitude' => -75.2049,
            ],
            [
                'name' => 'Almacén Tacna',
                'city' => 'Tacna',
                'address' => 'Av. Industrial 320, Parque Industrial, Tacna',
                'ubigeo' => '230101',
                'latitude' => -18.0146,
                'longitude' => -70.2475,
            ],
        ];

        foreach ($provincias as $index => $provincia) {
            $managerNames = [
                'Juan Carlos Mendoza',
                'Rosa María Gutiérrez',
                'Pedro Alonso Vargas',
                'Carmen Elena Silva',
                'Jorge Luis Castillo',
                'María Teresa Ramos',
                'Alberto Sánchez',
                'Patricia Morales'
            ];

            Office::create([
                'id' => Str::uuid(),
                'name' => $provincia['name'],
                'type' => 'almacen',
                'address' => $provincia['address'],
                'phone' => '(' . str_pad($index + 44, 2, '0', STR_PAD_LEFT) . ') ' . rand(200, 999) . '-' . rand(1000, 9999),
                'email' => 'almacen.' . strtolower($provincia['city']) . '@homedelivery.pe',
                'description' => 'Centro de distribución regional ubicado en ' . $provincia['city'] . ', especializado en el manejo y despacho de mercadería para la zona norte/sur/centro del país.',
                'ubigeo' => $provincia['ubigeo'],
                'latitude' => $provincia['latitude'],
                'longitude' => $provincia['longitude'],
                'manager' => $managerNames[$index],
                'capacity' => rand(1500, 3000),
                'link' => 'https://maps.app.goo.gl/example' . ($index + 3),
                'business_hours' => [
                    ['day' => 'Lunes', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                    ['day' => 'Martes', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                    ['day' => 'Miércoles', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                    ['day' => 'Jueves', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                    ['day' => 'Viernes', 'open' => '08:00', 'close' => '18:00', 'closed' => false],
                    ['day' => 'Sábado', 'open' => '09:00', 'close' => '13:00', 'closed' => false],
                    ['day' => 'Domingo', 'open' => '', 'close' => '', 'closed' => true],
                ],
                'visible' => true,
                'status' => true,
            ]);
        }

        $this->command->info('✅ Se crearon 10 oficinas/almacenes exitosamente:');
        $this->command->info('   - 1 Oficina Principal (San Isidro)');
        $this->command->info('   - 1 Almacén Lima (Villa El Salvador)');
        $this->command->info('   - 8 Almacenes en Provincia');
    }
}
