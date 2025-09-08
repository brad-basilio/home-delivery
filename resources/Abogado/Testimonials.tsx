import React, { useState, useEffect } from 'react';
import { Star, Quote, ChevronLeft, ChevronRight } from 'lucide-react';

const Testimonials = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: "María González",
      role: "Propietaria",
      image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Excelente servicio. Me ayudaron a resolver un problema de desalojo de manera rápida y profesional. Totalmente recomendados."
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      role: "Inversionista",
      image: "https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Gracias a su asesoría pude regularizar mi terreno sin complicaciones. Su experiencia en derecho inmobiliario es excepcional."
    },
    {
      id: 3,
      name: "Ana Martínez",
      role: "Compradora",
      image: "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Me acompañaron en todo el proceso de compra de mi casa. Su atención al detalle evitó que cayera en una estafa."
    },
    {
      id: 4,
      name: "Roberto Silva",
      role: "Empresario",
      image: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Profesionales de primer nivel. Resolvieron un juicio de propiedad que tenía años sin solución. Muy satisfecho con el resultado."
    },
    {
      id: 5,
      name: "Laura Fernández",
      role: "Arrendadora",
      image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Su asesoría en contratos de arrendamiento me ha ahorrado muchos problemas. Son muy detallistas y profesionales."
    },
    {
      id: 6,
      name: "Diego Morales",
      role: "Constructor",
      image: "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150",
      rating: 5,
      text: "Excelente trabajo en la regularización de varios terrenos para mi empresa constructora. Muy recomendados."
    }
  ];

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.ceil(testimonials.length / 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.ceil(testimonials.length / 2)) % Math.ceil(testimonials.length / 2));
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  // Get testimonials for current slide (2 per slide)
  const getCurrentTestimonials = () => {
    const startIndex = currentSlide * 2;
    return testimonials.slice(startIndex, startIndex + 2);
  };

  return (
    <section id="testimonios" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Lo que Dicen Nuestros Clientes
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            La satisfacción de nuestros clientes es nuestra mejor carta de presentación. 
            Conoce las experiencias de quienes han confiado en nosotros.
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Testimonials Grid */}
          <div className="overflow-hidden">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, slideIndex) => (
                <div key={slideIndex} className="w-full flex-shrink-0">
                  <div className="grid md:grid-cols-2 gap-8 px-4">
                    {testimonials.slice(slideIndex * 2, slideIndex * 2 + 2).map((testimonial) => (
                      <div
                        key={testimonial.id}
                        className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-8 relative transform hover:-translate-y-1"
                      >
                        {/* Quote Icon */}
                        <div className="absolute top-4 right-4">
                          <Quote className="h-8 w-8 text-blue-200" />
                        </div>

                        {/* Rating */}
                        <div className="flex items-center space-x-1 mb-4">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                          ))}
                        </div>

                        {/* Testimonial Text */}
                        <p className="text-gray-700 text-lg leading-relaxed mb-6 italic">
                          "{testimonial.text}"
                        </p>

                        {/* Client Info */}
                        <div className="flex items-center space-x-4">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                            <p className="text-gray-600 text-sm">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-4 bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            aria-label="Testimonio anterior"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          
          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-4 bg-white hover:bg-gray-50 text-gray-600 hover:text-blue-600 p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-10"
            aria-label="Siguiente testimonio"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-2 mt-8">
            {Array.from({ length: Math.ceil(testimonials.length / 2) }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-blue-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Ir al grupo de testimonios ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 mb-6">
            ¿Listo para ser nuestro próximo cliente satisfecho?
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
            Solicita tu Consulta Gratuita
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;