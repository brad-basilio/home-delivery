import { createRoot } from 'react-dom/client';
import CreateReactScript from './Utils/CreateReactScript';
import { useState, useEffect, useRef } from 'react';
import '../css/homedelivery.css';
import Header from './components/HomeDelivery/Header';
import Footer from './components/HomeDelivery/Footer';
import WhatsAppButton from './components/HomeDelivery/WhatsAppButton';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Global from './Utils/Global';
import MessagesRest from './actions/MessagesRest';
import Swal from 'sweetalert2';

const ContactoPage = (props) => {
  const { offices = [], generals = [], socials = [] } = props;
  
  const mapRef = useRef(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 }); // Lima Centro por defecto
  const [mapZoom, setMapZoom] = useState(12);
  const [sending, setSending] = useState(false);
  const messagesRest = new MessagesRest();
  
  // Estados para los dropdowns personalizados
  const [showRubroDropdown, setShowRubroDropdown] = useState(false);
  const rubroDropdownRef = useRef(null);
  
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    celular: '',
    rubro: '',
    cantidad_envios: '',
    ubicacion: 'lima'
  });

  // Opciones para el dropdown de rubro
  const rubrosOptions = [
    { value: 'ecommerce', label: 'E-commerce', icon: '🛒' },
    { value: 'retail', label: 'Retail', icon: '🏪' },
    { value: 'alimentos', label: 'Alimentos y Bebidas', icon: '🍔' },
    { value: 'farmaceutico', label: 'Farmacéutico', icon: '💊' },
    { value: 'tecnologia', label: 'Tecnología', icon: '💻' },
    { value: 'moda', label: 'Moda y Textil', icon: '👔' },
    { value: 'otro', label: 'Otro', icon: '📦' }
  ];

  // Obtener oficina principal
  const oficinaPrincipal = offices?.find(o => o.type === 'oficina_principal');

  // Obtener datos de contacto desde generals
  const emailSoporte = generals?.find(g => g.correlative === 'email_contact')?.description || '';
  const telefonoSoporte = generals?.find(g => g.correlative === 'phone_contact')?.description || '';
  const whatsappNumber = generals?.find(g => g.correlative === 'whatsapp_phone')?.description || '';

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rubroDropdownRef.current && !rubroDropdownRef.current.contains(event.target)) {
        setShowRubroDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Configurar centro del mapa basado en oficina principal
  useEffect(() => {
    if (oficinaPrincipal?.latitude && oficinaPrincipal?.longitude) {
      setMapCenter({
        lat: parseFloat(oficinaPrincipal.latitude),
        lng: parseFloat(oficinaPrincipal.longitude)
      });
    }
  }, [oficinaPrincipal]);

  useEffect(() => {
    document.title = 'Contacto - Home Delivery Logistics';
    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.name = 'description';
      document.head.appendChild(metaDescription);
    }
    metaDescription.content = 'Contáctanos para solicitar una cotización. Soluciones logísticas personalizadas para tu negocio.';
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);

    // Construir el mensaje con todos los datos del formulario
    const descripcion = `
SOLICITUD DE COTIZACIÓN

Empresa: ${formData.empresa}
Rubro: ${formData.rubro}
Cantidad de envíos: ${formData.cantidad_envios}
Ubicación: ${formData.ubicacion === 'lima' ? 'Lima' : 'Provincia'}
    `.trim();

    const request = {
      name: formData.nombre,
      email: formData.correo,
      phone: formData.celular,
      subject: 'Solicitud de Cotización', // Asunto por defecto
      company: formData.empresa,
      business_sector: formData.rubro,
      daily_shipments: formData.cantidad_envios,
      location_type: formData.ubicacion === 'lima' ? 'Lima' : 'Provincia',
      description: descripcion,
      service_id: null, // Cotización general, no ligada a un servicio específico
    };

    try {
      const result = await messagesRest.save(request);
      setSending(false);

      if (result) {
        // Mostrar mensaje de éxito
        await Swal.fire({
          icon: 'success',
          title: '¡Solicitud Enviada!',
          text: 'Gracias por contactarnos. Nos pondremos en contacto contigo pronto.',
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#8FBD44',
        });

        // Limpiar formulario
        setFormData({
          nombre: '',
          empresa: '',
          correo: '',
          celular: '',
          rubro: '',
          cantidad_envios: '',
          ubicacion: 'lima'
        });
      }
    } catch (error) {
      setSending(false);
      console.error('Error enviando solicitud:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al enviar tu solicitud. Por favor, inténtalo de nuevo.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#DE3464',
      });
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRubroSelect = (value) => {
    setFormData({
      ...formData,
      rubro: value
    });
    setShowRubroDropdown(false);
  };

  const getSelectedRubroLabel = () => {
    const selected = rubrosOptions.find(opt => opt.value === formData.rubro);
    return selected ? `${selected.icon} ${selected.label}` : 'Selecciona tu rubro';
  };

  // Manejar click en marcador del mapa
  const handleMarkerClick = (office) => {
    setSelectedOffice(office);
    setMapCenter({
      lat: parseFloat(office.latitude),
      lng: parseFloat(office.longitude)
    });
    setMapZoom(15);
  };

  // Manejar click en card de oficina
  const handleOfficeCardClick = (office) => {
    setSelectedOffice(office);
    if (office.latitude && office.longitude) {
      setMapCenter({
        lat: parseFloat(office.latitude),
        lng: parseFloat(office.longitude)
      });
      setMapZoom(15);
      
      // Scroll al mapa
      const mapElement = document.getElementById('google-map-section');
      if (mapElement) {
        mapElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  };

  // Configuración del mapa
  const mapContainerStyle = {
    width: '100%',
    height: '500px',
    borderRadius: '0.75rem'
  };

  const mapOptions = {
    disableDefaultUI: false,
    zoomControl: true,
    mapTypeControl: false,
    scaleControl: true,
    streetViewControl: true,
    rotateControl: false,
    fullscreenControl: true
  };

  return (
    <div className="min-h-screen bg-white font-aeonik" style={{ fontFamily: 'Aeonik, sans-serif' }}>
      <Header />

      <main className="min-h-screen bg-white">
        {/* Hero Section */}
        <section className="relative pt-24 md:pt-32 pb-12 md:pb-16 overflow-hidden bg-gradient-to-b from-gray-50 to-white">
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-hd-android rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-hd-cerise rounded-full blur-3xl" />
          </div>

          <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
            <div className="text-center ">
              <div 
                className="inline-block px-6 py-2 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
                }}
              >
                <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Contáctanos</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                Solicita tu{' '}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                  }}
                >
                  Cotización
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Estamos aquí para ayudarte a impulsar tu negocio con soluciones logísticas a medida
              </p>
            </div>
          </div>
        </section>

        {/* Formulario y Datos de Contacto */}
        <section className="py-12 md:pb-20 bg-white">
          <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
            <div className="grid md:grid-cols-5 gap-8 md:gap-12">
              {/* Columna Izquierda - Datos de Contacto */}
              <div className="md:col-span-2 space-y-6">
                {/* Card - Dirección Principal */}
                {oficinaPrincipal && (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-hd-android to-hd-android/80 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Oficina Principal</h3>
                        <p className="text-gray-600 leading-relaxed">{oficinaPrincipal.address}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card - Email de Soporte */}
                {emailSoporte && (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-hd-cerulean to-hd-cerulean/80 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Email de Soporte</h3>
                        <a href={`mailto:${emailSoporte}`} className="text-hd-cerulean hover:text-hd-android transition-colors duration-300 font-medium">
                          {emailSoporte}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Card - Teléfono de Soporte */}
                {telefonoSoporte && (
                  <div className="bg-gradient-to-br from-gray-50 to-white p-6 md:p-8 rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300">
                    <div className="flex items-start gap-4">
                      <div className="bg-gradient-to-br from-hd-cerise to-hd-cerise/80 p-3 rounded-xl">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Teléfono de Soporte</h3>
                        <a href={`tel:${telefonoSoporte}`} className="text-hd-cerise hover:text-hd-android transition-colors duration-300 font-medium text-xl">
                          {telefonoSoporte}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Columna Derecha - Formulario */}
              <div className="md:col-span-3">
                <div className="relative bg-gradient-to-br from-white via-gray-50 to-white p-8 md:p-12 rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
                  {/* Decoración de fondo */}
                  <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-hd-android/5 to-transparent rounded-full blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-hd-cerulean/5 to-transparent rounded-full blur-3xl" />
                  
                  <div className="relative z-10">
                    <div className="text-center mb-10">
                      <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Solicita tu{' '}
                        <span 
                          className="bg-clip-text text-transparent"
                          style={{
                            backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                          }}
                        >
                          Cotización
                        </span>
                      </h2>
                      <p className="text-gray-600">Completa el formulario y nos pondremos en contacto contigo</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Nombre Completo <span className="text-hd-cerise">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-hd-android transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="nombre"
                              value={formData.nombre}
                              onChange={handleChange}
                              required
                              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-hd-android/20 focus:border-hd-android transition-all duration-300 text-gray-900 placeholder-gray-400"
                              placeholder="Juan Pérez"
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Empresa <span className="text-hd-cerise">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-hd-android transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              name="empresa"
                              value={formData.empresa}
                              onChange={handleChange}
                              required
                              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-hd-android/20 focus:border-hd-android transition-all duration-300 text-gray-900 placeholder-gray-400"
                              placeholder="Mi Empresa SAC"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="group">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Correo Electrónico <span className="text-hd-cerise">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-hd-android transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <input
                              type="email"
                              name="correo"
                              value={formData.correo}
                              onChange={handleChange}
                              required
                              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-hd-android/20 focus:border-hd-android transition-all duration-300 text-gray-900 placeholder-gray-400"
                              placeholder="juan@empresa.com"
                            />
                          </div>
                        </div>

                        <div className="group">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Celular <span className="text-hd-cerise">*</span>
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-hd-android transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                            </div>
                            <input
                              type="tel"
                              name="celular"
                              value={formData.celular}
                              onChange={handleChange}
                              required
                              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-hd-android/20 focus:border-hd-android transition-all duration-300 text-gray-900 placeholder-gray-400"
                              placeholder="999 999 999"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Dropdown Personalizado para Rubro */}
                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Rubro <span className="text-hd-cerise">*</span>
                        </label>
                        <div className="relative" ref={rubroDropdownRef}>
                          <button
                            type="button"
                            onClick={() => setShowRubroDropdown(!showRubroDropdown)}
                            className={`w-full pl-12 pr-4 py-4 bg-white border-2 rounded-2xl transition-all duration-300 text-left flex items-center justify-between ${
                              showRubroDropdown 
                                ? 'border-hd-android ring-4 ring-hd-android/20' 
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <svg className="w-5 h-5 text-gray-400 group-focus-within:text-hd-android transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                              </svg>
                            </div>
                            <span className={formData.rubro ? 'text-gray-900' : 'text-gray-400'}>
                              {getSelectedRubroLabel()}
                            </span>
                            <svg 
                              className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${showRubroDropdown ? 'rotate-180' : ''}`} 
                              fill="none" 
                              stroke="currentColor" 
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                          
                          {/* Dropdown Menu */}
                          {showRubroDropdown && (
                            <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                              <div className="max-h-80 overflow-y-auto">
                                {rubrosOptions.map((option) => (
                                  <button
                                    key={option.value}
                                    type="button"
                                    onClick={() => handleRubroSelect(option.value)}
                                    className={`w-full px-6 py-4 text-left flex items-center gap-3 transition-all duration-200 ${
                                      formData.rubro === option.value
                                        ? 'bg-gradient-to-r from-hd-android/10 to-hd-android/5 text-hd-android font-bold border-l-4 border-hd-android'
                                        : 'hover:bg-gray-50 text-gray-700'
                                    }`}
                                  >
                                    <span className="text-2xl">{option.icon}</span>
                                    <span>{option.label}</span>
                                    {formData.rubro === option.value && (
                                      <svg className="w-5 h-5 ml-auto text-hd-android" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="group">
                        <label className="block text-sm font-bold text-gray-700 mb-3">
                          Cantidad de envíos (diarios o mensuales) <span className="text-hd-cerise">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg className="w-5 h-5 text-gray-400 group-focus-within:text-hd-android transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                          </div>
                          <input
                            type="text"
                            name="cantidad_envios"
                            value={formData.cantidad_envios}
                            onChange={handleChange}
                            required
                            className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-hd-android/20 focus:border-hd-android transition-all duration-300 text-gray-900 placeholder-gray-400"
                            placeholder="Ej: 50 diarios o 1000 mensuales"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-700 mb-4">
                          Ubicación <span className="text-hd-cerise">*</span>
                        </label>
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => handleChange({ target: { name: 'ubicacion', value: 'lima' } })}
                            className={`relative px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                              formData.ubicacion === 'lima'
                                ? 'border-hd-android bg-gradient-to-br from-hd-android/10 to-hd-android/5 text-hd-android shadow-lg scale-105'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            {formData.ubicacion === 'lima' && (
                              <div className="absolute top-2 right-2">
                                <svg className="w-5 h-5 text-hd-android" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <div className="flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                              </svg>
                              Lima
                            </div>
                          </button>

                          <button
                            type="button"
                            onClick={() => handleChange({ target: { name: 'ubicacion', value: 'provincia' } })}
                            className={`relative px-6 py-4 rounded-2xl border-2 font-bold transition-all duration-300 ${
                              formData.ubicacion === 'provincia'
                                ? 'border-hd-android bg-gradient-to-br from-hd-android/10 to-hd-android/5 text-hd-android shadow-lg scale-105'
                                : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:shadow-md'
                            }`}
                          >
                            {formData.ubicacion === 'provincia' && (
                              <div className="absolute top-2 right-2">
                                <svg className="w-5 h-5 text-hd-android" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                              </div>
                            )}
                            <div className="flex items-center justify-center gap-2">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              Provincia
                            </div>
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={sending}
                        className="w-full relative group overflow-hidden bg-gradient-to-r from-hd-cerise via-hd-cerise to-hd-android text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-hd-android via-hd-cerulean to-hd-cerise opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <span className="relative z-10 flex items-center justify-center gap-3">
                          {sending ? (
                            <>
                              <svg className="animate-spin h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Enviando solicitud...
                            </>
                          ) : (
                            <>
                              <svg className="w-6 h-6 rotate-90 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                              </svg>
                              Enviar Solicitud
                            </>
                          )}
                        </span>
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sección de Ubicaciones con Mapa */}
        <section className="py-12 md:py-20 bg-gray-50">
          <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Nuestras Ubicaciones
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Encuentra nuestras oficinas y almacenes más cercanos
              </p>
            </div>

            {/* Lista de Oficinas */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {offices.map((office) => (
                <div
                  key={office.id}
                  onClick={() => handleOfficeCardClick(office)}
                  className={`bg-white p-6 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                    selectedOffice?.id === office.id
                      ? 'border-hd-android shadow-lg'
                      : 'border-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${
                      office.type === 'oficina_principal'
                        ? 'bg-hd-android/10 text-hd-android'
                        : office.type === 'oficina'
                        ? 'bg-hd-cerulean/10 text-hd-cerulean'
                        : 'bg-hd-cerise/10 text-hd-cerise'
                    }`}>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <span className={`text-xs font-semibold uppercase tracking-wider ${
                        office.type === 'oficina_principal'
                          ? 'text-hd-android'
                          : office.type === 'oficina'
                          ? 'text-hd-cerulean'
                          : 'text-hd-cerise'
                      }`}>
                        {office.type === 'oficina_principal' ? 'Principal' : office.type === 'oficina' ? 'Oficina' : 'Almacén'}
                      </span>
                      <h3 className="font-bold text-gray-900 mt-1">{office.name}</h3>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{office.address}</p>
                  {office.phone && (
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {office.phone}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {/* Mapa de Google Maps */}
            <div id="google-map-section" className="bg-white p-4 rounded-2xl border border-gray-200 shadow-lg">
              <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY || ''}>
                <GoogleMap
                  ref={mapRef}
                  mapContainerStyle={mapContainerStyle}
                  center={mapCenter}
                  zoom={mapZoom}
                  options={mapOptions}
                >
                  {offices.map((office) => {
                    if (!office.latitude || !office.longitude) return null;
                    
                    return (
                      <Marker
                        key={office.id}
                        position={{
                          lat: parseFloat(office.latitude),
                          lng: parseFloat(office.longitude)
                        }}
                        title={office.name}
                        onClick={() => handleMarkerClick(office)}
                        icon={{
                          path: window.google?.maps?.SymbolPath?.CIRCLE || 0,
                          fillColor: office.type === 'oficina_principal' 
                            ? '#8FBD44' // hd-android
                            : office.type === 'oficina'
                            ? '#2354B8' // hd-cerulean
                            : '#DE3464', // hd-cerise
                          fillOpacity: 1,
                          strokeColor: '#FFFFFF',
                          strokeWeight: 3,
                          scale: office.id === selectedOffice?.id ? 12 : 8,
                        }}
                      />
                    );
                  })}
                </GoogleMap>
              </LoadScript>
              
              {/* Info de oficina seleccionada */}
              {selectedOffice && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      selectedOffice.type === 'oficina_principal'
                        ? 'bg-hd-android/10 text-hd-android'
                        : selectedOffice.type === 'oficina'
                        ? 'bg-hd-cerulean/10 text-hd-cerulean'
                        : 'bg-hd-cerise/10 text-hd-cerise'
                    }`}>
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-semibold uppercase tracking-wider px-2 py-1 rounded ${
                          selectedOffice.type === 'oficina_principal'
                            ? 'bg-hd-android/20 text-hd-android'
                            : selectedOffice.type === 'oficina'
                            ? 'bg-hd-cerulean/20 text-hd-cerulean'
                            : 'bg-hd-cerise/20 text-hd-cerise'
                        }`}>
                          {selectedOffice.type === 'oficina_principal' ? 'Oficina Principal' : selectedOffice.type === 'oficina' ? 'Oficina' : 'Almacén'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{selectedOffice.name}</h3>
                      <p className="text-gray-600 mb-2">
                        <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                        </svg>
                        {selectedOffice.address}
                      </p>
                      {selectedOffice.phone && (
                        <p className="text-gray-600 mb-2">
                          <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          {selectedOffice.phone}
                        </p>
                      )}
                      {selectedOffice.email && (
                        <p className="text-gray-600 mb-2">
                          <svg className="w-4 h-4 inline mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                          </svg>
                          {selectedOffice.email}
                        </p>
                      )}
                      {selectedOffice.description && (
                        <p className="text-gray-500 text-sm mt-3">{selectedOffice.description}</p>
                      )}
                      {selectedOffice.manager && (
                        <p className="text-gray-600 text-sm mt-2">
                          <span className="font-semibold">Encargado:</span> {selectedOffice.manager}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer generals={generals} socials={socials} />
      <WhatsAppButton socials={socials} generals={generals} />
    </div>
  );
};

CreateReactScript((el, properties) => {
  const root = createRoot(el);
  root.render(<ContactoPage {...properties} />);
});

export default ContactoPage;
