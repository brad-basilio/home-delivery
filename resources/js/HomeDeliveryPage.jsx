import { createRoot } from 'react-dom/client';
import CreateReactScript from './Utils/CreateReactScript';
import { useState, useEffect } from 'react';

// Importar estilos personalizados de Home Delivery
import '../css/homedelivery.css';

// Importar todos los componentes de Home Delivery
import Header from './components/HomeDelivery/Header';
import Hero from './components/HomeDelivery/Hero';
import Indicators from './components/HomeDelivery/Indicators';
import Services from './components/HomeDelivery/Services';
import Benefits from './components/HomeDelivery/Benefits';
import Testimonials from './components/HomeDelivery/Testimonials';
import RecentBlog from './components/HomeDelivery/RecentBlog';
import Footer from './components/HomeDelivery/Footer';
import WhatsAppButton from './components/HomeDelivery/WhatsAppButton';

/**
 * HomeDeliveryPage - Landing Page Principal de Home Delivery Logistics
 * 
 * Esta es la página principal que integra todos los componentes
 * de la landing page moderna de Home Delivery.
 */
const HomeDeliveryPage = (props) => {
  // Extraer datos dinámicos desde las props que vienen del backend
  const { sliders = [], indicators = [], services = [], strengths = [], testimonies = [], posts = [], generals = [], socials = [] } = props;

  // Configurar título y meta descripción
  useEffect(() => {
    document.title = 'Home Delivery Logistics - Soluciones Logísticas Integrales';
    
    // Actualizar meta description
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Servicios logísticos de última milla, entregas same day, puntos de venta y más. Tecnología de rastreo en tiempo real.';
  }, []);

  return (
    <div className="min-h-screen bg-white font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
      {/* Header con navegación sticky */}
      <Header />

      {/* Sección Hero con Slider Dinámico */}
      <Hero sliders={sliders} />

      {/* Sección de Indicadores */}
      <Indicators indicators={indicators} />

      {/* Sección de Servicios Destacados */}
      <Services services={services} socials={socials} generals={generals} />

      {/* Sección de Testimonios */}
      <Testimonials testimonies={testimonies} />

      {/* Sección de Blog Reciente */}
      <RecentBlog posts={posts} />

      {/* Footer */}
      <Footer generals={generals} socials={socials} />

      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton socials={socials} generals={generals} />
    </div>
  );
};

// Registrar el script React (patrón usado en el proyecto)
CreateReactScript((el, properties) => {
  const root = createRoot(el);
  root.render(<HomeDeliveryPage {...properties} />);
});

export default HomeDeliveryPage;
