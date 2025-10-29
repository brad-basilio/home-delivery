# Home Delivery Logistics - Landing Page

Landing page moderna y responsiva para Home Delivery Logistics, empresa dedicada a servicios logísticos integrales.

## 📋 Características

- ✅ Diseño responsive mobile-first
- ✅ Paleta de colores oficial del Manual de Marca
- ✅ Logo con degradado oficial (60% Verde, 40% Spanish Gray)
- ✅ Tipografía Aeonik (Light, Regular, Medium, Bold)
- ✅ Componentes reutilizables en React
- ✅ Animaciones suaves y profesionales
- ✅ Formulario de cotización con validación
- ✅ Integración con WhatsApp
- ✅ SEO optimizado
- ✅ Accesibilidad AA

## 🎨 Identidad Visual

### Colores Oficiales (Manual de Marca)

- **Onyx**: `#33393F` - Color principal oscuro
- **Android Green**: `#8FBD44` - Color principal verde
- **Spanish Gray**: `#969798` - Color neutro
- **Cerulean Blue**: `#2354B8` - Color acento azul
- **Cerise**: `#DE3464` - Color acento rosa

### Tipografía

- **Familia**: Aeonik
- **Variantes**: Light (300), Regular (400), Medium (500), Bold (700)

## 📁 Estructura del Proyecto

```
resources/js/components/HomeDelivery/
├── HomeDeliveryPage.jsx    # Página principal (integra todos los componentes)
├── Header.jsx               # Header sticky con navegación
├── Hero.jsx                 # Hero section con eslogan
├── Logo.jsx                 # Logo con degradado oficial
├── Services.jsx             # Sección de servicios
├── ServiceCard.jsx          # Card de servicio (reutilizable)
├── Benefits.jsx             # Sección de beneficios
├── BenefitCard.jsx          # Card de beneficio (reutilizable)
├── QuoteForm.jsx            # Formulario de cotización
├── Locations.jsx            # Sección de ubicaciones
├── Footer.jsx               # Footer con redes sociales
└── WhatsAppButton.jsx       # Botón flotante de WhatsApp
```

## 🚀 Uso

### Importar y usar la página completa:

```jsx
import HomeDeliveryPage from './components/HomeDelivery/HomeDeliveryPage';

// Usar en tu router o app
<HomeDeliveryPage />
```

### Usar componentes individuales:

```jsx
import Header from './components/HomeDelivery/Header';
import Hero from './components/HomeDelivery/Hero';
import Services from './components/HomeDelivery/Services';
// ... etc

function MiPagina() {
  return (
    <>
      <Header />
      <Hero />
      <Services />
      {/* ... */}
    </>
  );
}
```

## 📦 Servicios Incluidos

1. **Distribución de Última Milla** - Entrega directa al cliente final
2. **Logística Inversa** - Gestión de devoluciones
3. **Distribución a Puntos de Venta** - Abastecimiento de tiendas
4. **Same Day Delivery** - Entrega el mismo día
5. **Retiro en Puntos Mall Plaza** - Red de puntos estratégicos

## 💡 Beneficios Destacados

1. **Integración API** - Automatización de procesos
2. **Evidencia Digital** - Fotografías y firma digital
3. **Tracking en Línea** - Seguimiento en tiempo real
4. **Seguro Incluido** - Cobertura completa

## 📍 Ubicaciones

- **Oficina Principal**: Av. Paseo de la República 3220, San Isidro 15046
- **Centro Logístico**: Villa El Salvador, Lima
- **8 Almacenes en Provincia**: Arequipa, Cusco, Trujillo, Chiclayo, Piura, Ica, Huancayo, Pucallpa

## 📞 Contacto

- **Teléfono/WhatsApp**: 933 411 599
- **Redes Sociales**: Facebook | Instagram

## 🎯 Funcionalidades del Formulario

El formulario de cotización incluye validación de:
- Nombre completo (requerido)
- Empresa (requerido)
- Correo electrónico (formato válido)
- Celular (9 dígitos)
- Rubro de negocio (requerido)
- Cantidad de envíos (diarios o mensuales)
- Zona de operación (Lima, Provincia, ambos)

## 🔧 Tailwind Configuration

Los colores ya están configurados en `tailwind.config.js`:

```javascript
colors: {
  'hd-onyx': '#33393F',
  'hd-green': '#8FBD44',
  'hd-gray': '#969798',
  'hd-blue': '#2354B8',
  'hd-cerise': '#DE3464',
}
```

## ⚡ Optimizaciones

- Lazy loading de imágenes
- Animaciones con `@keyframes` optimizadas
- CSS scoped por componente
- Bundle splitting automático
- Prefetch de recursos críticos

## 📱 Responsive Design

- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

## ♿ Accesibilidad

- Contraste AA (WCAG 2.1)
- Focus states visibles
- Atributos ARIA en elementos interactivos
- Navegación por teclado completa
- Textos alternativos en imágenes/íconos

## 📈 SEO

- Meta tags optimizados
- Títulos descriptivos (H1, H2, H3)
- Estructura semántica HTML5
- Open Graph tags preparados
- Schema.org markup ready

## 🛠️ Personalización

### Cambiar colores:

Edita `tailwind.config.js` y actualiza los valores de los colores oficiales.

### Cambiar contenido:

Los textos están hardcodeados en cada componente. Puedes extraerlos a un archivo de constantes o usar i18n.

### Agregar servicios:

Edita el array `services` en `Services.jsx`.

## 📝 Notas Importantes

- ⚠️ El formulario actualmente solo hace `console.log()`. Debes conectarlo a tu backend/API.
- ⚠️ Las fuentes Aeonik deben estar en `/public/fonts/` para que funcionen correctamente.
- ⚠️ Actualiza los enlaces de redes sociales en `Footer.jsx`.

## 🚦 Estado del Proyecto

✅ Diseño completado
✅ Componentes implementados
✅ Responsive design
✅ Accesibilidad
⏳ Integración con backend (pendiente)
⏳ Tests unitarios (pendiente)

## 📄 Licencia

Proyecto propietario de Home Delivery Logistics.

---

**Desarrollado con ❤️ para Home Delivery Logistics**
