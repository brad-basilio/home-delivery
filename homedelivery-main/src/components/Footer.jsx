import { Facebook, Instagram, Mail, Phone } from 'lucide-react';
import Logo from './Logo';

const Footer = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="bg-brand-onyx text-white py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="mb-6">
              <svg
                width="180"
                height="40"
                viewBox="0 0 450 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <radialGradient
                    id="footerGradient"
                    cx="50%"
                    cy="50%"
                    r="50%"
                    fx="50%"
                    fy="50%"
                  >
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#969798" />
                    <stop offset="55%" stopColor="#8FBD44" />
                    <stop offset="70%" stopColor="#2354B8" />
                    <stop offset="85%" stopColor="#DE3464" />
                    <stop offset="100%" stopColor="#DE3464" />
                  </radialGradient>
                </defs>

                <text
                  x="0"
                  y="75"
                  fontSize="90"
                  fontWeight="700"
                  fontFamily="Aeonik, sans-serif"
                  fill="#FFFFFF"
                >
                  H
                </text>

                <circle cx="110" cy="50" r="35" fill="url(#footerGradient)" />
                <circle cx="110" cy="50" r="20" fill="#33393F" />
                <circle cx="145" cy="75" r="8" fill="#DE3464" />

                <text
                  x="165"
                  y="75"
                  fontSize="90"
                  fontWeight="700"
                  fontFamily="Aeonik, sans-serif"
                  fill="#FFFFFF"
                >
                  ME
                </text>

                <text
                  x="320"
                  y="45"
                  fontSize="22"
                  fontWeight="300"
                  fontFamily="Aeonik, sans-serif"
                  fill="#FFFFFF"
                >
                  Delivery
                </text>
                <text
                  x="320"
                  y="70"
                  fontSize="22"
                  fontWeight="300"
                  fontFamily="Aeonik, sans-serif"
                  fill="#FFFFFF"
                >
                  Logistics
                </text>
              </svg>
            </div>
            <p className="text-gray-400 font-light leading-relaxed">
              Soluciones logísticas integrales con cobertura nacional y
              tecnología de punta.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Enlaces Rápidos</h3>
            <nav className="flex flex-col space-y-3">
              <button
                onClick={() => scrollToSection('servicios')}
                className="text-gray-400 hover:text-brand-green transition-colors duration-200 text-left font-light"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection('beneficios')}
                className="text-gray-400 hover:text-brand-green transition-colors duration-200 text-left font-light"
              >
                Beneficios
              </button>
              <button
                onClick={() => scrollToSection('cotizacion')}
                className="text-gray-400 hover:text-brand-green transition-colors duration-200 text-left font-light"
              >
                Cotización
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="text-gray-400 hover:text-brand-green transition-colors duration-200 text-left font-light"
              >
                Contacto
              </button>
            </nav>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Contacto</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Mail className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 font-light text-sm">Email</p>
                  <a
                    href="mailto:contacto@homedeliverylogistics.com"
                    className="text-white hover:text-brand-green transition-colors duration-200"
                  >
                    contacto@hdl.pe
                  </a>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Phone className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-400 font-light text-sm">Teléfono</p>
                  <a
                    href="tel:+51933411599"
                    className="text-white hover:text-brand-green transition-colors duration-200"
                  >
                    933 411 599
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium mb-4">Síguenos</h3>
            <div className="flex space-x-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white bg-opacity-10 rounded-lg flex items-center justify-center hover:bg-brand-green transition-all duration-200 focus:ring-2 focus:ring-brand-green focus:ring-offset-2 focus:ring-offset-brand-onyx"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white bg-opacity-10 rounded-lg flex items-center justify-center hover:bg-brand-green transition-all duration-200 focus:ring-2 focus:ring-brand-green focus:ring-offset-2 focus:ring-offset-brand-onyx"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 font-light text-sm text-center md:text-left">
              2025 Home Delivery Logistics. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 font-light text-sm">
              Av. Paseo de la República 3220, San Isidro 15046
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
