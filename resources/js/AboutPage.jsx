import { createRoot } from 'react-dom/client';
import CreateReactScript from './Utils/CreateReactScript';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

// Importar estilos personalizados de Home Delivery
import '../css/homedelivery.css';

// Importar componentes de Home Delivery
import Header from './components/HomeDelivery/Header';
import Footer from './components/HomeDelivery/Footer';
import WhatsAppButton from './components/HomeDelivery/WhatsAppButton';

// Animaciones compartidas
const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

/**
 * AboutPage - Página de Nosotros de Home Delivery Logistics
 */
const AboutPage = (props) => {
  const { aboutuses = [], strengths = [], generals = [], socials = [] } = props;

  // Buscar las secciones de aboutuses
  const sectionOne = aboutuses?.find((item) => item.correlative === 'section-1-about');
  const sectionTwo = aboutuses?.find((item) => item.correlative === 'section-2-about');
  const sectionThree = aboutuses?.find((item) => item.correlative === 'section-3-about');
  const sectionFour = aboutuses?.find((item) => item.correlative === 'section-4-about');

  useEffect(() => {
    document.title = 'Nosotros - Home Delivery Logistics';
    
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Conoce más sobre Home Delivery Logistics, nuestra misión, visión y valores que nos hacen líderes en soluciones logísticas.';
  }, []);

  return (
    <div className="min-h-screen bg-white font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
      {/* Header */}
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="px-4 md:px-8 2xl:px-0 2xl:max-w-7xl mx-auto py-8 md:py-16 pt-24 md:pt-32"
        >
          <motion.div variants={fadeInUp} className="text-center">
            <span className="text-hd-android font-bold inline-block text-lg">
              {sectionOne?.name || 'Sobre Nosotros'}
            </span>
            <h1 className="mt-4 text-3xl md:text-5xl lg:text-6xl font-bold max-w-3xl mx-auto text-hd-onyx leading-tight">
              {sectionOne?.title || 'Innovación en Logística'}
            </h1>
            <div
              className="mt-6 text-gray-600 max-w-3xl mx-auto text-base md:text-lg prose prose-lg"
              dangerouslySetInnerHTML={{
                __html: sectionOne?.description || 'Conectando negocios con sus clientes a través de soluciones inteligentes de entrega',
              }}
            />
          </motion.div>
          <motion.div 
            variants={fadeInUp}
            className="mt-8 md:mt-12 max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-lg"
          >
            <img
              src={sectionOne?.image ? `/api/aboutus/media/${sectionOne.image}` : '/assets/img/about/bg-about.png'}
              onError={(e) => {
               e.target.src = '/api/cover/thumbnail/null';
              }}
              alt={sectionOne?.title || 'Home Delivery'}
              className="w-full h-[300px] md:h-[400px] object-cover"
            />
          </motion.div>
        </motion.section>

        {/* Why Trust Us Section - Strengths */}
        <motion.section 
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-white"
        >
          {/* Decoración de fondo */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute top-10 right-10 w-72 h-72 bg-hd-android rounded-full blur-3xl" />
            <div className="absolute bottom-10 left-10 w-72 h-72 bg-hd-cerise rounded-full blur-3xl" />
          </div>

          <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
            {/* Título */}
            <motion.div variants={fadeInUp} className="text-center mb-12 md:mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                {sectionTwo?.title || (
                  <>
                    Nuestras{' '}
                    <span 
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                      }}
                    >
                      Fortalezas
                    </span>
                  </>
                )}
              </h2>
              {sectionTwo?.description && (
                <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  {sectionTwo.description}
                </p>
              )}
            </motion.div>

            {/* Grid de fortalezas */}
            <div 
              className="grid gap-6 md:gap-8"
              style={{
                gridTemplateColumns: `repeat(auto-fit, minmax(280px, 1fr))`,
              }}
            >
              {strengths?.map((item, index) => {
                if (!item.visible || !item.status) return null;

                const colors = [
                  { bg: 'bg-hd-android', text: 'text-white', icon: 'brightness-0 invert' },
                  { bg: 'bg-hd-cerise', text: 'text-white', icon: 'brightness-0 invert' },
                  { bg: 'bg-hd-cerulean', text: 'text-white', icon: 'brightness-0 invert' },
                  { bg: 'bg-hd-spanish', text: 'text-white', icon: 'brightness-0 invert' }
                ];
                const colorScheme = colors[index % colors.length];

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className={`group relative ${colorScheme.bg} rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-default`}
                  >
                    {/* Efecto de brillo en hover */}
                    <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                    
                    <div className="relative flex flex-col items-center text-center space-y-4">
                      {/* Ícono */}
                      <div className="relative">
                        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-500" />
                        <div className="relative bg-white/20 backdrop-blur-sm p-5 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-all duration-500 group-hover:rotate-12">
                          <img
                            src={item.image ? `/api/strength/media/${item.image}` : '/api/cover/thumbnail/null'}
                            onError={(e) => {
                              e.target.src = '/api/cover/thumbnail/null';
                            }}
                            alt={item.name}
                            className={`w-12 h-12 md:w-14 md:h-14 object-contain filter ${colorScheme.icon} transition-transform duration-500 group-hover:scale-110`}
                          />
                        </div>
                      </div>

                      {/* Título */}
                      <div className={`text-2xl md:text-3xl font-bold ${colorScheme.text} leading-tight`}>
                        {item.name}
                      </div>

                      {/* Descripción */}
                      {item.description && (
                        <div className={`text-sm md:text-base ${colorScheme.text} opacity-95 leading-relaxed`}>
                          {item.description}
                        </div>
                      )}

                      {/* Línea decorativa */}
                      <div className="w-16 h-1 bg-white/40 rounded-full group-hover:w-24 transition-all duration-500" />
                    </div>

                    {/* Efecto de esquina */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Trust Section */}
        {sectionThree && sectionThree.visible && (
          <motion.section 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className=" py-12 md:py-16 px-[5%] 2xl:max-w-7xl"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <img
                  src={sectionThree.image ? `/api/aboutus/media/${sectionThree.image}` : '/api/cover/thumbnail/null'}
                  onError={(e) => {
                    e.target.src = '/api/cover/thumbnail/null';
                  }}
                  alt={sectionThree.title}
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl"
                />
                <div className="space-y-4 md:space-y-6">
                  <h2 className="text-2xl md:text-4xl font-bold text-hd-onyx-dark">
                    {sectionThree.title}
                  </h2>
                  <div
                    className="text-hd-onyx text-base md:text-lg prose prose-lg"
                    dangerouslySetInnerHTML={{
                      __html: sectionThree.description,
                    }}
                  />
                </div>
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Future Section */}
        {sectionFour && sectionFour.visible && (
          <motion.section 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="px-[5%] py-12 md:py-16  2xl:px-0 bg-gray-50"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="space-y-4 md:space-y-6 order-2 md:order-1">
                  <h2 className="text-2xl md:text-4xl font-bold text-hd-onyx-dark">
                    {sectionFour.title}
                  </h2>
                  <div
                    className="text-hd-onyx text-base md:text-lg prose prose-lg"
                    dangerouslySetInnerHTML={{
                      __html: sectionFour.description,
                    }}
                  />
                </div>
                <img
                  src={sectionFour.image ? `/api/aboutus/media/${sectionFour.image}` : '/api/cover/thumbnail/null'}
                  onError={(e) => {
                    e.target.src = '/api/cover/thumbnail/null';
                  }}
                  alt={sectionFour.title}
                  className="w-full h-[300px] md:h-[400px] object-cover rounded-2xl order-1 md:order-2"
                />
              </motion.div>
            </div>
          </motion.section>
        )}
      </main>

      {/* Footer */}
      <Footer generals={generals} socials={socials} />

      {/* Botón flotante de WhatsApp */}
      <WhatsAppButton socials={socials} generals={generals} />
    </div>
  );
};

// Registrar el script React
CreateReactScript((el, properties) => {
  const root = createRoot(el);
  root.render(<AboutPage {...properties} />);
});

export default AboutPage;
