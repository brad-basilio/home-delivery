import React, { useEffect, useState } from 'react';
import ReactModal from 'react-modal';
import { X, CheckCircle } from 'lucide-react';
import HtmlContent from '../../Utils/HtmlContent';
import GeneralRest from '../../actions/GeneralRest';
import SubscriptionsRest from '../../actions/SubscriptionsRest';
import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
  FaTiktok,
  FaWhatsapp,
  FaTelegram,
  FaDiscord,
  FaSnapchat,
  FaPinterest,
  FaReddit
} from 'react-icons/fa';

ReactModal.setAppElement('#app');

// Mapeo de iconos de redes sociales
const getSocialIcon = (social) => {
  const name = (social.description || social.name || '').toLowerCase();
  const icon = (social.icon || '').toLowerCase();
  
  if (name.includes('facebook') || icon.includes('facebook')) return FaFacebook;
  if (name.includes('instagram') || icon.includes('instagram')) return FaInstagram;
  if (name.includes('twitter') || name.includes('x') || icon.includes('twitter')) return FaTwitter;
  if (name.includes('linkedin') || icon.includes('linkedin')) return FaLinkedin;
  if (name.includes('youtube') || icon.includes('youtube')) return FaYoutube;
  if (name.includes('tiktok') || icon.includes('tiktok')) return FaTiktok;
  if (name.includes('whatsapp') || icon.includes('whatsapp')) return FaWhatsapp;
  if (name.includes('telegram') || icon.includes('telegram')) return FaTelegram;
  if (name.includes('discord') || icon.includes('discord')) return FaDiscord;
  if (name.includes('snapchat') || icon.includes('snapchat')) return FaSnapchat;
  if (name.includes('pinterest') || icon.includes('pinterest')) return FaPinterest;
  if (name.includes('reddit') || icon.includes('reddit')) return FaReddit;
  
  return null;
};

