import React from 'react';
import { 
  FileText, 
  Home, 
  UserX, 
  Clock, 
  Split, 
  MapPin, 
  Shield 
} from 'lucide-react';

const Services = () => {
  const services = [
    {
      icon: FileText,
      title: "Contratos de compra venta de inmuebles",
      description: "Redacción y revisión de contratos seguros para proteger tu inversión."
    },
    {
      icon: Home,
      title: "Contrato de arrendamiento",
      description: "Contratos de renta que protegen tanto a propietarios como inquilinos."
    },
    {
      icon: UserX,
      title: "Desalojos",
      description: "Procedimientos legales eficientes para recuperar tu propiedad."
    },
    {
      icon: Clock,
      title: "Prescripción adquisitiva de dominio",
      description: "Te ayudamos a obtener la propiedad por posesión prolongada."
    },
    {
      icon: Split,
      title: "División y partición",
      description: "División legal de propiedades entre copropietarios."
    },
    {
      icon: MapPin,
      title: "Regularización de terrenos",
      description: "Legalización de terrenos irregulares ante las autoridades."
    },
    {
      icon: Shield,
      title: "Defensa en juicios de propiedad inmueble",
      description: "Representación legal experta en disputas de propiedad."
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nuestros Servicios Especializados
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Ofrecemos soluciones legales integrales para todos tus asuntos inmobiliarios, 
            con la experiencia y profesionalismo que tu propiedad merece.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-100 hover:border-blue-200 transform hover:-translate-y-2 group"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-lg mb-4 group-hover:bg-blue-600 transition-colors duration-300">
                  <IconComponent className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300" />
                </div>
                
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
                  {service.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;