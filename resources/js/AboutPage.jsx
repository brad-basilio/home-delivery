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
                e.target.src = '/assets/img/about/bg-about.png';
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
          className="w-full py-12 md:py-16 bg-gray-50"
        >
          <div className="px-4 md:px-8 2xl:px-0 2xl:max-w-7xl mx-auto">
            <motion.h2 
              variants={fadeInUp}
              className="text-2xl md:text-[40px] font-bold text-hd-onyx-dark text-center md:text-left"
            >
              {sectionTwo?.title || 'Nuestras Fortalezas'}
            </motion.h2>
            <motion.div 
              variants={fadeInUp}
              className="mt-8 md:mt-12 grid sm:grid-cols-1 md:grid-cols-2 gap-6 md:gap-8"
            >
            {strengths?.map(
              (item, index) =>
                item.visible &&
                item.status && (
                  <FeatureCard
                    key={item.id}
                    icon={item.image}
                    title={item.name}
                    description={item.description}
                    delay={index * 0.2}
                  />
                )
            )}
          </motion.div>
          </div>
        </motion.section>

        {/* Trust Section */}
        {sectionThree && sectionThree.visible && (
          <motion.section 
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="px-4 py-12 md:py-16 md:px-6 lg:px-8"
          >
            <div className="max-w-7xl mx-auto">
              <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <img
                  src={sectionThree.image ? `/api/aboutus/media/${sectionThree.image}` : '/api/cover/thumbnail/null'}
                  onError={(e) => {
                    e.target.src = '/api/cover/thumbnail/null';
                  }}
                  alt={sectionThree.title}
                  className="w-full h-[300px] md:h-auto object-cover rounded-2xl"
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
            className="px-4 py-12 md:py-16 md:px-6 lg:px-8 bg-gray-50"
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
                  className="w-full h-[300px] md:h-auto object-cover rounded-2xl order-1 md:order-2"
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

/**
 * FeatureCard - Componente para mostrar cada fortaleza
 */
function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      viewport={{ once: true }}
      className="bg-white rounded-xl p-6 md:p-8 shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 group hover:-translate-y-1"
    >
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className="bg-gradient-to-br from-hd-green/10 to-hd-blue/10 w-14 h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center mb-4 md:mb-6 group-hover:scale-110 transition-transform duration-300"
      >
        <img
          src={icon ? `/api/strength/media/${icon}` : '/api/cover/thumbnail/null'}
          onError={(e) => {
            e.target.src = '/api/cover/thumbnail/null';
          }}
          alt={title}
          className="w-7 h-7 md:w-8 md:h-8 object-contain"
        />
      </motion.div>
      <h3 className="text-xl font-bold text-hd-onyx mb-2 group-hover:text-hd-green transition-colors duration-300">
        {title}
      </h3>
      <p className="text-hd-gray leading-relaxed text-sm md:text-base">
        {description}
      </p>
    </motion.div>
  );
}

// Registrar el script React
CreateReactScript((el, properties) => {
  const root = createRoot(el);
  root.render(<AboutPage {...properties} />);
});

export default AboutPage;
