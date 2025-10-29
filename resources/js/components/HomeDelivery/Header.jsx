import React, { useState, useEffect } from 'react';

/**
 * Header - Navegación principal mejorada
 * - Logo PNG (no SVG)
 * - Botones full rounded
 * - Responsive: 2xl:max-w-7xl 2xl:px-0, menor a 2xl usa px-[5%]
 * - Colores: Fondo blanco, hover Cerise, CTA en Cerise
 * - Navegación a páginas reales: /nosotros, /servicios, /contacto, /blog
 */
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '/', label: 'Inicio' },
    { href: '/about', label: 'Nosotros' },
    { href: '/services', label: 'Servicios' },
    { href: '/contact', label: 'Contacto' },
    { href: '/blog', label: 'Blog' }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 font-aeonik ${
        isScrolled 
          ? 'bg-white shadow-lg border-b border-gray-100' 
          : 'bg-white/95 backdrop-blur-md'
      }`}
    >
      {/* Container Responsive: 2xl usa max-w-7xl y px-0, menor a 2xl usa px-[5%] */}
      <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo PNG con efecto hover */}
          <div 
            className="flex-shrink-0 cursor-pointer transform transition-transform duration-300 hover:scale-105" 
            onClick={() => window.location.href = '/'}
          >
            <img
              src="/logo.png"
              alt="Home Delivery Logistics"
              className="h-12 w-auto"
            />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-hd-cerise font-medium transition-all duration-300 relative group text-lg tracking-wide font-aeonik"
              >
                {link.label}
                {/* Underline animado más elegante */}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-hd-cerise to-hd-android group-hover:w-full transition-all duration-300 ease-out"></span>
              </a>
            ))}
            
            {/* Botón CTA - Full Rounded con degradado hover */}
            <a
              href="/contact"
              className="relative bg-hd-cerise hover:bg-hd-android text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 hover:-translate-y-0.5 shadow-md hover:shadow-xl text-sm tracking-wide overflow-hidden group font-aeonik"
            >
              <span className="relative z-10">Cotizar Ahora</span>
              {/* Efecto de brillo al hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
            </a>
          </nav>

          {/* Mobile Menu Button - Mejorado */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2.5 rounded-full hover:bg-hd-cerise/10 transition-all duration-300 group"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-gray-700 group-hover:text-hd-cerise transition-colors duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Navigation - Mejorado */}
        {isMobileMenuOpen && (
          <nav className="lg:hidden py-6 border-t border-gray-100 animate-fadeIn">
            <div className="flex flex-col space-y-1">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-left  px-4 py-3.5 text-gray-700 hover:text-hd-cerise hover:bg-hd-cerise/5 rounded-xl transition-all duration-300 font-medium tracking-wide transform hover:translate-x-1"
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animation: 'fadeIn 0.3s ease-out forwards'
                  }}
                >
                  {link.label}
                </a>
              ))}
              
              {/* Botón CTA Mobile - Full Rounded con gradiente */}
              <div className="pt-4 px-4">
                <a
                  href="/contact"
                  className="block w-full bg-gradient-to-r from-hd-cerise to-hd-android hover:from-hd-android hover:to-hd-cerise text-white px-6 py-3.5 rounded-full font-semibold transition-all duration-500 text-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                >
                  Cotizar Ahora
                </a>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
