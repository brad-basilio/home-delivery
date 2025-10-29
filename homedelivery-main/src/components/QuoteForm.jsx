import { useState } from 'react';

const QuoteForm = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    correo: '',
    celular: '',
    rubro: '',
    cantidadEnvios: '',
    frecuencia: 'mensual',
    ciudad: '',
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

    if (!formData.ciudad) {
      newErrors.ciudad = 'Debes seleccionar una ciudad';
    }

    if (formData.cantidadEnvios && formData.cantidadEnvios < 0) {
      newErrors.cantidadEnvios = 'La cantidad debe ser mayor o igual a 0';
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
      console.log('Datos de cotización:', formData);

      setTimeout(() => {
        setStatus('success');
        setFormData({
          nombre: '',
          empresa: '',
          correo: '',
          celular: '',
          rubro: '',
          cantidadEnvios: '',
          frecuencia: 'mensual',
          ciudad: '',
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
    <section id="cotizacion" className="py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl sm:text-5xl font-bold text-brand-onyx mb-4">
              Solicita tu Cotización
            </h2>
            <p className="text-xl text-brand-gray font-light">
              Completa el formulario y nos contactaremos contigo
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="nombre"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Nombre *
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.nombre ? 'true' : 'false'}
                  aria-describedby={errors.nombre ? 'nombre-error' : undefined}
                />
                {errors.nombre && (
                  <p id="nombre-error" className="text-brand-cerise text-sm mt-1">
                    {errors.nombre}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="empresa"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Empresa *
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.empresa ? 'true' : 'false'}
                  aria-describedby={errors.empresa ? 'empresa-error' : undefined}
                />
                {errors.empresa && (
                  <p id="empresa-error" className="text-brand-cerise text-sm mt-1">
                    {errors.empresa}
                  </p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="correo"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Correo Electrónico *
                </label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.correo ? 'true' : 'false'}
                  aria-describedby={errors.correo ? 'correo-error' : undefined}
                />
                {errors.correo && (
                  <p id="correo-error" className="text-brand-cerise text-sm mt-1">
                    {errors.correo}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="celular"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Celular *
                </label>
                <input
                  type="tel"
                  id="celular"
                  name="celular"
                  value={formData.celular}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.celular ? 'true' : 'false'}
                  aria-describedby={errors.celular ? 'celular-error' : undefined}
                />
                {errors.celular && (
                  <p id="celular-error" className="text-brand-cerise text-sm mt-1">
                    {errors.celular}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="rubro"
                className="block text-brand-onyx font-medium mb-2"
              >
                Rubro
              </label>
              <input
                type="text"
                id="rubro"
                name="rubro"
                value={formData.rubro}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                placeholder="Ej: E-commerce, Retail, Farmacéutico"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="cantidadEnvios"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Cantidad de Envíos
                </label>
                <input
                  type="number"
                  id="cantidadEnvios"
                  name="cantidadEnvios"
                  value={formData.cantidadEnvios}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                  aria-invalid={errors.cantidadEnvios ? 'true' : 'false'}
                  aria-describedby={
                    errors.cantidadEnvios ? 'cantidadEnvios-error' : undefined
                  }
                />
                {errors.cantidadEnvios && (
                  <p
                    id="cantidadEnvios-error"
                    className="text-brand-cerise text-sm mt-1"
                  >
                    {errors.cantidadEnvios}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="frecuencia"
                  className="block text-brand-onyx font-medium mb-2"
                >
                  Frecuencia
                </label>
                <select
                  id="frecuencia"
                  name="frecuencia"
                  value={formData.frecuencia}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
            </div>

            <div>
              <label
                htmlFor="ciudad"
                className="block text-brand-onyx font-medium mb-2"
              >
                Ciudad *
              </label>
              <select
                id="ciudad"
                name="ciudad"
                value={formData.ciudad}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-green focus:border-transparent transition-all duration-200"
                aria-invalid={errors.ciudad ? 'true' : 'false'}
                aria-describedby={errors.ciudad ? 'ciudad-error' : undefined}
              >
                <option value="">Selecciona una opción</option>
                <option value="lima">Lima</option>
                <option value="provincia">Provincia</option>
              </select>
              {errors.ciudad && (
                <p id="ciudad-error" className="text-brand-cerise text-sm mt-1">
                  {errors.ciudad}
                </p>
              )}
            </div>

            <p className="text-sm text-brand-gray">
              Al enviar este formulario, aceptas que nos comuniquemos contigo
              para brindarte información sobre nuestros servicios.
            </p>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-brand-green text-white px-8 py-4 rounded-lg hover:bg-opacity-90 transition-all duration-200 font-medium text-lg focus:ring-2 focus:ring-brand-green focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? 'Enviando...' : 'Solicitar cotización'}
            </button>

            {status === 'success' && (
              <div className="bg-brand-green bg-opacity-10 border border-brand-green text-brand-green px-4 py-3 rounded-lg">
                Gracias, te contactaremos pronto.
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

export default QuoteForm;
