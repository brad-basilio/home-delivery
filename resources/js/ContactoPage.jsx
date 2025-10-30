import { createRoot } from 'react-dom/client';
import CreateReactScript from './Utils/CreateReactScript';
import { useState, useEffect, useRef } from 'react';
import '../css/homedelivery.css';
import Header from './components/HomeDelivery/Header';
import Footer from './components/HomeDelivery/Footer';
import WhatsAppButton from './components/HomeDelivery/WhatsAppButton';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Global from './Utils/Global';

const ContactoPage = (props) => {
  const { offices = [], generals = [], socials = [] } = props;
  
  const mapRef = useRef(null);
  const [selectedOffice, setSelectedOffice] = useState(null);
  const [mapCenter, setMapCenter] = useState({ lat: -12.0464, lng: -77.0428 }); // Lima Centro por defecto
  const [mapZoom, setMapZoom] = useState(12);
  
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    celular: '',
    rubro: '',
    cantidad_envios: '',
    ubicacion: 'lima'
  });

  // Obtener oficina principal
  const oficinaPrincipal = offices?.find(o => o.type === 'oficina_principal');

  // Obtener datos de contacto desde generals
  const emailSoporte = generals?.find(g => g.correlative === 'email_contact')?.description || '';
  const telefonoSoporte = generals?.find(g => g.correlative === 'phone_contact')?.description || '';
  const whatsappNumber = generals?.find(g => g.correlative === 'whatsapp_phone')?.description || '';

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
    console.log('Form submitted:', formData);
    // Aquí iría la lógica para enviar el formulario
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
                <div className="bg-white p-6 md:p-10 rounded-2xl border-2 border-gray-100 shadow-lg">
                  <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">Solicita tu Cotización</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Nombre Completo <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="nombre"
                          value={formData.nombre}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hd-android focus:border-transparent transition-all duration-300"
                          placeholder="Juan Pérez"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Empresa <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="empresa"
                          value={formData.empresa}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hd-android focus:border-transparent transition-all duration-300"
                          placeholder="Mi Empresa SAC"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Correo Electrónico <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="correo"
                          value={formData.correo}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hd-android focus:border-transparent transition-all duration-300"
                          placeholder="juan@empresa.com"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Celular <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          name="celular"
                          value={formData.celular}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hd-android focus:border-transparent transition-all duration-300"
                          placeholder="999 999 999"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Rubro <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="rubro"
                        value={formData.rubro}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hd-android focus:border-transparent transition-all duration-300"
                      >
                        <option value="">Selecciona tu rubro</option>
                        <option value="ecommerce">E-commerce</option>
                        <option value="retail">Retail</option>
                        <option value="alimentos">Alimentos y Bebidas</option>
                        <option value="farmaceutico">Farmacéutico</option>
                        <option value="tecnologia">Tecnología</option>
                        <option value="moda">Moda y Textil</option>
                        <option value="otro">Otro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Cantidad de envíos (diarios o mensuales) <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="cantidad_envios"
                        value={formData.cantidad_envios}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-hd-android focus:border-transparent transition-all duration-300"
                        placeholder="Ej: 50 diarios o 1000 mensuales"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Ubicación <span className="text-red-500">*</span>
                      </label>
                      <div className="flex gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="ubicacion"
                            value="lima"
                            checked={formData.ubicacion === 'lima'}
                            onChange={handleChange}
                            className="w-4 h-4 text-hd-android focus:ring-hd-android"
                          />
                          <span className="ml-2 text-gray-700">Lima</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="ubicacion"
                            value="provincia"
                            checked={formData.ubicacion === 'provincia'}
                            onChange={handleChange}
                            className="w-4 h-4 text-hd-android focus:ring-hd-android"
                          />
                          <span className="ml-2 text-gray-700">Provincia</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-gradient-to-r from-hd-cerise to-hd-cerise/90 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
                    >
                      Enviar Solicitud
                    </button>
                  </form>
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
