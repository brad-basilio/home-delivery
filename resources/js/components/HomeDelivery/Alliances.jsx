import React, { useState, useEffect, useRef } from 'react';

/**
 * Alliances - Slider infinito de alianzas comerciales
 * Auto-scroll con React state
 */
const Alliances = ({ alliances = [] }) => {
  const [translateX, setTranslateX] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!alliances || alliances.length === 0) return;

    const interval = setInterval(() => {
      if (isPaused) return;
      
      setTranslateX(prev => {
        // Calcular el ancho de la mitad del track (primera copia de alianzas)
        if (trackRef.current) {
          const trackWidth = trackRef.current.scrollWidth;
          const halfWidth = trackWidth / 2;
          
          // Si llegamos a la mitad, reiniciamos sin transición
          if (Math.abs(prev) >= halfWidth) {
            return 0;
          }
        }
        return prev - 1; // Mover 1px cada intervalo
      });
    }, 20); // Cada 20ms = 50fps

    return () => clearInterval(interval);
  }, [alliances, isPaused]);

  if (!alliances || alliances.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-20  bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 mb-12">
        {/* Header */}
        <div className="text-center">
          <div 
            className="inline-block px-6 py-2 rounded-full mb-6"
            style={{
              background: 'linear-gradient(90deg, rgba(143, 189, 68, 0.1) 0%, rgba(35, 84, 184, 0.1) 50%, rgba(222, 52, 100, 0.1) 100%)'
            }}
          >
            <span className="text-hd-cerulean font-bold text-sm uppercase tracking-wider">Nuestros Aliados</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-gray-900 mb-4">
            Alianzas{' '}
            <span 
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: 'linear-gradient(135deg, #8FBD44 0%, #2354B8 50%, #DE3464 100%)'
              }}
            >
              Comerciales
            </span>
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Trabajamos con las mejores empresas para brindarte un servicio de excelencia
          </p>
        </div>
      </div>

      {/* Marquee infinito */}
      <div className="relative">
        {/* Gradientes de fade en los bordes */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-gray-50 to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-gray-50 to-transparent z-10 pointer-events-none" />

        <div 
          ref={containerRef}
          className="overflow-hidden"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <div 
            ref={trackRef}
            className="flex gap-16"
            style={{
              transform: `translateX(${translateX}px)`,
              width: 'max-content'
            }}
          >
            {/* Primera copia */}
            {alliances.map((alliance) => (
              <a
                key={`a-${alliance.id}`}
                href={alliance.website || '#'}
                target={alliance.website ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex-shrink-0 h-32 flex items-center group"
                onClick={(e) => !alliance.website && e.preventDefault()}
              >
                <img
                  src={`/api/alliance/media/${alliance.image}`}
                  alt={alliance.name}
                  className="h-24 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/lte/images/placeholder.png';
                  }}
                />
              </a>
            ))}
            {/* Segunda copia para loop infinito */}
            {alliances.map((alliance) => (
              <a
                key={`b-${alliance.id}`}
                href={alliance.website || '#'}
                target={alliance.website ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex-shrink-0 h-32 flex items-center group"
                onClick={(e) => !alliance.website && e.preventDefault()}
              >
                <img
                  src={`/api/alliance/media/${alliance.image}`}
                  alt={alliance.name}
                  className="h-24 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/lte/images/placeholder.png';
                  }}
                />
              </a>
            ))}
               {alliances.map((alliance) => (
              <a
                key={`b-${alliance.id}`}
                href={alliance.website || '#'}
                target={alliance.website ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="flex-shrink-0 h-32 flex items-center group"
                onClick={(e) => !alliance.website && e.preventDefault()}
              >
                <img
                  src={`/api/alliance/media/${alliance.image}`}
                  alt={alliance.name}
                  className="h-24 w-auto object-contain group-hover:scale-110 transition-transform duration-300"
                  onError={(e) => {
                    e.target.src = '/lte/images/placeholder.png';
                  }}
                />
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Alliances;
