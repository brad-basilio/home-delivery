import React, { useState, useEffect, useRef } from 'react';

/**
 * Benefits - Sección de Fortalezas con Formulario de Contacto
 * Layout de 2 columnas: Swiper de fortalezas (2/5) + Formulario (3/5)
 * Fondo con gradiente oficial de Home Delivery
 * Swiper automático con colores de la empresa
 */
const Benefits = ({ strengths = [], generals = [], socials = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    business_sector: '',
    daily_shipments: '',
    location_type: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRefs = {
    business_sector: useRef(null),
    daily_shipments: useRef(null),
    location_type: useRef(null)
  };

  // Auto-advance slider cada 5 segundos
  useEffect(() => {
    if (strengths.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % strengths.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [strengths.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && dropdownRefs[openDropdown]?.current && 
          !dropdownRefs[openDropdown].current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  // Colores oficiales para rotar en cada strength
  const colorSchemes = [
    {
      gradient: 'from-hd-android to-hd-android/80',
      bg: 'bg-hd-android',
      text: 'text-hd-android',
      border: 'border-hd-android',
    },
    {
      gradient: 'from-hd-cerise to-hd-cerise/80',
      bg: 'bg-hd-cerise',
      text: 'text-hd-cerise',
      border: 'border-hd-cerise',
    },
    {
      gradient: 'from-hd-cerulean to-hd-cerulean/80',
      bg: 'bg-hd-cerulean',
      text: 'text-hd-cerulean',
      border: 'border-hd-cerulean',
    },
    {
      gradient: 'from-hd-spanish to-hd-spanish/80',
      bg: 'bg-hd-spanish',
      text: 'text-hd-spanish',
      border: 'border-hd-spanish',
    },
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDropdownSelect = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setOpenDropdown(null);
  };

  const toggleDropdown = (field) => {
    setOpenDropdown(openDropdown === field ? null : field);
  };

  // Dropdown options
  const dropdownOptions = {
    business_sector: [
      'E-commerce',
      'Retail',
      'Farmacéutico',
      'Alimentos y Bebidas',
      'Tecnología',
      'Moda y Textil',
      'Salud y Belleza',
      'Automotriz',
      'Otro'
    ],
    daily_shipments: [
      '1-10 diarios',
      '11-50 diarios',
      '51-100 diarios',
      '100+ diarios',
      '1-100 mensuales',
      '101-500 mensuales',
      '500+ mensuales'
    ],
    location_type: [
      'Lima',
      'Provincia',
      'Lima y Provincia'
    ]
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        alert('¡Solicitud enviada exitosamente! Nos pondremos en contacto contigo pronto.');
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          company: '', 
          business_sector: '',
          daily_shipments: '',
          location_type: '',
          description: '' 
        });
      } else {
        alert('Error al enviar la solicitud. Por favor intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al enviar la solicitud. Por favor intenta nuevamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % strengths.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + strengths.length) % strengths.length);
  };

  if (!strengths || strengths.length === 0) {
    return null;
  }

  return (
    <section 
      id="beneficios" 
      className="relative py-20 md:py-24 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.05) 0%, rgba(15, 102, 167, 0.05) 25%, rgba(96, 71, 150, 0.05) 50%, rgba(171, 48, 126, 0.05) 75%, rgba(231, 22, 100, 0.05) 100%)'
      }}
    >
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute top-1/4 left-0 w-96 h-96 bg-hd-cerulean rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-hd-android rounded-full blur-3xl" />
      </div>

      <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
        {/* Header de la sección */}
        <div className="text-center mb-16">
          <div 
            className="inline-block px-6 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
            }}
          >
            <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">¿Por qué elegirnos?</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Nuestras{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
              }}
            >
              Fortalezas
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Conoce las ventajas que nos hacen líderes en soluciones logísticas
          </p>
        </div>

        {/* Grid: Swiper (2/5 izquierda) + Formulario (3/5 derecha) */}
        <div className="grid lg:grid-cols-5 gap-8 items-start">
          {/* Columna Izquierda: Swiper de Fortalezas (2/5) */}
          <div className="lg:col-span-2 relative">
            <div className="relative rounded-3xl overflow-hidden lg:sticky lg:top-24">
              {/* Slider */}
              <div className="relative h-[450px] md:h-[550px]">
                {strengths.map((strength, index) => {
                  const colorScheme = colorSchemes[index % colorSchemes.length];
                  
                  return (
                    <div
                      key={strength.id}
                      className={`absolute inset-0 transition-all duration-700 ${
                        index === currentSlide
                          ? 'opacity-100 translate-x-0'
                          : index < currentSlide
                          ? 'opacity-0 -translate-x-full'
                          : 'opacity-0 translate-x-full'
                      }`}
                    >
                      {/* Card con gradiente de fondo */}
                      <div className={`h-full bg-gradient-to-br ${colorScheme.gradient} rounded-3xl shadow-2xl p-6 md:p-8 flex flex-col justify-between relative overflow-hidden`}>
                        {/* Patrón decorativo de fondo */}
                        <div className="absolute top-0 right-0 w-48 h-48 opacity-10">
                          <svg viewBox="0 0 200 200" className="w-full h-full">
                            <defs>
                              <pattern id={`pattern-${index}`} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                                <circle cx="20" cy="20" r="2" fill="white" />
                              </pattern>
                            </defs>
                            <rect x="0" y="0" width="200" height="200" fill={`url(#pattern-${index})`} />
                          </svg>
                        </div>

                        {/* Contenido superior */}
                        <div className="relative z-10">
                          {/* Icono/Imagen */}
                          <div className="mb-6">
                            <div className="inline-flex p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-xl">
                              <img
                                src={`/api/strength/media/${strength.image}`}
                                alt={strength.name}
                                className="w-16 h-16 md:w-20 md:h-20 object-contain filter brightness-0 invert"
                                onError={(e) => {
                                  e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white"%3E%3Cpath d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/%3E%3C/svg%3E';
                                }}
                              />
                            </div>
                          </div>

                          {/* Título */}
                          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                            {strength.name}
                          </h3>

                          {/* Descripción */}
                          <p className="text-white/95 text-base md:text-lg leading-relaxed">
                            {strength.description}
                          </p>
                        </div>

                        {/* Contenido inferior */}
                        <div className="relative z-10">
                          {/* Número decorativo */}
                          <div className="absolute -bottom-2 -right-2 opacity-10">
                            <span className="text-[8rem] font-bold text-white leading-none">
                              {String(index + 1).padStart(2, '0')}
                            </span>
                          </div>

                          {/* Navegación */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {strengths.map((_, idx) => (
                                <button
                                  key={idx}
                                  onClick={() => setCurrentSlide(idx)}
                                  className={`h-2 rounded-full transition-all duration-300 ${
                                    idx === currentSlide
                                      ? 'w-10 bg-white shadow-lg'
                                      : 'w-2 bg-white/40 hover:bg-white/60'
                                  }`}
                                  aria-label={`Ir a fortaleza ${idx + 1}`}
                                />
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              {/* Botones prev/next */}
                              {strengths.length > 1 && (
                                <>
                                  <button
                                    onClick={prevSlide}
                                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                                    aria-label="Anterior"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                  </button>

                                  <div className="text-white/80 text-xs font-bold min-w-[2.5rem] text-center">
                                    {String(currentSlide + 1).padStart(2, '0')} / {String(strengths.length).padStart(2, '0')}
                                  </div>

                                  <button
                                    onClick={nextSlide}
                                    className="bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white p-2 rounded-full transition-all duration-300 hover:scale-110"
                                    aria-label="Siguiente"
                                  >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  </button>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Columna Derecha: Formulario de Contacto (3/5) */}
          <div className="lg:col-span-3 relative">
            <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8">
              {/* Header del formulario */}
              <div className="mb-6">
                <h3 
                  className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent"
                  style={{
                    backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
                  }}
                >
                  Solicita una Cotización
                </h3>
                <p className="text-gray-600">
                  Déjanos tus datos y nos pondremos en contacto contigo lo antes posible
                </p>
              </div>

              {/* Formulario */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Row 1: Nombre y Empresa */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-bold text-gray-900 mb-1.5">
                      Nombre completo *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-hd-cerise focus:outline-none transition-colors text-gray-900"
                      placeholder="Tu nombre"
                    />
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-bold text-gray-900 mb-1.5">
                      Empresa *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-hd-cerise focus:outline-none transition-colors text-gray-900"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                </div>

                {/* Row 2: Correo y Celular */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-gray-900 mb-1.5">
                      Correo *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-hd-cerise focus:outline-none transition-colors text-gray-900"
                      placeholder="tu@email.com"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-bold text-gray-900 mb-1.5">
                      Celular *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-hd-cerise focus:outline-none transition-colors text-gray-900"
                      placeholder="+51 999 999 999"
                    />
                  </div>
                </div>

                {/* Row 3: Rubro y Cantidad de envíos */}
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Rubro - Custom Dropdown */}
                  <div ref={dropdownRefs.business_sector}>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">
                      Rubro *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown('business_sector')}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-colors text-left flex items-center justify-between ${
                          formData.business_sector 
                            ? 'border-hd-cerise text-gray-900' 
                            : 'border-gray-200 text-gray-400'
                        }`}
                      >
                        <span>{formData.business_sector || 'Selecciona tu rubro'}</span>
                        <svg 
                          className={`w-5 h-5 transition-transform ${openDropdown === 'business_sector' ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {openDropdown === 'business_sector' && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {dropdownOptions.business_sector.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleDropdownSelect('business_sector', option)}
                              className={`w-full px-4 py-2.5 text-left hover:bg-gradient-to-r hover:from-hd-cerise/10 hover:to-hd-cerulean/10 transition-colors ${
                                formData.business_sector === option 
                                  ? 'bg-gradient-to-r from-hd-cerise/20 to-hd-cerulean/20 text-hd-cerise font-bold' 
                                  : 'text-gray-700'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Cantidad de envíos - Custom Dropdown */}
                  <div ref={dropdownRefs.daily_shipments}>
                    <label className="block text-sm font-bold text-gray-900 mb-1.5">
                      Cantidad de envíos *
                    </label>
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => toggleDropdown('daily_shipments')}
                        className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-colors text-left flex items-center justify-between ${
                          formData.daily_shipments 
                            ? 'border-hd-cerise text-gray-900' 
                            : 'border-gray-200 text-gray-400'
                        }`}
                      >
                        <span className="truncate">{formData.daily_shipments || 'Selecciona cantidad'}</span>
                        <svg 
                          className={`w-5 h-5 transition-transform flex-shrink-0 ${openDropdown === 'daily_shipments' ? 'rotate-180' : ''}`} 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      
                      {openDropdown === 'daily_shipments' && (
                        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl max-h-60 overflow-y-auto">
                          {dropdownOptions.daily_shipments.map((option) => (
                            <button
                              key={option}
                              type="button"
                              onClick={() => handleDropdownSelect('daily_shipments', option)}
                              className={`w-full px-4 py-2.5 text-left hover:bg-gradient-to-r hover:from-hd-android/10 hover:to-hd-cerulean/10 transition-colors ${
                                formData.daily_shipments === option 
                                  ? 'bg-gradient-to-r from-hd-android/20 to-hd-cerulean/20 text-hd-android font-bold' 
                                  : 'text-gray-700'
                              }`}
                            >
                              {option}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Row 4: Ubicación */}
                <div ref={dropdownRefs.location_type}>
                  <label className="block text-sm font-bold text-gray-900 mb-1.5">
                    Ubicación *
                  </label>
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => toggleDropdown('location_type')}
                      className={`w-full px-4 py-2.5 border-2 rounded-xl focus:outline-none transition-colors text-left flex items-center justify-between ${
                        formData.location_type 
                          ? 'border-hd-cerise text-gray-900' 
                          : 'border-gray-200 text-gray-400'
                      }`}
                    >
                      <span>{formData.location_type || 'Selecciona ubicación'}</span>
                      <svg 
                        className={`w-5 h-5 transition-transform ${openDropdown === 'location_type' ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    
                    {openDropdown === 'location_type' && (
                      <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl">
                        {dropdownOptions.location_type.map((option) => (
                          <button
                            key={option}
                            type="button"
                            onClick={() => handleDropdownSelect('location_type', option)}
                            className={`w-full px-4 py-2.5 text-left hover:bg-gradient-to-r hover:from-hd-cerulean/10 hover:to-hd-cerise/10 transition-colors ${
                              formData.location_type === option 
                                ? 'bg-gradient-to-r from-hd-cerulean/20 to-hd-cerise/20 text-hd-cerulean font-bold' 
                                : 'text-gray-700'
                            }`}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Row 5: Mensaje */}
                <div>
                  <label htmlFor="description" className="block text-sm font-bold text-gray-900 mb-1.5">
                    Mensaje adicional
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-hd-cerise focus:outline-none transition-colors resize-none text-gray-900"
                    placeholder="Cuéntanos más sobre tus necesidades..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-hd-cerise to-hd-cerise/90 text-white px-8 py-3 rounded-full font-bold text-base hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Enviando...
                    </span>
                  ) : (
                    'Enviar Solicitud'
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center">
                  Al enviar este formulario, aceptas nuestra política de privacidad
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Benefits;
