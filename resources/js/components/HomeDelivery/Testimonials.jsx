import React, { useState, useEffect } from 'react';

/**
 * Testimonials - Sección de Testimonios de Clientes
 * Swiper que muestra 2 testimonios en desktop y 1 en mobile
 * Responsive: 2xl:max-w-7xl 2xl:px-0, menor a 2xl usa px-[5%]
 */
const Testimonials = ({ testimonies = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [itemsPerSlide, setItemsPerSlide] = useState(2);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerSlide(window.innerWidth >= 768 ? 2 : 1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Auto-advance cada 6 segundos
  useEffect(() => {
    if (testimonies.length <= itemsPerSlide) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 6000);

    return () => clearInterval(interval);
  }, [currentSlide, testimonies.length, itemsPerSlide]);

  if (!testimonies || testimonies.length === 0) {
    return null;
  }

  const totalSlides = Math.ceil(testimonies.length / itemsPerSlide);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const getVisibleTestimonies = () => {
    const start = currentSlide * itemsPerSlide;
    return testimonies.slice(start, start + itemsPerSlide);
  };

  return (
    <section className="py-20 md:py-24 bg-white relative overflow-hidden">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-hd-android rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-hd-cerise rounded-full blur-3xl" />
      </div>

      <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <div 
            className="inline-block px-6 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
            }}
          >
            <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Testimonios</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Lo que dicen nuestros{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
              }}
            >
              Clientes
            </span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Historias de éxito de empresas que confían en nosotros
          </p>
        </div>

        {/* Swiper de Testimonios */}
        <div className="relative max-w-6xl mx-auto mb-12">
          {/* Testimonios Container */}
          <div className="overflow-hidden">
            <div className="grid md:grid-cols-2 gap-8">
              {getVisibleTestimonies().map((testimony, index) => (
                <div
                  key={testimony.id}
                  className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-hd-cerise/20 group"
                  style={{
                    animation: `fadeInScale 0.6s ease-out ${index * 0.15}s both`
                  }}
                >
                  {/* Quote Icon */}
                  <div className="mb-6">
                    <svg className="w-12 h-12 text-hd-cerise/20 group-hover:text-hd-cerise/40 transition-colors" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                    </svg>
                  </div>

                  {/* Testimonio */}
                  <p className="text-gray-700 mb-6 leading-relaxed text-base md:text-lg min-h-[120px]">
                    "{testimony.description}"
                  </p>

                  {/* Author Info */}
                  <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                    {testimony.image ? (
                      <img
                        src={`/api/testimony/media/${testimony.image}`}
                        alt={testimony.name}
                        className="w-14 h-14 rounded-full object-cover ring-2 ring-hd-cerise/20"
                        onError={(e) => {
                          const initial = testimony.name?.charAt(0) || 'C';
                          e.target.outerHTML = `<div class="w-14 h-14 rounded-full bg-gradient-to-br from-hd-cerise to-hd-android flex items-center justify-center text-white font-bold text-xl ring-2 ring-hd-cerise/20">${initial}</div>`;
                        }}
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-hd-cerise to-hd-android flex items-center justify-center text-white font-bold text-xl ring-2 ring-hd-cerise/20">
                        {testimony.name?.charAt(0) || 'C'}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="font-bold text-gray-900 text-lg">{testimony.name}</p>
                      <p className="text-sm text-gray-500">{testimony.correlative || testimony.case || 'Cliente'}</p>
                    </div>

                    {/* Rating Stars - Inline */}
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-4 h-4 text-yellow-400"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Controles de navegación */}
          {testimonies.length > itemsPerSlide && (
            <>
              {/* Botones Previous/Next */}
              <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-700 hover:text-hd-cerise hover:bg-hd-cerise/10 transition-all duration-300 z-10 group"
                aria-label="Anterior"
              >
                <svg className="w-6 h-6 transform group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </button>

              <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 bg-white shadow-xl rounded-full flex items-center justify-center text-gray-700 hover:text-hd-cerise hover:bg-hd-cerise/10 transition-all duration-300 z-10 group"
                aria-label="Siguiente"
              >
                <svg className="w-6 h-6 transform group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Indicadores de slides */}
        {testimonies.length > itemsPerSlide && (
          <div className="flex items-center justify-center gap-3">
            <div className="flex gap-2">
              {[...Array(totalSlides)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? 'w-12 bg-gradient-to-r from-hd-cerise to-hd-android shadow-lg'
                      : 'w-2 bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>
            
            <div className="text-sm font-semibold text-gray-500 ml-2">
              {currentSlide + 1} / {totalSlides}
            </div>
          </div>
        )}
      </div>

      {/* Animación CSS */}
      <style jsx>{`
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </section>
  );
};

export default Testimonials;
