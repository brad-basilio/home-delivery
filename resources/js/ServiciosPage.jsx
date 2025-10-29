import { createRoot } from 'react-dom/client';
import CreateReactScript from './Utils/CreateReactScript';
import { useState, useEffect } from 'react';
import '../css/homedelivery.css';
import Header from './components/HomeDelivery/Header';
import Footer from './components/HomeDelivery/Footer';
import WhatsAppButton from './components/HomeDelivery/WhatsAppButton';

const ServiciosPage = (props) => {
  const { services = [], generals = [], socials = [] } = props;
  const [selectedService, setSelectedService] = useState(null);
  const whatsappNumber = generals?.find(g => g.correlative === 'whatsapp_phone')?.description || '51933411599';
  const whatsappMessage = generals?.find(g => g.correlative === 'message_whatsapp')?.description || 'Hola, me gustaría obtener más información sobre sus servicios logísticos.';
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  useEffect(() => {
    document.title = 'Servicios - Home Delivery Logistics';
    let metaDescription = document.querySelector('meta[name=description]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Descubre todos nuestros servicios logísticos.';
  }, []);

  const colorSchemes = [
    { gradient: 'from-hd-android to-hd-android/80', text: 'text-hd-android', hover: 'hover:border-hd-android' },
    { gradient: 'from-hd-cerise to-hd-cerise/80', text: 'text-hd-cerise', hover: 'hover:border-hd-cerise' },
    { gradient: 'from-hd-cerulean to-hd-cerulean/80', text: 'text-hd-cerulean', hover: 'hover:border-hd-cerulean' },
    { gradient: 'from-hd-spanish to-hd-spanish/80', text: 'text-hd-spanish', hover: 'hover:border-hd-spanish' }
  ];

  return (
    <div className="min-h-screen bg-white font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-12 md:pb-20 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-hd-android rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-hd-cerise rounded-full blur-3xl" />
          </div>

          <div className="w-full 2xl:max-w-7xl mx-auto px-4 md:px-8 2xl:px-0 relative z-10">
            <div className="text-center mb-16">
              <div 
                className="inline-block px-6 py-2 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
                }}
              >
                <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Nuestros Servicios</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Soluciones Logísticas{' '}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                  }}
                >
                  Integrales
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Impulsamos el crecimiento de tu negocio con tecnología de punta y un equipo comprometido
              </p>
            </div>
          </div>
        </section>

        {/* Grid de Servicios */}
        <section className="relative py-12 md:py-20 overflow-hidden bg-white">
          <div className="w-full 2xl:max-w-7xl mx-auto px-4 md:px-8 2xl:px-0 relative z-10">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => {
                const colorScheme = colorSchemes[index % colorSchemes.length];
                
                return (
                  <div
                    key={service.id}
                    className={`group relative bg-white rounded-3xl border-2 border-gray-100 ${colorScheme.hover} transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden`}
                    onClick={() => setSelectedService(service)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorScheme.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                    
                    <div className="relative p-8">
                      <div className="mb-6">
                        <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${colorScheme.gradient} shadow-lg group-hover:scale-110 transition-transform duration-500`}>
                          <img
                            src={`/api/service/media/${service.icon}`}
                            alt={service.title}
                            className="w-10 h-10 object-contain filter brightness-0 invert"
                            onError={(e) => {
                              e.target.style.display = 'none';
                            }}
                          />
                        </div>
                      </div>

                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gray-700 transition-colors">
                        {service.title}
                      </h3>

                      <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                        {service.description}
                      </p>

                      {service.characteristics && service.characteristics.length > 0 && (
                        <ul className="space-y-2 mb-6">
                          {service.characteristics.slice(0, 3).map((char, idx) => (
                            <li key={idx} className="flex items-start text-sm text-gray-600">
                              <svg className={`w-5 h-5 ${colorScheme.text} mr-2 flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              {char}
                            </li>
                          ))}
                        </ul>
                      )}

                      <button className={`inline-flex items-center ${colorScheme.text} font-semibold group/btn`}>
                        <span>Ver detalles</span>
                        <svg className="w-5 h-5 ml-2 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </button>

                      <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                        <span className="text-7xl font-bold text-gray-900">
                          {String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-16 text-center">
              <div className="inline-flex flex-col sm:flex-row gap-4">
                <a
                  href="/contact"
                  className="bg-gradient-to-r from-hd-cerise to-hd-cerise/90 text-white px-10 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  Solicitar Cotización
                </a>
                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white border-2 border-green-500 text-green-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-green-500 hover:text-white hover:shadow-xl transition-all duration-300 inline-flex items-center justify-center gap-2"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Escríbenos por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Modal */}
      {selectedService && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedService(null)}
        >
          <div 
            className="bg-white rounded-3xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedService(null)}
              className="absolute top-6 right-6 p-3 bg-white rounded-full text-gray-600 hover:bg-gray-100 transition-colors z-50 shadow-lg"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="grid md:grid-cols-2 gap-0">
              <div className="relative bg-gray-100 min-h-[400px] md:min-h-[600px] rounded-tl-3xl md:rounded-bl-3xl overflow-hidden">
                {selectedService.image ? (
                  <img
                    src={`/api/service/media/${selectedService.image}`}
                    alt={selectedService.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/api/cover/thumbnail/null';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-hd-android via-hd-cerulean to-hd-cerise flex items-center justify-center">
                    <svg className="w-32 h-32 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              <div className="p-8 md:p-10 flex flex-col">
                <h3 
                  className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                  }}
                >
                  {selectedService.title}
                </h3>

                <p className="text-gray-700 text-lg leading-relaxed mb-8">
                  {selectedService.description}
                </p>

                {selectedService.characteristics && selectedService.characteristics.length > 0 && (
                  <div className="mb-8">
                    <h4 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                      <svg className="w-6 h-6 text-hd-android mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Características
                    </h4>
                    <ul className="space-y-3">
                      {selectedService.characteristics.map((char, idx) => (
                        <li key={idx} className="flex items-start text-gray-700 group">
                          <svg className="w-6 h-6 text-hd-android mr-3 flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-base leading-relaxed">{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <a
                    href="/contact"
                    onClick={() => setSelectedService(null)}
                    className="block text-center bg-gradient-to-r from-hd-cerise to-hd-cerise/90 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    Solicitar este servicio
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer generals={generals} socials={socials} />
      <WhatsAppButton socials={socials} generals={generals} />
    </div>
  );
};

CreateReactScript((el, properties) => {
  createRoot(el).render(<ServiciosPage {...properties} />);
});

export default ServiciosPage;
