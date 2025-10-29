import React from 'react';
import ServiceCard from './ServiceCard';

// Íconos de servicios (SVG simples para evitar dependencias externas)
const TruckIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ReturnIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
  </svg>
);

const StoreIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ClockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const Services = () => {
  const services = [
    {
      icon: TruckIcon,
      title: 'Distribución de Última Milla',
      description: 'Entrega directa al cliente final con rutas optimizadas y seguimiento en tiempo real para máxima eficiencia.'
    },
    {
      icon: ReturnIcon,
      title: 'Logística Inversa',
      description: 'Gestión eficiente de devoluciones y retornos, facilitando el proceso de cambio o garantía de productos.'
    },
    {
      icon: StoreIcon,
      title: 'Distribución a Puntos de Venta',
      description: 'Abastecimiento oportuno a tiendas y puntos de venta con control de inventario y reposición automática.'
    },
    {
      icon: ClockIcon,
      title: 'Same Day Delivery',
      description: 'Entrega el mismo día para pedidos urgentes dentro de Lima Metropolitana y principales ciudades.'
    },
    {
      icon: MapPinIcon,
      title: 'Retiro en Puntos Mall Plaza',
      description: 'Red de puntos de retiro estratégicos en centros comerciales Mall Plaza para mayor comodidad del cliente.'
    }
  ];

  return (
    <section id="servicios" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-hd-onyx mb-4">
            Nuestros Servicios
          </h2>
          <p className="text-lg text-hd-gray max-w-2xl mx-auto">
            Soluciones logísticas integrales diseñadas para impulsar el crecimiento de tu negocio
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {services.map((service, index) => (
            <ServiceCard key={index} {...service} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
