import { Plug, Camera, MapPinned, Shield } from 'lucide-react';

const Benefits = () => {
  const benefits = [
    {
      icon: Plug,
      title: 'Integración API',
      description:
        'Conecta tus sistemas fácilmente con nuestra API robusta y documentada.',
    },
    {
      icon: Camera,
      title: 'Evidencia Digital',
      description:
        'Foto y firma electrónica en cada entrega para total transparencia.',
    },
    {
      icon: MapPinned,
      title: 'Tracking en Línea',
      description:
        'Seguimiento en tiempo real de tus envíos desde cualquier dispositivo.',
    },
    {
      icon: Shield,
      title: 'Seguro Incluido',
      description:
        'Protección total de tus envíos sin costos adicionales.',
    },
  ];

  return (
    <section id="beneficios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-onyx mb-4">
            Beneficios
          </h2>
          <p className="text-xl text-brand-gray font-light max-w-2xl mx-auto">
            Tecnología y servicios que marcan la diferencia
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-8 text-center hover:shadow-lg transition-shadow duration-300"
            >
              <div className="w-16 h-16 bg-brand-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-6">
                <benefit.icon className="w-8 h-8 text-brand-blue" />
              </div>
              <h3 className="text-lg font-medium text-brand-onyx mb-3">
                {benefit.title}
              </h3>
              <p className="text-brand-gray font-light leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Benefits;
