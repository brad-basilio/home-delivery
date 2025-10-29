import { Truck, RotateCcw, Building2, Zap, MapPin } from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: Truck,
      title: 'Distribución de Última Milla',
      description:
        'Entregas puerta a puerta, cobertura nacional y tracking en tiempo real.',
    },
    {
      icon: RotateCcw,
      title: 'Logística Inversa',
      description:
        'Devoluciones con trazabilidad y procesos eficientes en todo el país.',
    },
    {
      icon: Building2,
      title: 'Distribución a Puntos de Venta',
      description:
        'Entregas corporativas con ventanas horarias definidas.',
    },
    {
      icon: Zap,
      title: 'Same Day Delivery',
      description:
        'Entregas el mismo día en Lima y ciudades principales, con tracking en tiempo real.',
    },
    {
      icon: MapPin,
      title: 'Retiro en Puntos Mall Plaza',
      description:
        'Opción de retiro en 5 Puntos Mall Plaza estratégicamente ubicados a nivel nacional.',
    },
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-onyx mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-xl text-brand-gray font-light max-w-2xl mx-auto">
            Soluciones logísticas integrales para hacer crecer tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-100 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-14 h-14 bg-brand-green bg-opacity-10 rounded-lg flex items-center justify-center mb-6">
                <service.icon className="w-7 h-7 text-brand-green" />
              </div>
              <h3 className="text-xl font-medium text-brand-onyx mb-3">
                {service.title}
              </h3>
              <p className="text-brand-gray font-light leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
