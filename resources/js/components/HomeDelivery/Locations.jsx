import React from 'react';

const MapPinIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const Locations = () => {
  const locations = [
    {
      type: 'Oficina Principal',
      address: 'Av. Paseo de la República 3220, San Isidro 15046',
      description: 'Atención al cliente y servicios administrativos',
      highlight: true
    },
    {
      type: 'Centro Logístico - Villa El Salvador',
      address: 'Villa El Salvador, Lima',
      description: 'Almacén principal y centro de distribución'
    }
  ];

  const provinces = [
    'Arequipa', 'Cusco', 'Trujillo', 'Chiclayo', 
    'Piura', 'Ica', 'Huancayo', 'Pucallpa'
  ];

  return (
    <section id="ubicaciones" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-hd-onyx mb-4">
            Ubicaciones
          </h2>
          <p className="text-lg text-hd-gray max-w-2xl mx-auto">
            Cobertura nacional con oficinas y almacenes estratégicamente ubicados
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Ubicaciones principales */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            {locations.map((location, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-6 shadow-md ${
                  location.highlight ? 'border-2 border-hd-green' : ''
                }`}
              >
                {location.highlight && (
                  <span className="inline-block bg-hd-green text-white text-xs font-medium px-3 py-1 rounded-full mb-3">
                    Principal
                  </span>
                )}
                <div className="flex items-start space-x-4">
                  <div className="bg-gradient-to-br from-hd-green/10 to-hd-blue/10 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPinIcon className="w-6 h-6 text-hd-green" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-hd-onyx mb-2">
                      {location.type}
                    </h3>
                    <p className="text-hd-gray mb-2">{location.address}</p>
                    <p className="text-sm text-hd-gray/70">{location.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Almacenes en provincia */}
          <div className="bg-white rounded-xl p-8 shadow-md">
            <h3 className="text-xl font-bold text-hd-onyx mb-4 flex items-center">
              <MapPinIcon className="w-6 h-6 text-hd-green mr-2" />
              8 Almacenes en Provincia
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {provinces.map((province, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 text-hd-gray"
                >
                  <div className="w-2 h-2 bg-hd-green rounded-full"></div>
                  <span>{province}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Contacto */}
          <div className="mt-8 bg-gradient-to-br from-hd-green to-hd-blue rounded-xl p-8 text-white text-center">
            <div className="flex items-center justify-center mb-3">
              <PhoneIcon className="w-6 h-6 mr-2" />
              <h3 className="text-xl font-bold">Contáctanos</h3>
            </div>
            <p className="text-2xl font-bold mb-2">933 411 599</p>
            <p className="text-white/80">Teléfono y WhatsApp</p>
            <p className="text-sm text-white/60 mt-2">Atención de Lunes a Viernes, 8:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Locations;
