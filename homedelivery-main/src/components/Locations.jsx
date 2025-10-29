import { MapPin, Phone, MessageCircle, Warehouse } from 'lucide-react';

const Locations = () => {
  const locations = [
    {
      title: 'Oficina Principal - San Isidro',
      address: 'Av. Paseo de la República 3220, San Isidro 15046',
      type: 'Oficina',
    },
    {
      title: 'Sede Logística - Villa El Salvador',
      address:
        'COMPLEJO ALDEA LOGISTICA GLOBAL S.A.C N°6, S/N LT 17 UNIDAD CATASTRAL 10050 ALT KM 21.5, VILLA EL SALVADOR – LIMA',
      type: 'Almacén',
    },
  ];

  return (
    <section id="ubicaciones" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-brand-onyx mb-4">
            Ubicaciones
          </h2>
          <p className="text-xl text-brand-gray font-light max-w-2xl mx-auto">
            Presencia nacional para estar más cerca de ti
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {locations.map((location, index) => (
            <div
              key={index}
              className="bg-gray-50 rounded-xl p-8 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-brand-green bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-brand-green" />
                </div>
                <div>
                  <span className="inline-block px-3 py-1 bg-brand-blue bg-opacity-10 text-brand-blue text-sm font-medium rounded-full mb-3">
                    {location.type}
                  </span>
                  <h3 className="text-xl font-medium text-brand-onyx mb-3">
                    {location.title}
                  </h3>
                  <p className="text-brand-gray font-light leading-relaxed">
                    {location.address}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-brand-green bg-opacity-10 rounded-xl p-8 mb-12">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-brand-green bg-opacity-20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Warehouse className="w-6 h-6 text-brand-green" />
            </div>
            <div>
              <h3 className="text-xl font-medium text-brand-onyx mb-2">
                Cobertura Nacional
              </h3>
              <p className="text-brand-gray font-light leading-relaxed">
                Contamos con 8 almacenes estratégicamente ubicados en provincia
                para garantizar entregas rápidas y eficientes en todo el Perú.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <div className="bg-white border border-gray-100 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-brand-blue bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <Phone className="w-6 h-6 text-brand-blue" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-brand-onyx mb-2">
                  Teléfono
                </h3>
                <a
                  href="tel:+51933411599"
                  className="text-brand-gray hover:text-brand-blue transition-colors duration-200"
                >
                  933 411 599
                </a>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-xl p-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-brand-green bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
                <MessageCircle className="w-6 h-6 text-brand-green" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-brand-onyx mb-2">
                  WhatsApp
                </h3>
                <a
                  href="https://wa.me/51933411599"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-brand-gray hover:text-brand-green transition-colors duration-200"
                >
                  933 411 599
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl overflow-hidden shadow-lg">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3901.3!2d-77.03!3d-12.09!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMTLCsDA1JzI0LjAiUyA3N8KwMDEnNDguMCJX!5e0!3m2!1ses!2spe!4v1234567890"
            width="100%"
            height="400"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Ubicación de Home Delivery Logistics"
          ></iframe>
        </div>
      </div>
    </section>
  );
};

export default Locations;
