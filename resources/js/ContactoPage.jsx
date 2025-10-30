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
  
  // Estados para la sección de ubicaciones
  const [searchOffice, setSearchOffice] = useState('');
  const [showOfficesList, setShowOfficesList] = useState(true); // Abierto por defecto
  const officesListRef = useRef(null);

  // Auto-abrir lista cuando se escribe en el buscador
  useEffect(() => {
    if (searchOffice.length > 0) {
      setShowOfficesList(true);
    }
  }, [searchOffice]);
  
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

  // Debug: Verificar estructura de generals
  useEffect(() => {
    console.log('Generals data:', generals);
    const openingHours = generals?.find(g => g.correlative === 'opening_hours');
    console.log('Opening hours found:', openingHours);
  }, [generals]);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (rubroDropdownRef.current && !rubroDropdownRef.current.contains(event.target)) {
        setShowRubroDropdown(false);
      }
      if (officesListRef.current && !officesListRef.current.contains(event.target)) {
        setShowOfficesList(false);
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
        // Redirigir a la página de agradecimiento
        window.location.href = '/thanks';
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

  // Filtrar oficinas por búsqueda
  const filteredOffices = offices.filter(office => 
    office.name?.toLowerCase().includes(searchOffice.toLowerCase()) ||
    office.address?.toLowerCase().includes(searchOffice.toLowerCase()) ||
    office.type?.toLowerCase().includes(searchOffice.toLowerCase())
  );

  // Manejar click en marcador del mapa
  const handleMarkerClick = (office) => {
    setSelectedOffice(office);
    setMapCenter({
      lat: parseFloat(office.latitude),
      lng: parseFloat(office.longitude)
    });
    setMapZoom(16);
  };

  // Manejar click en item de oficina
  const handleOfficeItemClick = (office) => {
    setSelectedOffice(office);
    if (office.latitude && office.longitude) {
      setMapCenter({
        lat: parseFloat(office.latitude),
        lng: parseFloat(office.longitude)
      });
      setMapZoom(16);
    }
  };

  // Configuración del mapa (ya no se usa mapContainerStyle como objeto separado)

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
        <section className="py-12 md:py-20 bg-gradient-to-b from-gray-50 to-white relative overflow-hidden">
          {/* Decoración de fondo */}
          <div className="absolute inset-0 opacity-[0.03]">
            <div className="absolute top-1/4 left-0 w-96 h-96 bg-hd-cerulean rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-hd-android rounded-full blur-3xl" />
          </div>

          <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
            <div className="text-center mb-12">
              <div 
                className="inline-block px-6 py-2 rounded-full mb-6"
                style={{
                  background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
                }}
              >
                <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Ubicaciones</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                Nuestras{' '}
                <span 
                  className="bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                  }}
                >
                  Oficinas
                </span>
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Encuentra nuestras oficinas y almacenes a nivel nacional
              </p>
            </div>

            {/* Contenedor del Mapa con Lista Flotante */}
            <div className="relative">
              {/* Panel Lateral Flotante - Lista de Oficinas */}
              <div 
                ref={officesListRef}
                className="absolute top-4 left-4 right-4 md:right-auto z-20 md:w-96 max-w-md"
              >
                <div className={`bg-white rounded-3xl shadow-2xl border border-gray-200 overflow-hidden backdrop-blur-sm bg-white/95 flex flex-col ${
                  showOfficesList ? 'max-h-[500px] md:max-h-[670px]' : 'h-auto'
                }`}>
                  {/* Header con Buscador - Siempre Visible */}
                  <div className="p-4 md:p-6 border-b border-gray-200 bg-gradient-to-br from-white to-gray-50 flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 md:w-6 h-5 md:h-6 text-hd-android" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        Ubicaciones
                      </h3>
                      <button
                        onClick={() => setShowOfficesList(!showOfficesList)}
                        className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                      >
                        <svg 
                          className={`w-5 h-5 text-gray-600 transition-transform duration-300 ${showOfficesList ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    </div>
                    
                    {/* Buscador - Siempre Visible */}
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <input
                        type="text"
                        value={searchOffice}
                        onChange={(e) => setSearchOffice(e.target.value)}
                        placeholder="Buscar ubicación..."
                        className="w-full pl-12 pr-10 py-3 bg-white border-2 border-gray-200 rounded-2xl focus:ring-4 focus:ring-hd-android/20 focus:border-hd-android transition-all duration-300 text-gray-900 placeholder-gray-400"
                      />
                      {searchOffice && (
                        <button
                          onClick={() => setSearchOffice('')}
                          className="absolute inset-y-0 right-0 pr-4 flex items-center"
                        >
                          <svg className="w-5 h-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Lista de Oficinas con Scroll */}
                  {showOfficesList && (
                    <div className="flex-1 overflow-y-auto">
                      {filteredOffices.length > 0 ? (
                        <div className="p-4 space-y-2">
                          {filteredOffices.map((office) => (
                            <button
                              key={office.id}
                              onClick={() => handleOfficeItemClick(office)}
                              className={`w-full text-left p-4 rounded-2xl transition-all duration-300 border-2 ${
                                selectedOffice?.id === office.id
                                  ? 'bg-gradient-to-br from-hd-android/10 to-hd-android/5 border-hd-android shadow-lg scale-[1.02]'
                                  : 'bg-white border-gray-100 hover:border-gray-200 hover:shadow-md'
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                                  office.type === 'oficina_principal'
                                    ? 'bg-hd-android/20 text-hd-android'
                                    : office.type === 'oficina'
                                    ? 'bg-hd-cerulean/20 text-hd-cerulean'
                                    : 'bg-hd-cerise/20 text-hd-cerise'
                                }`}>
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className={`text-xs font-bold uppercase tracking-wider ${
                                      office.type === 'oficina_principal'
                                        ? 'text-hd-android'
                                        : office.type === 'oficina'
                                        ? 'text-hd-cerulean'
                                        : 'text-hd-cerise'
                                    }`}>
                                      {office.type === 'oficina_principal' ? 'Principal' : office.type === 'oficina' ? 'Oficina' : 'Almacén'}
                                    </span>
                                    {selectedOffice?.id === office.id && (
                                      <svg className="w-4 h-4 text-hd-android ml-auto" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                      </svg>
                                    )}
                                  </div>
                                  <h4 className="font-bold text-gray-900 mb-1 truncate">{office.name}</h4>
                                  <p className="text-sm text-gray-600 line-clamp-2">{office.address}</p>
                                  {office.phone && (
                                    <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                                      <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                      </svg>
                                      {office.phone}
                                    </p>
                                  )}
                                </div>
                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-8 text-center">
                          <svg className="w-16 h-16 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <p className="text-gray-500 font-medium">No se encontraron ubicaciones</p>
                          <p className="text-sm text-gray-400 mt-1">Intenta con otra búsqueda</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Contador de resultados */}
                  {!showOfficesList && (
                    <div className="px-4 md:px-6 py-3 md:py-4 bg-gradient-to-br from-gray-50 to-white flex-shrink-0 border-t border-gray-200">
                      <p className="text-sm text-gray-600 font-medium text-center">
                        {filteredOffices.length} {filteredOffices.length === 1 ? 'ubicación' : 'ubicaciones'}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Mapa de Google Maps - Ancho Completo */}
              <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-gray-200">
                <LoadScript googleMapsApiKey={Global.GMAPS_API_KEY || ''}>
                  <GoogleMap
                    ref={mapRef}
                    mapContainerStyle={{ width: '100%', height: '700px' }}
                    mapContainerClassName="!h-[700px] md:!h-[700px]"
                    center={mapCenter}
                    zoom={mapZoom}
                    options={{
                      disableDefaultUI: false,
                      zoomControl: true,
                      mapTypeControl: false,
                      scaleControl: true,
                      streetViewControl: true,
                      rotateControl: false,
                      fullscreenControl: true,
                      styles: [
                        {
                          featureType: 'poi',
                          elementType: 'labels',
                          stylers: [{ visibility: 'off' }]
                        }
                      ]
                    }}
                  >
                    {offices.map((office) => {
                      if (!office.latitude || !office.longitude) return null;
                      
                      // Color según tipo de oficina
                      const markerColor = office.type === 'oficina_principal' 
                        ? '#8FBD44' // hd-android
                        : office.type === 'oficina'
                        ? '#2354B8' // hd-cerulean
                        : '#DE3464'; // hd-cerise
                      
                      // SVG del icono de marcador estilo Google Maps
                      const pinSVG = `
                     

                        <svg xmlns="http://www.w3.org/2000/svg" width="800px" height="800px" viewBox="0 0 24 24" fill="none"><script xmlns=""/><link xmlns=""/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M11.3856 23.789L11.3831 23.7871L11.3769 23.7822L11.355 23.765C11.3362 23.7501 11.3091 23.7287 11.2742 23.7008C11.2046 23.6451 11.1039 23.5637 10.9767 23.4587C10.7224 23.2488 10.3615 22.944 9.92939 22.5599C9.06662 21.793 7.91329 20.7041 6.75671 19.419C5.60303 18.1371 4.42693 16.639 3.53467 15.0528C2.64762 13.4758 2 11.7393 2 10C2 7.34784 3.05357 4.8043 4.92893 2.92893C6.8043 1.05357 9.34784 0 12 0C14.6522 0 17.1957 1.05357 19.0711 2.92893C20.9464 4.8043 22 7.34784 22 10C22 11.7393 21.3524 13.4758 20.4653 15.0528C19.5731 16.639 18.397 18.1371 17.2433 19.419C16.0867 20.7041 14.9334 21.793 14.0706 22.5599C13.6385 22.944 13.2776 23.2488 13.0233 23.4587C12.8961 23.5637 12.7954 23.6451 12.7258 23.7008C12.6909 23.7287 12.6638 23.7501 12.645 23.765L12.6231 23.7822L12.6169 23.7871L12.615 23.7885C12.615 23.7885 12.6139 23.7894 12 23L12.6139 23.7894C12.2528 24.0702 11.7467 24.0699 11.3856 23.789ZM12 23L11.3856 23.789C11.3856 23.789 11.3861 23.7894 12 23ZM15 10C15 11.6569 13.6569 13 12 13C10.3431 13 9 11.6569 9 10C9 8.34315 10.3431 7 12 7C13.6569 7 15 8.34315 15 10Z" fill="${markerColor}"/>
</svg>
                      `;
                      
                      const isSelected = office.id === selectedOffice?.id;
                      const width = isSelected ? 40 : 32;
                      const height = isSelected ? 40 : 32;
                      
                      const icon = {
                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(pinSVG),
                        scaledSize: window.google?.maps?.Size 
                          ? new window.google.maps.Size(width, height)
                          : { width, height },
                        anchor: window.google?.maps?.Point
                          ? new window.google.maps.Point(width / 2, height)
                          : { x: width / 2, y: height }
                      };
                      
                      return (
                        <Marker
                          key={office.id}
                          position={{
                            lat: parseFloat(office.latitude),
                            lng: parseFloat(office.longitude)
                          }}
                          title={office.name}
                          onClick={() => handleMarkerClick(office)}
                          icon={icon}
                        />
                      );
                    })}
                  </GoogleMap>
                </LoadScript>
              </div>

              {/* Panel de Información de Oficina Seleccionada - Flotante Abajo (Solo Desktop) */}
              {selectedOffice && (
                <div className="hidden md:block absolute bottom-4 right-4 md:w-96 z-20 animate-fadeIn">
                  <div className="bg-white rounded-3xl shadow-2xl border-2 border-gray-200 overflow-hidden backdrop-blur-sm bg-white/95">
                    <div className="p-6">
                      <div className="flex items-start gap-4">
                        <div className={`p-3 rounded-2xl flex-shrink-0 ${
                          selectedOffice.type === 'oficina_principal'
                            ? 'bg-gradient-to-br from-hd-android to-hd-android/80 text-white'
                            : selectedOffice.type === 'oficina'
                            ? 'bg-gradient-to-br from-hd-cerulean to-hd-cerulean/80 text-white'
                            : 'bg-gradient-to-br from-hd-cerise to-hd-cerise/80 text-white'
                        }`}>
                          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-2 ${
                            selectedOffice.type === 'oficina_principal'
                              ? 'bg-hd-android/20 text-hd-android'
                              : selectedOffice.type === 'oficina'
                              ? 'bg-hd-cerulean/20 text-hd-cerulean'
                              : 'bg-hd-cerise/20 text-hd-cerise'
                          }`}>
                            {selectedOffice.type === 'oficina_principal' ? 'Oficina Principal' : selectedOffice.type === 'oficina' ? 'Oficina' : 'Almacén'}
                          </span>
                          <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedOffice.name}</h3>
                          <div className="space-y-2 text-sm">
                            <p className="text-gray-600 flex items-start gap-2">
                              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                              </svg>
                              <span>{selectedOffice.address}</span>
                            </p>
                            {selectedOffice.phone && (
                              <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                                </svg>
                                <span className="font-medium">{selectedOffice.phone}</span>
                              </p>
                            )}
                            {selectedOffice.email && (
                              <p className="text-gray-600 flex items-center gap-2">
                                <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                </svg>
                                <span>{selectedOffice.email}</span>
                              </p>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setSelectedOffice(null)}
                          className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
                        >
                          <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Sección de Horarios de Atención */}
        <section className="py-12 md:py-16 bg-white">
          <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
            <div className="bg-gradient-to-br from-gray-50 via-white to-gray-50 rounded-3xl p-8 md:p-12 border-2 border-gray-100">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Columna Izquierda - Título */}
                <div>
                  <div 
                    className="inline-block px-4 py-2 rounded-full mb-4"
                    style={{
                      background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
                    }}
                  >
                    <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Atención</span>
                  </div>
                  
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Horarios de{' '}
                    <span 
                      className="bg-clip-text text-transparent"
                      style={{
                        backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                      }}
                    >
                      Atención
                    </span>
                  </h2>
                  
                  <p className="text-gray-600 text-lg leading-relaxed">
                    Estamos disponibles para atenderte en los siguientes horarios. Contáctanos y un asesor te responderá a la brevedad.
                  </p>
                </div>

                {/* Columna Derecha - Horarios */}
                <div className="space-y-4">
                  {(() => {
                    const openingHours = generals?.find(g => g.correlative === 'opening_hours')?.description;
                    if (!openingHours) {
                      return (
                        <div className="bg-white rounded-2xl p-6 border-2 border-gray-100">
                          <p className="text-gray-600">No hay horarios configurados</p>
                        </div>
                      );
                    }
                    
                    return openingHours.split('\n').map((horario, index) => (
                      <div 
                        key={index}
                        className="bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-hd-android hover:shadow-lg transition-all duration-300 group"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-gradient-to-br from-hd-android to-hd-android/80 group-hover:scale-110 transition-transform duration-300">
                            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-gray-900 font-semibold text-lg">{horario}</p>
                          </div>
                        </div>
                      </div>
                    ));
                  })()}

                
                </div>
              </div>
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