const Footer = ({ generals = [], socials = [] }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSubscribeOpen, setModalSubscribeOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);
  const [aboutuses, setAboutuses] = useState(null);
  const generalRest = new GeneralRest();
  const subscriptionsRest = new SubscriptionsRest();

  const openModal = (index) => setModalOpen(index);
  const closeModal = () => setModalOpen(false);

  useEffect(() => {
    const fetchAboutuses = async () => {
      try {
        const data = await generalRest.getAboutuses();
        setAboutuses(data);
      } catch (error) {
        console.error('Error fetching about:', error);
      }
    };
    fetchAboutuses();
  }, []);

  const generalsData = aboutuses?.generals || [];

  const getGeneralValue = (key) => {
    const item = generals.find(g => g.key === key);
    return item?.value || '';
  };

  const whatsappPhone = getGeneralValue('whatsapp_phone');
  const contactEmail = getGeneralValue('email');
  const address = getGeneralValue('address');

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      const request = {
        email: email,
      };
      
      const result = await subscriptionsRest.save(request);
      
      if (result) {
        setModalSubscribeOpen(true);
        setEmail('');
      }
    } catch (error) {
      console.error('Error al suscribirse:', error);
    } finally {
      setSaving(false);
    }
  };

  const policyItems = {
    privacy_policy: 'Políticas de privacidad',
    terms_conditions: 'Términos y Condiciones',
    exchange_policy: 'Políticas de cambio',
  };

  // Filtrar solo redes sociales visibles
  const visibleSocials = socials.filter(s => s.visible === 1 || s.visible === true);

  return (
    <>
      <footer className="relative bg-[#224483] text-white overflow-hidden">
        {/* Decorative gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent pointer-events-none"></div>

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 2xl:px-0 2xl:max-w-7xl pt-16 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Logo y descripción */}
            <div className="lg:col-span-3">
              <div className="mb-6">
                <img 
                  src="/assets/img/logo-white.png" 
                  alt="Home Delivery" 
                  className="h-12 w-auto grayscale invert brightness-0"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'block';
                  }}
                />
                <img 
                  src="/assets/img/logo.png" 
                  alt="Home Delivery" 
                  className="h-12 w-auto filter invert brightness-0"
                  style={{display: 'none'}}
                />
              </div>
              <p className="text-white/80 text-sm leading-relaxed mb-6">
                Soluciones integrales de entrega a domicilio para tu negocio. 
                Optimiza tus envíos con tecnología de vanguardia.
              </p>

              {/* Información de contacto */}
              <div className="space-y-3 text-sm">
                {whatsappPhone && (
                  <div className="flex items-start gap-2">
                    <FaWhatsapp className="w-5 h-5 text-hd-android mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-white/60 text-xs mb-1">WhatsApp</p>
                      <a 
                        href={`https://wa.me/${whatsappPhone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-white hover:text-hd-android transition-colors font-medium"
                      >
                        {whatsappPhone}
                      </a>
                    </div>
                  </div>
                )}
                {contactEmail && (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-hd-android mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Email</p>
                      <a 
                        href={`mailto:${contactEmail}`}
                        className="text-white hover:text-hd-android transition-colors font-medium break-all"
                      >
                        {contactEmail}
                      </a>
                    </div>
                  </div>
                )}
                {address && (
                  <div className="flex items-start gap-2">
                    <svg className="w-5 h-5 text-hd-android mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <p className="text-white/60 text-xs mb-1">Dirección</p>
                      <p className="text-white text-sm">{address}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Horario de atención */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold mb-6 text-white">
                Horario de Atención
              </h3>
              <div className="space-y-4 text-sm">
                {(() => {
                  const openingHours = generals?.find(g => g.correlative === 'opening_hours')?.description;
                  if (!openingHours) {
                    return (
                      <div>
                        <p className="font-semibold text-white mb-1">Lunes a viernes:</p>
                        <p className="text-white/80">8:00 am a 8:00 pm</p>
                      </div>
                    );
                  }
                  
                  return openingHours.split('\n').map((horario, index) => {
                    // Separar el día del horario
                    const parts = horario.split(':');
                    if (parts.length >= 2) {
                      const dia = parts[0].trim();
                      const hora = parts.slice(1).join(':').trim();
                      return (
                        <div key={index}>
                          <p className="font-semibold text-white mb-1">{dia}:</p>
                          <p className="text-white/80">{hora}</p>
                        </div>
                      );
                    }
                    return (
                      <div key={index}>
                        <p className="text-white/80">{horario}</p>
                      </div>
                    );
                  });
                })()}
              </div>
            </div>

            {/* Políticas */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold mb-6 text-white">
                Políticas
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a 
                    onClick={() => openModal(0)} 
                    className="text-white/80 hover:text-hd-android transition-colors cursor-pointer flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-hd-android transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    Políticas de privacidad
                  </a>
                </li>
                <li>
                  <a 
                    onClick={() => openModal(1)} 
                    className="text-white/80 hover:text-hd-android transition-colors cursor-pointer flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-hd-android transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    Términos y Condiciones
                  </a>
                </li>
                <li>
                  <a 
                    onClick={() => openModal(2)} 
                    className="text-white/80 hover:text-hd-android transition-colors cursor-pointer flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-hd-android transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    Políticas de cambio
                  </a>
                </li>
                <li>
                  <a 
                    href="/libro-de-reclamaciones" 
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/80 hover:text-hd-android transition-colors flex items-center group"
                  >
                    <span className="w-0 group-hover:w-2 h-0.5 bg-hd-android transition-all duration-300 mr-0 group-hover:mr-2"></span>
                    Libro de reclamaciones
                  </a>
                </li>
              </ul>
            </div>

            {/* Suscripción y Redes Sociales */}
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold mb-6 text-white">
                Suscríbete
              </h3>
              
              {/* Formulario de suscripción mejorado */}
              <div className="mb-8">
                <p className="text-white/90 text-sm mb-4 leading-relaxed">
                  Mantente actualizado con nuestras últimas noticias, consejos logísticos y ofertas especiales.
                </p>
                <form onSubmit={handleSubscribe} className="relative">
                  <div className="relative">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tu@email.com"
                      required
                      disabled={saving}
                      className="w-full pl-4 pr-28 py-3.5 rounded-full bg-white/95 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-hd-android focus:bg-white text-sm font-medium shadow-lg transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    />
                    <button
                      type="submit"
                      disabled={saving}
                      className="absolute right-1.5 top-1/2 -translate-y-1/2 px-5 py-2.5 bg-gradient-to-r from-hd-android to-hd-android/90 hover:from-hd-android/90 hover:to-hd-android text-white rounded-full font-semibold text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
                    >
                      {saving ? 'Enviando...' : 'Enviar'}
                    </button>
                  </div>
               
                </form>
              </div>

           
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 mt-4 pt-4">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-white/80">
                &copy; {new Date().getFullYear()} <span className="text-white font-medium">Home Delivery</span>. Todos los derechos reservados.
              </p>
                 {/* Redes sociales mejoradas */}
              {visibleSocials && visibleSocials.length > 0 && (
                <div>
                  <div className="flex flex-wrap gap-3">
                    {visibleSocials.map((social) => {
                      const IconComponent = getSocialIcon(social);
                      if (!IconComponent) return null;
                      
                      return (
                        <a
                          key={social.id}
                          href={social.link || social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative flex items-center justify-center w-11 h-11 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 shadow-lg hover:shadow-xl"
                          aria-label={social.description || social.name}
                          title={social.description || social.name}
                        >
                          <IconComponent className="w-5 h-5 text-white group-hover:text-hd-android transition-colors duration-300" />
                          
                          {/* Efecto de brillo en hover */}
                          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-hd-android/0 via-hd-android/0 to-hd-android/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>

      {/* Modales de Políticas */}
      {Object.keys(policyItems).map((key, index) => {
        const title = policyItems[key];
        const content = generalsData.find((x) => x.correlative === key)?.description ?? '';
        return (
          <ReactModal
            key={index}
            isOpen={modalOpen === index}
            onRequestClose={closeModal}
            contentLabel={title}
            className="modal-content-hidden"
            overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            shouldCloseOnOverlayClick={true}
          >
            <div 
              className="bg-white lg:min-w-[600px] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header FIJO con título y botón cerrar */}
              <div 
                className="sticky top-0 z-10 px-8 py-6 border-b border-gray-100 flex items-center justify-between"
                style={{
                  background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.05) 0%, rgba(35, 84, 184, 0.05) 50%, rgba(222, 52, 100, 0.05) 100%)'
                }}
              >
                <h2 
                  className="text-2xl md:text-3xl font-bold bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                  }}
                >
                  {title}
                </h2>
                
                {/* Botón cerrar */}
                <button
                  onClick={closeModal}
                  className="p-2 rounded-full text-gray-600 hover:bg-gray-100 hover:text-gray-800 transition-all duration-300 hover:scale-110"
                  aria-label="Cerrar"
                >
                  <X className="w-6 h-6" strokeWidth={2.5} />
                </button>
              </div>

              {/* Contenido con scroll */}
              <div className="px-8 py-6 overflow-y-auto max-h-[calc(90vh-100px)]">
                <HtmlContent 
                  className="prose prose-lg max-w-none
                    prose-headings:bg-clip-text prose-headings:text-transparent prose-headings:font-bold
                    prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
                    prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
                    prose-a:text-hd-cerulean prose-a:no-underline hover:prose-a:text-hd-android prose-a:transition-colors
                    prose-strong:text-gray-900 prose-strong:font-bold
                    prose-ul:list-disc prose-ul:ml-6 prose-ul:space-y-2
                    prose-ol:list-decimal prose-ol:ml-6 prose-ol:space-y-2
                    prose-li:text-gray-700
                    prose-blockquote:border-l-4 prose-blockquote:border-hd-android prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-600
                  "
                  html={content}
                  style={{
                    '--tw-prose-headings': 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)',
                  }}
                />

                {/* Botón de cerrar inferior */}
                <div className="mt-8 pt-6 border-t border-gray-200 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="px-8 py-3 bg-gradient-to-r from-hd-cerise to-hd-cerise/90 text-white rounded-full font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </ReactModal>
        );
      })}

      {/* Modal de Suscripción Exitosa */}
      <ReactModal
        isOpen={modalSubscribeOpen}
        onRequestClose={() => setModalSubscribeOpen(false)}
        contentLabel="Suscripción Exitosa"
        className="modal-content-hidden"
        overlayClassName="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        shouldCloseOnOverlayClick={true}
      >
        <div 
          className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header con gradiente */}
          <div 
            className="px-8 py-6 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
            }}
          >
            {/* Icono de éxito */}
            <div className="flex justify-center mb-4">
              <div className="p-3 rounded-full bg-green-100">
                <CheckCircle className="w-16 h-16 text-green-600" strokeWidth={2.5} />
              </div>
            </div>

            <h2 
              className="text-3xl font-bold bg-clip-text text-transparent mb-3"
              style={{
                backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
              }}
            >
              ¡Gracias por suscribirte!
            </h2>
            
            <p className="text-gray-600 text-lg leading-relaxed">
              Recibirás nuestras últimas novedades y ofertas exclusivas en tu correo electrónico.
            </p>
          </div>

          {/* Botón de cerrar */}
          <div className="px-8 pb-8 pt-4 flex justify-center">
            <button
              onClick={() => setModalSubscribeOpen(false)}
              className="px-10 py-3 bg-gradient-to-r from-hd-android to-hd-android/90 text-white rounded-full font-bold text-base hover:shadow-xl hover:scale-105 transition-all duration-300"
            >
              Entendido
            </button>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default Footer;
