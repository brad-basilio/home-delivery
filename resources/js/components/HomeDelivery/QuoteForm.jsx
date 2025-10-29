import React, { useState } from 'react';

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    celular: '',
    rubro: '',
    enviosDiarios: '',
    enviosMensuales: '',
    zona: 'Lima'
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // 'success' | 'error' | null

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Limpiar error del campo al escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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
    } else if (!/^\d{9}$/.test(formData.celular)) {
      newErrors.celular = 'El celular debe tener 9 dígitos';
    }

    if (!formData.rubro.trim()) {
      newErrors.rubro = 'El rubro es requerido';
    }

    if (!formData.enviosDiarios && !formData.enviosMensuales) {
      newErrors.envios = 'Debe indicar cantidad de envíos diarios o mensuales';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Simular envío (aquí iría la llamada a tu API)
      console.log('Datos del formulario:', formData);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSubmitStatus('success');
      // Limpiar formulario
      setFormData({
        nombre: '',
        empresa: '',
        correo: '',
        celular: '',
        rubro: '',
        enviosDiarios: '',
        enviosMensuales: '',
        zona: 'Lima'
      });
    } catch (error) {
      console.error('Error al enviar formulario:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="cotizacion" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-hd-onyx mb-4">
              Solicita tu Cotización
            </h2>
            <p className="text-lg text-hd-gray">
              Completa el formulario y nos pondremos en contacto contigo en menos de 24 horas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8 shadow-lg">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Nombre */}
              <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-hd-onyx mb-2">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.nombre ? 'border-hd-cerise' : 'border-gray-300'} focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200`}
                  placeholder="Juan Pérez"
                />
                {errors.nombre && <p className="text-hd-cerise text-sm mt-1">{errors.nombre}</p>}
              </div>

              {/* Empresa */}
              <div>
                <label htmlFor="empresa" className="block text-sm font-medium text-hd-onyx mb-2">
                  Empresa *
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.empresa ? 'border-hd-cerise' : 'border-gray-300'} focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200`}
                  placeholder="Mi Empresa SAC"
                />
                {errors.empresa && <p className="text-hd-cerise text-sm mt-1">{errors.empresa}</p>}
              </div>

              {/* Correo */}
              <div>
                <label htmlFor="correo" className="block text-sm font-medium text-hd-onyx mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.correo ? 'border-hd-cerise' : 'border-gray-300'} focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200`}
                  placeholder="correo@empresa.com"
                />
                {errors.correo && <p className="text-hd-cerise text-sm mt-1">{errors.correo}</p>}
              </div>

              {/* Celular */}
              <div>
                <label htmlFor="celular" className="block text-sm font-medium text-hd-onyx mb-2">
                  Celular *
                </label>
                <input
                  type="tel"
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.celular ? 'border-hd-cerise' : 'border-gray-300'} focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200`}
                  placeholder="999999999"
                  maxLength="9"
                />
                {errors.celular && <p className="text-hd-cerise text-sm mt-1">{errors.celular}</p>}
              </div>

              {/* Rubro */}
              <div>
                <label htmlFor="rubro" className="block text-sm font-medium text-hd-onyx mb-2">
                  Rubro de negocio *
                </label>
                <input
                  type="text"
                  id="rubro"
                  name="rubro"
                  value={formData.rubro}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 rounded-lg border ${errors.rubro ? 'border-hd-cerise' : 'border-gray-300'} focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200`}
                  placeholder="Ej: E-commerce, Retail, Farmacia"
                />
                {errors.rubro && <p className="text-hd-cerise text-sm mt-1">{errors.rubro}</p>}
              </div>

              {/* Zona */}
              <div>
                <label htmlFor="zona" className="block text-sm font-medium text-hd-onyx mb-2">
                  Zona de operación *
                </label>
                <select
                  id="zona"
                  name="zona"
                  value={formData.zona}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200"
                >
                  <option value="Lima">Lima</option>
                  <option value="Provincia">Provincia</option>
                  <option value="Lima y Provincia">Lima y Provincia</option>
                </select>
              </div>

              {/* Envíos diarios */}
              <div>
                <label htmlFor="enviosDiarios" className="block text-sm font-medium text-hd-onyx mb-2">
                  Envíos diarios (aprox.)
                </label>
                <input
                  type="number"
                  id="enviosDiarios"
                  name="enviosDiarios"
                  value={formData.enviosDiarios}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200"
                  placeholder="50"
                  min="0"
                />
              </div>

              {/* Envíos mensuales */}
              <div>
                <label htmlFor="enviosMensuales" className="block text-sm font-medium text-hd-onyx mb-2">
                  Envíos mensuales (aprox.)
                </label>
                <input
                  type="number"
                  id="enviosMensuales"
                  name="enviosMensuales"
                  value={formData.enviosMensuales}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-hd-green focus:border-transparent transition-all duration-200"
                  placeholder="1500"
                  min="0"
                />
                {errors.envios && <p className="text-hd-cerise text-sm mt-1">{errors.envios}</p>}
              </div>
            </div>

            {/* Botón submit */}
            <div className="mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-hd-green text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium shadow-lg hover:shadow-xl focus:ring-2 focus:ring-hd-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Enviando...' : 'Solicitar Cotización'}
              </button>
            </div>

            {/* Mensajes de estado */}
            {submitStatus === 'success' && (
              <div className="mt-4 p-4 bg-hd-green/10 border border-hd-green rounded-lg">
                <p className="text-hd-green text-center font-medium">
                  ¡Gracias! Tu solicitud ha sido enviada. Nos contactaremos contigo pronto.
                </p>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mt-4 p-4 bg-hd-cerise/10 border border-hd-cerise rounded-lg">
                <p className="text-hd-cerise text-center font-medium">
                  Hubo un error al enviar tu solicitud. Por favor, intenta nuevamente.
                </p>
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  );
};

export default QuoteForm;
