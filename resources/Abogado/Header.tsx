import React, { useState } from 'react';
import { Menu, X, Scale } from 'lucide-react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="Estudio SERGIO QUIROZ" className="h-12 w-auto" />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Inicio</a>
            <a href="#servicios" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Servicios</a>
            <a href="#testimonios" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Testimonios</a>
            <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors duration-300">Contacto</a>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
              <a href="#inicio" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">Inicio</a>
              <a href="#servicios" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">Servicios</a>
              <a href="#testimonios" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">Testimonios</a>
              <a href="#contacto" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-300">Contacto</a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;