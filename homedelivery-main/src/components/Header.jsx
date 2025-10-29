import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <Logo variant="horizontal" size={35} />
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => scrollToSection('servicios')}
              className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular"
            >
              Servicios
            </button>
            <button
              onClick={() => scrollToSection('beneficios')}
              className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular"
            >
              Beneficios
            </button>
            <button
              onClick={() => scrollToSection('cotizacion')}
              className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular"
            >
              Cotización
            </button>
            <button
              onClick={() => scrollToSection('contacto')}
              className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular"
            >
              Contacto
            </button>
            <button
              onClick={() => scrollToSection('ubicaciones')}
              className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular"
            >
              Ubicaciones
            </button>
            <button
              onClick={() => scrollToSection('cotizacion')}
              className="bg-brand-green text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
            >
              Solicitar cotización
            </button>
          </nav>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:ring-2 focus:ring-brand-green"
            aria-label="Menú"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-brand-onyx" />
            ) : (
              <Menu className="w-6 h-6 text-brand-onyx" />
            )}
          </button>
        </div>

        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => scrollToSection('servicios')}
                className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular text-left py-2"
              >
                Servicios
              </button>
              <button
                onClick={() => scrollToSection('beneficios')}
                className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular text-left py-2"
              >
                Beneficios
              </button>
              <button
                onClick={() => scrollToSection('cotizacion')}
                className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular text-left py-2"
              >
                Cotización
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular text-left py-2"
              >
                Contacto
              </button>
              <button
                onClick={() => scrollToSection('ubicaciones')}
                className="text-brand-onyx hover:text-brand-green transition-colors duration-200 font-regular text-left py-2"
              >
                Ubicaciones
              </button>
              <button
                onClick={() => scrollToSection('cotizacion')}
                className="bg-brand-green text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium text-left"
              >
                Solicitar cotización
              </button>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
