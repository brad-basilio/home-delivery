import React, { useState, useEffect } from 'react';
import { Phone, Shield, CheckCircle, ChevronLeft, ChevronRight } from 'lucide-react';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      image: "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Protege tu Propiedad con un",
      highlight: "Abogado Inmobiliario Experto",
      subtitle: "¿Problemas con terrenos, casas o contratos de compraventa?",
      description: "Evita juicios largos, estafas y pérdida de tu inversión."
    },
    {
      id: 2,
      image: "https://images.pexels.com/photos/7876050/pexels-photo-7876050.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Especialistas en",
      highlight: "Derecho Inmobiliario",
      subtitle: "Más de 15 años protegiendo tu patrimonio",
      description: "Asesoría legal integral para todas tus necesidades inmobiliarias."
    },
    {
      id: 3,
      image: "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080",
      title: "Consulta Gratuita",
      highlight: "Sin Compromiso",
      subtitle: "Evaluamos tu caso sin costo alguno",
      description: "Obtén asesoría profesional y conoce tus opciones legales."
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);

    return () => clearInterval(timer);
  }, [slides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section id="inicio" className="relative pt-20 min-h-screen overflow-hidden">
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
            index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-105'
          }`}
        >
          {/* Background Image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${slide.image})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
          </div>

          {/* Content */}
          <div className="relative z-10 flex items-center min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <div className="space-y-8">
                  <div className="space-y-4">
                    <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight transform transition-all duration-1000 delay-300 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {slide.title}{' '}
                      <span className="text-blue-400">{slide.highlight}</span>
                    </h1>
                    
                    <h2 className={`text-xl md:text-2xl text-blue-100 font-medium transform transition-all duration-1000 delay-500 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {slide.subtitle}
                    </h2>
                    
                    <p className={`text-lg text-gray-200 transform transition-all duration-1000 delay-700 ${
                      index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                    }`}>
                      {slide.description}
                    </p>
                  </div>

                  {/* Benefits */}
                  <div className={`space-y-3 transform transition-all duration-1000 delay-900 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-200">Más de 15 años de experiencia</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-200">Especialistas en derecho inmobiliario</span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400" />
                      <span className="text-gray-200">Consulta inicial gratuita</span>
                    </div>
                  </div>

                  {/* CTA Buttons */}
                  <div className={`flex flex-col sm:flex-row gap-4 transform transition-all duration-1000 delay-1100 ${
                    index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                  }`}>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2">
                      <Phone className="h-5 w-5" />
                      <span>Consulta Gratuita</span>
                    </button>
                    <button className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300">
                      Ver Servicios
                    </button>
                  </div>
                </div>

                {/* Visual Element */}
                <div className={`relative transform transition-all duration-1000 delay-1300 ${
                  index === currentSlide ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'
                }`}>
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl p-8 border border-white/20">
                    <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-8 text-white">
                      <Shield className="h-16 w-16 mb-4" />
                      <h3 className="text-2xl font-bold mb-2">Protección Legal Total</h3>
                      <p className="text-blue-100">
                        Defendemos tus derechos de propiedad con la máxima dedicación y profesionalismo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-20"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all duration-300 z-20"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Dots Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide ? 'bg-white scale-125' : 'bg-white/50 hover:bg-white/75'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 right-8 animate-bounce z-20">
        <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/50 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;