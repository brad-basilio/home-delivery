const Hero = () => {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-gray-50 to-white pt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-brand-onyx leading-tight">
              Logística que llega más lejos.
            </h1>
            <p className="text-xl sm:text-2xl text-brand-gray font-light leading-relaxed">
              Entregas seguras y puntuales con cobertura nacional y seguimiento
              en tiempo real.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={() => scrollToSection('cotizacion')}
                className="bg-brand-green text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium text-lg focus:ring-2 focus:ring-brand-green focus:ring-offset-2"
              >
                Solicitar cotización
              </button>
              <button
                onClick={() => scrollToSection('contacto')}
                className="border-2 border-brand-blue text-brand-blue px-8 py-4 rounded-lg hover:bg-brand-blue hover:text-white transition-all duration-200 font-medium text-lg focus:ring-2 focus:ring-brand-blue focus:ring-offset-2"
              >
                Contactar
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-0 bg-gradient-brand opacity-10 rounded-full blur-3xl"></div>
            <svg
              viewBox="0 0 400 400"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="relative w-full max-w-md mx-auto"
            >
              <defs>
                <radialGradient
                  id="heroGradient"
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

              <circle cx="200" cy="200" r="150" fill="url(#heroGradient)" />
              <circle cx="200" cy="200" r="100" fill="#FFFFFF" />
              <circle cx="280" cy="260" r="30" fill="#DE3464" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
