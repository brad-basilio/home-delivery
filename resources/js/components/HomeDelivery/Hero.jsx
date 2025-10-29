import React, { useState, useEffect } from 'react';

/**
 * Hero Slider - Sección principal con slider dinámico
 * Obtiene los sliders desde el backend y los muestra con animaciones premium
 * Degradado oficial de Home Delivery como overlay
 */
const Hero = ({ sliders = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  // Auto-advance slider
  useEffect(() => {
    if (sliders.length <= 1) return;

    const timer = setInterval(() => {
      handleNext();
    }, 6000); // Cambiar cada 6 segundos

    return () => clearInterval(timer);
  }, [currentSlide, sliders.length]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % sliders.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const handlePrev = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + sliders.length) % sliders.length);
    setTimeout(() => setIsAnimating(false), 800);
  };

  const goToSlide = (index) => {
    if (isAnimating || index === currentSlide) return;
    setIsAnimating(true);
    setCurrentSlide(index);
    setTimeout(() => setIsAnimating(false), 800);
  };

  // Si no hay sliders, mostrar versión estática
  if (!sliders || sliders.length === 0) {
    return (
      <section 
        className="relative pt-40 pb-20 overflow-hidden min-h-[600px] flex items-center"
        style={{
          background: 'linear-gradient(135deg, #84BC28 0%, #0F66A7 10%, #604796 25%, #AB307E 45%, #D43070 65%, #E43367 85%, #E71664 100%)'
        }}
      >
        <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
          <div className="text-center text-white space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold drop-shadow-lg">
              Logística que llega <span className="text-white">más lejos</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Soluciones integrales de distribución para hacer crecer tu negocio
            </p>
            <button
              onClick={() => scrollToSection('cotizacion')}
              className="bg-white text-hd-cerise px-8 py-4 rounded-full font-semibold shadow-xl hover:scale-105 transition-transform"
            >
              Cotizar Ahora
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full overflow-hidden bg-gray-900 pt-20">
      {/* Slides Container */}
      <div className="relative h-[calc(100vh-80px)] min-h-[600px] max-h-[800px]">
        {sliders.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide
                ? 'opacity-100 scale-100 z-10'
                : 'opacity-0 scale-105 z-0'
            }`}
          >
            {/* Background Image */}
            <div className="absolute inset-0">
              <img
                src={`/api/sliders/media/${slide.image}`}
                alt={slide.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1920&h=1080&fit=crop';
                }}
              />
              {/* Overlay con degradado oficial */}
              <div 
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, rgba(132, 188, 40, 0.85) 0%, rgba(15, 102, 167, 0.75) 10%, rgba(96, 71, 150, 0.7) 25%, rgba(171, 48, 126, 0.75) 45%, rgba(212, 48, 112, 0.8) 65%, rgba(228, 51, 103, 0.85) 85%, rgba(231, 22, 100, 0.9) 100%)'
                }}
              />
            </div>

            {/* Content */}
            <div className="relative h-full w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 flex items-center">
              <div className="max-w-3xl">
                {/* Título con animación */}
                <h1
                  className={`text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight transform transition-all duration-1000 delay-300 ${
                    index === currentSlide
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                  style={{ textShadow: '2px 4px 8px rgba(0,0,0,0.3)' }}
                >
                  {slide.name || 'Logística que llega más lejos'}
                </h1>

                {/* Subtítulo */}
                {slide.button_text && (
                  <p
                    className={`text-xl md:text-2xl text-white/95 mb-4 font-medium transform transition-all duration-1000 delay-500 ${
                      index === currentSlide
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0'
                    }`}
                    style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.3)' }}
                  >
                    {slide.button_text}
                  </p>
                )}

                {/* Descripción */}
                {slide.description && (
                  <p
                    className={`text-lg md:text-xl text-white/90 mb-8 leading-relaxed max-w-2xl transform transition-all duration-1000 delay-700 ${
                      index === currentSlide
                        ? 'translate-y-0 opacity-100'
                        : 'translate-y-8 opacity-0'
                    }`}
                    style={{ textShadow: '1px 2px 4px rgba(0,0,0,0.2)' }}
                  >
                    {slide.description}
                  </p>
                )}

                {/* Botones CTA */}
                <div
                  className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-900 ${
                    index === currentSlide
                      ? 'translate-y-0 opacity-100'
                      : 'translate-y-8 opacity-0'
                  }`}
                >
                  <button
                    onClick={() => scrollToSection('cotizacion')}
                    className="bg-white text-hd-cerise px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-white/20"
                  >
                    Solicitar Cotización
                  </button>
                  <button
                    onClick={() => scrollToSection('servicios')}
                    className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white/30 transition-all duration-300 border-2 border-white/40 shadow-xl"
                  >
                    Ver Servicios
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      {sliders.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all duration-300 group hover:scale-110"
            aria-label="Slide anterior"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <button
            onClick={handleNext}
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 backdrop-blur-md text-white p-3 md:p-4 rounded-full transition-all duration-300 group hover:scale-110"
            aria-label="Siguiente slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </>
      )}

      {/* Dots Indicator */}
      {sliders.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-3">
          {sliders.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-500 rounded-full ${
                index === currentSlide
                  ? 'w-12 h-3 bg-white'
                  : 'w-3 h-3 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Ir a slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 z-20 hidden md:block animate-bounce">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center p-2">
          <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
