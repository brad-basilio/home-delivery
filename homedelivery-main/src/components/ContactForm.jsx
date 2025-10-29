import { useState } from 'react';

const ContactForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    celular: '',
    mensaje: '',
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle');

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    }

    if (!formData.empresa.trim()) {
      newErrors.empresa = 'La empresa es requerida';
    }

    if (!formData.correo.trim()) {
      newErrors.correo = 'El correo es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.correo)) {
      newErrors.correo = 'El correo no es válido';
    }

    if (!formData.celular.trim()) {
      newErrors.celular = 'El celular es requerido';
    } else if (formData.celular.length < 9) {
      newErrors.celular = 'El celular debe tener al menos 9 dígitos';
    }

    if (!formData.mensaje.trim()) {
      newErrors.mensaje = 'El mensaje es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setStatus('loading');

    try {
      console.log('Datos de contacto:', formData);

      setTimeout(() => {
        setStatus('success');
        setFormData({
          nombre: '',
          empresa: '',
          correo: '',
          celular: '',
          mensaje: '',
        });
        setTimeout(() => setStatus('idle'), 5000);
      }, 1000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <section id="contacto" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-brand-onyx mb-4">
              Contáctanos
            </h2>
            <p className="text-xl text-brand-gray font-light">
              Estamos aquí para ayudarte
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contacto-nombre"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Nombre *
                </label>
                <input
                  type="text"
                  id="contacto-nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.nombre ? 'true' : 'false'}
                  aria-describedby={
                    errors.nombre ? 'contacto-nombre-error' : undefined
                  }
                />
                {errors.nombre && (
                  <p
                    id="contacto-nombre-error"
                    className="text-brand-cerise text-sm mt-1"
                  >
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contacto-empresa"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Empresa *
                </label>
                <input
                  type="text"
                  id="contacto-empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.empresa ? 'true' : 'false'}
                  aria-describedby={
                    errors.empresa ? 'contacto-empresa-error' : undefined
                  }
                />
                {errors.empresa && (
                  <p
                    id="contacto-empresa-error"
                    className="text-brand-cerise text-sm mt-1"
                  >
                    {errors.empresa}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="contacto-correo"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="contacto-correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.correo ? 'true' : 'false'}
                  aria-describedby={
                    errors.correo ? 'contacto-correo-error' : undefined
                  }
                />
                {errors.correo && (
                  <p
                    id="contacto-correo-error"
                    className="text-brand-cerise text-sm mt-1"
                  >
                    {errors.correo}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="contacto-celular"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Celular *
                </label>
                <input
                  type="tel"
                  id="contacto-celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.celular ? 'true' : 'false'}
                  aria-describedby={
                    errors.celular ? 'contacto-celular-error' : undefined
                  }
                />
                {errors.celular && (
                  <p
                    id="contacto-celular-error"
                    className="text-brand-cerise text-sm mt-1"
                  >
                    {errors.celular}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="contacto-mensaje"
                className="block text-brand-onyx font-medium mb-2"
              >
                Mensaje *
              </label>
              <textarea
                id="contacto-mensaje"
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="5"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:border-transparent transition-all duration-200 resize-none"
                aria-invalid={errors.mensaje ? 'true' : 'false'}
                aria-describedby={
                  errors.mensaje ? 'contacto-mensaje-error' : undefined
                }
              ></textarea>
              {errors.mensaje && (
                <p
                  id="contacto-mensaje-error"
                  className="text-brand-cerise text-sm mt-1"
                >
                  {errors.mensaje}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-brand-blue text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium text-lg focus:ring-2 focus:ring-brand-blue focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Enviando...' : 'Enviar mensaje'}
            </button>

            {status === 'success' && (
              <div className="bg-brand-green bg-opacity-10 border border-brand-green text-brand-green px-4 py-3 rounded-lg">
                Gracias por tu mensaje. Te responderemos pronto.
              </div>
            )}

            {status === 'error' && (
              <div className="bg-brand-cerise bg-opacity-10 border border-brand-cerise text-brand-cerise px-4 py-3 rounded-lg">
                Hubo un error. Por favor, intenta nuevamente.
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactForm;
