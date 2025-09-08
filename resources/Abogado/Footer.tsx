import React from 'react';
import { useState } from 'react';
import { Scale, Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';
import LegalModals from './LegalModals';

const Footer = () => {
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState(false);

  return (
    <>
      <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Scale className="h-8 w-8 text-blue-400" />
              <span className="text-xl font-bold">LexInmobiliaria</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Especialistas en derecho inmobiliario con más de 15 años de experiencia 
              protegiendo el patrimonio de nuestros clientes.
            </p>
            <div className="flex space-x-4">
              <a 
                href="https://www.facebook.com/share/1BwrVpqsro/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/sergioquiroz.abogados?igsh=MXY2cDFxcjA0NTJ2eg%3D%3D&utm_source=qr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://www.tiktok.com/@sergioquirozabogado?_t=ZM-8zQDvt0oziP&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
              <a 
                href="https://www.tiktok.com/@sergioquirozabogado?_t=ZM-8zQDvt0oziP&_r=1" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <a href="#inicio" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#servicios" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Servicios
                </a>
              </li>
              <li>
                <a href="#testimonios" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Testimonios
                </a>
              </li>
              <li>
                <a href="#contacto" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Servicios</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Contratos de Compraventa
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Arrendamientos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Desalojos
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Regularización
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-blue-400 transition-colors duration-300">
                  Defensa Legal
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contacto</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">+51 982 292 914</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-blue-400" />
                <span className="text-gray-300 text-sm">contacto@lexinmobiliaria.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-blue-400 mt-1" />
                <span className="text-gray-300 text-sm">
                  Lima,<br />
                  Perú
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 LexInmobiliaria. Todos los derechos reservados.
            </p>
            <p className="text-gray-400 text-sm">
              Powered by{' '}
              <a 
                href="http://mundoweb.pe/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-400 hover:text-blue-300 transition-colors duration-300 font-medium"
              >
                Mundo Web
              </a>
            </p>
            <div className="flex space-x-6 text-sm">
              <button 
                onClick={() => setPrivacyOpen(true)}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Política de Privacidad
              </button>
              <button 
                onClick={() => setTermsOpen(true)}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Términos de Servicio
              </button>
              <button 
                onClick={() => setLegalOpen(true)}
                className="text-gray-400 hover:text-blue-400 transition-colors duration-300"
              >
                Aviso Legal
              </button>
            </div>
          </div>
        </div>
      </div>
      </footer>

      <LegalModals
        privacyOpen={privacyOpen}
        termsOpen={termsOpen}
        legalOpen={legalOpen}
        onClosePrivacy={() => setPrivacyOpen(false)}
        onCloseTerms={() => setTermsOpen(false)}
        onCloseLegal={() => setLegalOpen(false)}
      />
    </>
  );
};

export default Footer;