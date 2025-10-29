<?php

namespace Database\Seeders;

use App\Models\Aboutus;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AboutusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $aboutuses = [
            // Secciones de la página About
            [
                'correlative' => 'section-1-about',
                'name' => 'Sobre Nosotros',
                'title' => 'Innovación en Logística Empresarial',
                'description' => '<p>En Home Delivery Logistics, transformamos la manera en que las empresas gestionan sus entregas. Contamos con tecnología de punta y un equipo altamente capacitado que garantiza la satisfacción de nuestros clientes.</p><p>Somos líderes en soluciones logísticas inteligentes que conectan negocios con sus clientes de manera eficiente y confiable.</p>',
                'image' => null,
                'visible' => true,
                'status' => true,
            ],
            [
                'correlative' => 'section-2-about',
                'name' => 'Fortalezas',
                'title' => '¿Por qué confiar en nosotros?',
                'description' => 'Nuestras fortalezas nos posicionan como líderes en el sector logístico',
                'image' => null,
                'visible' => true,
                'status' => true,
            ],
            [
                'correlative' => 'section-3-about',
                'name' => 'Confianza',
                'title' => 'Construyendo Confianza a Través de la Excelencia',
                'description' => '<p>Desde nuestra fundación, nos hemos comprometido con la excelencia operativa, la innovación constante y el servicio al cliente de primer nivel.</p><p>Nuestros estándares de calidad y eficiencia nos han permitido establecer relaciones duraderas con nuestros clientes, quienes confían en nosotros para sus necesidades logísticas más críticas.</p><p>Trabajamos día a día para superar las expectativas, adaptándonos a las necesidades cambiantes del mercado y ofreciendo soluciones personalizadas que impulsan el crecimiento de nuestros socios comerciales.</p>',
                'image' => null,
                'visible' => true,
                'status' => true,
            ],
            [
                'correlative' => 'section-4-about',
                'name' => 'Futuro',
                'title' => 'Construyendo el Futuro de la Logística',
                'description' => '<p>Miramos hacia el futuro con optimismo y determinación. Nuestra visión es convertirnos en el socio logístico preferido de las empresas que buscan innovación, eficiencia y resultados medibles.</p><p>Continuamos invirtiendo en tecnología de vanguardia, capacitación de personal y expansión de nuestra red de distribución para estar siempre un paso adelante.</p><p>El futuro de la logística es digital, sostenible y centrado en el cliente. Estamos listos para liderarlo.</p>',
                'image' => null,
                'visible' => true,
                'status' => true,
            ],

            // Datos generales existentes
            [
                'correlative' => 'about-us',
                'name' => 'Nosotros',
                'description' => 'Nos enfocamos en valorar y personalizar la experiencia del *auto cuidado* y del cuidado del *medio ambiente*. Creemos que se puede generar bienestar en las personas mostrándoles la mejor versión de cada *un@* y *empoderándol@s*. Es por eso que apostamos por crear fórmulas únicas a través de experiencias digitales de personalización. Creando productos orgánicos, libre de parabenos, sulfatos y libres de maltrato animal. De las miles de combinaciones que existen, la tuya es única, abrázala.',
            ],
            [
                'correlative' => 'phone',
                'name' => 'Teléfono',
                'description' => '5114605000',
            ],
            [
                'correlative' => 'email',
                'name' => 'Correo',
                'description' => 'hola@vua.pe',
            ],
            [
                'correlative' => 'whatsapp',
                'name' => 'WhatsApp',
                'description' => '5114605000',
            ],
            [
                'correlative' => 'customer-complaints',
                'name' => 'Libro de reclamaciones',
                'description' => 'https://docs.google.com/forms/d/e/1FAIpQLSesYBA7aagw3XFpqZelSLb70mx4qEI4XO2PXh6JcVV5ghnkrQ/viewform'
            ]
        ];

        foreach ($aboutuses as $aboutus) {
            Aboutus::updateOrCreate(['correlative' => $aboutus['correlative']], $aboutus);
        }
    }
}
