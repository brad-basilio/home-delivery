# 🚀 Guía de Instalación - Home Delivery Landing Page

## ✅ Checklist de Instalación

### 1. Archivos de Fuentes (CRÍTICO)

Descarga las fuentes **Aeonik** del manual de marca y colócalas en:

```
public/fonts/
├── Aeonik-Light.woff2
├── Aeonik-Regular.woff2
├── Aeonik-Medium.woff2
└── Aeonik-Bold.woff2
```

**Sin estas fuentes, la tipografía no funcionará correctamente.**

---

### 2. Importar el CSS

En tu archivo principal de la aplicación (ej: `app.jsx` o `app.js`), agrega:

```javascript
import '../css/homedelivery.css';
```

O si usas Laravel Mix/Vite, en `app.css`:

```css
@import './homedelivery.css';
```

---

### 3. Verificar Tailwind Config

Asegúrate de que `tailwind.config.js` incluya los colores personalizados:

```javascript
module.exports = {
  content: [
    "./resources/**/*.blade.php",
    "./resources/**/*.js",
    "./resources/**/*.jsx", // ← Asegúrate de incluir .jsx
  ],
  theme: {
    extend: {
      colors: {
        'hd-onyx': '#33393F',
        'hd-green': '#8FBD44',
        'hd-gray': '#969798',
        'hd-blue': '#2354B8',
        'hd-cerise': '#DE3464',
      },
    },
  },
};
```

---

### 4. Integrar en tu Aplicación

#### Opción A: Página Completa (Recomendado)

En tu archivo `Home.jsx` o el componente principal:

```javascript
import HomeDeliveryPage from './components/HomeDelivery/HomeDeliveryPage';

function App() {
  return <HomeDeliveryPage />;
}
```

#### Opción B: Componentes Individuales

```javascript
import Header from './components/HomeDelivery/Header';
import Hero from './components/HomeDelivery/Hero';
// ... resto de imports

function App() {
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

---

### 5. Configurar el Backend para el Formulario

En `QuoteForm.jsx`, actualiza la función `handleSubmit`:

```javascript
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;
  
  setIsSubmitting(true);
  
  try {
    // Reemplaza esto con tu endpoint real
    const response = await fetch('/api/cotizaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
      },
      body: JSON.stringify(formData),
    });

    if (response.ok) {
      alert('¡Gracias! Nos contactaremos contigo pronto.');
      setFormData({
        nombre: '',
        empresa: '',
        correo: '',
        celular: '',
        rubro: '',
        enviosDiarios: '',
        enviosMensuales: '',
        zona: '',
      });
    }
  } catch (error) {
    alert('Error al enviar. Intenta nuevamente.');
  } finally {
    setIsSubmitting(false);
  }
};
```

#### Crear la API en Laravel:

```php
// routes/api.php
Route::post('/cotizaciones', [CotizacionController::class, 'store']);

// app/Http/Controllers/CotizacionController.php
public function store(Request $request)
{
    $validated = $request->validate([
        'nombre' => 'required|string|max:255',
        'empresa' => 'required|string|max:255',
        'correo' => 'required|email',
        'celular' => 'required|digits:9',
        'rubro' => 'required|string',
        'enviosDiarios' => 'required|string',
        'enviosMensuales' => 'required|string',
        'zona' => 'required|string',
    ]);

    // Guardar en BD o enviar email
    Mail::to('ventas@homedelivery.com.pe')->send(new CotizacionMail($validated));

    return response()->json(['success' => true]);
}
```

---

### 6. Actualizar URLs de Redes Sociales

En `Footer.jsx`, actualiza las URLs reales:

```javascript
// Líneas 80-90 aproximadamente
<a
  href="https://www.facebook.com/TU_PAGINA_REAL"
  target="_blank"
  rel="noopener noreferrer"
  // ...
>
```

---

### 7. Verificar WhatsApp

Confirma que el número en `WhatsAppButton.jsx` sea correcto:

```javascript
const handleWhatsAppClick = () => {
  const phone = '51933411599'; // ← Verificar código de país y número
  const message = '¡Hola! Me interesa cotizar sus servicios logísticos.';
  window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
};
```

---

## 🧪 Testing

### Checklist de Pruebas:

- [ ] Las fuentes Aeonik se cargan correctamente
- [ ] Los colores oficiales se muestran correctamente
- [ ] El logo tiene el degradado correcto (60% verde, 40% gris)
- [ ] El menú móvil funciona en pantallas <768px
- [ ] El formulario valida correctamente:
  - [ ] Email con formato válido
  - [ ] Celular de 9 dígitos
  - [ ] Todos los campos requeridos
- [ ] El botón de WhatsApp aparece después de scroll
- [ ] El scroll suave funciona al hacer clic en navegación
- [ ] El formulario envía datos al backend
- [ ] Responsive en móvil, tablet y desktop
- [ ] Las animaciones funcionan correctamente

---

## 🎨 Validación de Marca

Compara con el manual de marca:

| Elemento | Especificación | Ubicación en Código |
|----------|----------------|---------------------|
| **Logo Gradient** | 60% Android Green, 40% Spanish Gray | `Logo.jsx` línea 8-11 |
| **Colores** | Onyx, Android Green, Spanish Gray, Cerulean Blue, Cerise | `tailwind.config.js` |
| **Tipografía** | Aeonik (Light 300, Regular 400, Medium 500, Bold 700) | `homedelivery.css` línea 1-30 |
| **Tamaño Mínimo Logo** | Horizontal: 120px, Vertical: 20px | `Logo.jsx` línea 6 |

---

## 📱 Build para Producción

### Laravel Mix:
```bash
npm run production
```

### Vite:
```bash
npm run build
```

---

## 🆘 Troubleshooting

### Las fuentes no se cargan
- Verifica que los archivos `.woff2` estén en `/public/fonts/`
- Revisa la consola del navegador para errores 404
- Asegúrate de importar `homedelivery.css`

### Los colores no se aplican
- Ejecuta `npm run dev` para recompilar Tailwind
- Verifica que `tailwind.config.js` tenga los colores extendidos
- Confirma que `content` incluya `**/*.jsx`

### El formulario no envía datos
- Revisa la URL del endpoint en `QuoteForm.jsx`
- Verifica el token CSRF en Laravel
- Chequea la consola del navegador para errores de red

### El logo no tiene gradiente
- Inspecciona el elemento SVG en DevTools
- Confirma que `linearGradient` tenga `id="hdGradient"`
- Verifica que los `stop` tengan los colores correctos

---

## 📞 Contacto

Si tienes dudas sobre la implementación, revisa:
- README.md principal
- INTEGRATION_EXAMPLE.jsx para ejemplos de uso
- Comentarios en el código de cada componente

**Ubicación de archivos:**
```
resources/
  ├── css/homedelivery.css
  └── js/components/HomeDelivery/
      ├── HomeDeliveryPage.jsx  ← Archivo principal
      ├── Logo.jsx
      ├── Header.jsx
      ├── Hero.jsx
      ├── Services.jsx
      ├── Benefits.jsx
      ├── QuoteForm.jsx
      ├── Locations.jsx
      ├── Footer.jsx
      ├── WhatsAppButton.jsx
      ├── ServiceCard.jsx
      ├── BenefitCard.jsx
      ├── README.md
      ├── SETUP_GUIDE.md  ← Este archivo
      └── INTEGRATION_EXAMPLE.jsx
```

---

**¡Listo para producción!** 🚀
