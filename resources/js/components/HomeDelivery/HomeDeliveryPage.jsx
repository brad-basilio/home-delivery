import React, { useEffect } from 'react';
import Header from './Header';
import Hero from './Hero';
import Services from './Services';
import Benefits from './Benefits';
import QuoteForm from './QuoteForm';
import Locations from './Locations';
import Footer from './Footer';
import WhatsAppButton from './WhatsAppButton';

/**
 * Página principal de Home Delivery Logistics
 * Landing page moderna y responsiva con todos los componentes integrados
 * Respeta la identidad visual del Manual de Marca oficial
 */
const HomeDeliveryPage = () => {
  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);

    // Set page title and meta
    document.title = 'Home Delivery Logistics - Logística que llega más lejos';
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        'content',
        'Soluciones logísticas integrales para hacer crecer tu negocio. Distribución de última milla, logística inversa, same day delivery y más. Cobertura nacional.'
      );
    } else {
      const meta = document.createElement('meta');
      meta.name = 'description';
      meta.content = 'Soluciones logísticas integrales para hacer crecer tu negocio. Distribución de última milla, logística inversa, same day delivery y más. Cobertura nacional.';
      document.head.appendChild(meta);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* Header fijo */}
      <Header />

      {/* Hero Section */}
      <Hero />

      {/* Servicios */}
      <Services />

      {/* Beneficios */}
      <Benefits />

      {/* Formulario de Cotización */}
      <QuoteForm />

      {/* Ubicaciones */}
      <Locations />

      {/* Footer */}
      <Footer />

      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton />
    </div>
  );
};

export default HomeDeliveryPage;
