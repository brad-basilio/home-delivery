import React from 'react';

/**
 * Indicators - Sección de estadísticas/indicadores clave
 * Muestra los indicadores dinámicos desde la base de datos
 * Usa los colores oficiales de Home Delivery: Android Green, Cerise, Cerulean, Spanish Gray
 */
const Indicators = ({ indicators = [] }) => {
  if (!indicators || indicators.length === 0) {
    return null;
  }

  // Colores oficiales para alternar entre indicadores
  const colors = [
    {
      bg: 'bg-hd-android',
      text: 'text-white',
      icon: 'brightness-0 invert',
      hover: 'group-hover:bg-hd-android/90'
    },
    {
      bg: 'bg-hd-cerise',
      text: 'text-white',
      icon: 'brightness-0 invert',
      hover: 'group-hover:bg-hd-cerise/90'
    },
    {
      bg: 'bg-hd-cerulean',
      text: 'text-white',
      icon: 'brightness-0 invert',
      hover: 'group-hover:bg-hd-cerulean/90'
    },
    {
      bg: 'bg-hd-spanish',
      text: 'text-white',
      icon: 'brightness-0 invert',
      hover: 'group-hover:bg-hd-spanish/90'
    }
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden bg-gradient-to-br from-gray-50 to-white">
      {/* Decoración de fondo */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-10 right-10 w-72 h-72 bg-hd-android rounded-full blur-3xl" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-hd-cerise rounded-full blur-3xl" />
      </div>

      <div className="w-full 2xl:max-w-7xl mx-auto px-[5%] 2xl:px-0 relative z-10">
        {/* Grid de indicadores */}
        <div 
          className="grid gap-6 md:gap-8"
          style={{
            gridTemplateColumns: `repeat(auto-fit, minmax(250px, 1fr))`,
            maxWidth: indicators.length <= 2 ? '800px' : 'none',
            margin: indicators.length <= 2 ? '0 auto' : '0'
          }}
        >
          {indicators.map((indicator, index) => {
            const colorScheme = colors[index % colors.length];
            
            return (
              <div
                key={indicator.id}
                className={`group relative ${colorScheme.bg} rounded-3xl p-8 transition-all duration-500 hover:scale-105 hover:shadow-2xl cursor-default`}
                style={{
                  animationDelay: `${index * 150}ms`
                }}
              >
                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-3xl bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-500" />
                
                <div className="relative flex flex-col items-center text-center space-y-4">
                  {/* Ícono */}
                  <div className="relative">
                    <div className="absolute inset-0 bg-white/20 rounded-full blur-xl scale-150 group-hover:scale-175 transition-transform duration-500" />
                    <div className="relative bg-white/20 backdrop-blur-sm p-5 rounded-full border-2 border-white/30 group-hover:border-white/50 transition-all duration-500 group-hover:rotate-12">
                      <img
                        src={`/api/indicator/media/${indicator.symbol}`}
                        alt={indicator.name}
                        className={`w-14 h-14 md:w-16 md:h-16 object-contain filter ${colorScheme.icon} transition-transform duration-500 group-hover:scale-110`}
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  </div>

                  {/* Título */}
                  <div className={`text-3xl md:text-4xl lg:text-5xl font-bold ${colorScheme.text} leading-tight`}>
                    {indicator.name}
                  </div>

                  {/* Descripción */}
                  {indicator.description && (
                    <div className={`text-base md:text-lg ${colorScheme.text} opacity-95 leading-relaxed font-medium`}>
                      {indicator.description}
                    </div>
                  )}

                  {/* Línea decorativa */}
                  <div className="w-16 h-1 bg-white/40 rounded-full group-hover:w-24 transition-all duration-500" />
                </div>

                {/* Efecto de esquina */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-bl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-tr-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            );
          })}
        </div>

        {/* Gradiente decorativo inferior */}
        <div 
          className="mt-12 h-1 rounded-full"
          style={{
            background: 'linear-gradient(90deg, #8FBD44 0%, #2354B8 33%, #DE3464 66%, #969798 100%)'
          }}
        />
      </div>
    </section>
  );
};

export default Indicators;
