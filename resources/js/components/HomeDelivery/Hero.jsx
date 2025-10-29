import React from 'react';

const Hero = () => {
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

  return (
    <section 
      className="relative pt-32 pb-20 overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #84BC28 0%, #0F66A7 10%, #604796 25%, #AB307E 45%, #D43070 65%, #E43367 85%, #E71664 100%)'
      }}
    >
      {/* Decoración de fondo con opacidad reducida */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Contenido izquierdo */}
          <div className="text-white space-y-6 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight drop-shadow-lg">
              Logística que llega{' '}
              <span className="text-white drop-shadow-[0_2px_8px_rgba(255,255,255,0.3)]">más lejos</span>
            </h1>
            
            <p className="text-lg md:text-xl text-white/90 leading-relaxed drop-shadow-md">
              Soluciones integrales de distribución y logística para hacer crecer tu negocio.
              Conectamos tu empresa con todo el Perú.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => scrollToSection('cotizacion')}
                className="bg-white text-hd-cerise px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-hd-cerise text-center"
              >
                Solicitar cotización
              </button>
              <button
                onClick={() => scrollToSection('servicios')}
                className="bg-white/20 backdrop-blur-md text-white px-8 py-4 rounded-lg hover:bg-white/30 transition-all duration-300 font-semibold border-2 border-white/40 shadow-xl hover:shadow-2xl focus:ring-2 focus:ring-white text-center"
              >
                Ver servicios
              </button>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">8+</div>
                <div className="text-sm text-white/80 mt-1">Almacenes en provincia</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">24/7</div>
                <div className="text-sm text-white/80 mt-1">Atención continua</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-white drop-shadow-lg">100%</div>
                <div className="text-sm text-white/80 mt-1">Rastreabilidad</div>
              </div>
            </div>
          </div>

          {/* Imagen/Ilustración derecha */}
          <div className="relative hidden md:block animate-float">
            <div className="relative">
              {/* Placeholder para imagen de logística */}
              <div className="bg-gradient-to-br from-hd-green/20 to-hd-blue/20 rounded-2xl p-12 backdrop-blur-sm border border-white/10">
                <svg
                  className="w-full h-auto"
                  viewBox="0 0 400 300"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  {/* Camión de reparto */}
                  <rect x="50" y="150" width="200" height="100" rx="8" fill="#8FBD44" opacity="0.8" />
                  <rect x="50" y="120" width="120" height="30" rx="4" fill="#8FBD44" />
                  <circle cx="100" cy="260" r="20" fill="#33393F" />
                  <circle cx="100" cy="260" r="12" fill="#969798" />
                  <circle cx="200" cy="260" r="20" fill="#33393F" />
                  <circle cx="200" cy="260" r="12" fill="#969798" />
                  
                  {/* Paquetes */}
                  <rect x="280" y="160" width="60" height="60" rx="4" fill="#2354B8" opacity="0.6" />
                  <rect x="300" y="100" width="60" height="60" rx="4" fill="#DE3464" opacity="0.6" />
                  
                  {/* Líneas de movimiento */}
                  <path d="M 20 180 Q 30 180 35 185" stroke="#8FBD44" strokeWidth="3" opacity="0.4" />
                  <path d="M 20 200 Q 30 200 35 205" stroke="#8FBD44" strokeWidth="3" opacity="0.4" />
                  <path d="M 20 220 Q 30 220 35 225" stroke="#8FBD44" strokeWidth="3" opacity="0.4" />
                </svg>
              </div>

              {/* Elementos flotantes decorativos */}
              <div className="absolute -top-6 -right-6 bg-hd-green/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-hd-green/30 animate-bounce-slow">
                <div className="text-sm text-white font-medium">Entrega Rápida</div>
              </div>
              <div className="absolute -bottom-6 -left-6 bg-hd-blue/20 backdrop-blur-sm px-4 py-2 rounded-lg border border-hd-blue/30 animate-bounce-slow" style={{ animationDelay: '1s' }}>
                <div className="text-sm text-white font-medium">Seguro Incluido</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
