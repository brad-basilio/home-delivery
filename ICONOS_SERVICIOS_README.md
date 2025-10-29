# 📦 Iconos para Servicios - Home Delivery Logistics

## ✅ Servicios Creados (5 en total)

Los servicios ya están en la base de datos con sus títulos, descripciones y características. Solo falta subir los iconos PNG.

## 🎨 Requisitos de los Iconos

- **Formato**: PNG con fondo transparente
- **Color**: Blancos (se aplicará filtro CSS automático)
- **Tamaño recomendado**: 512x512 px o superior
- **Estilo**: Simples, líneas limpias, modernos

## 📋 Iconos Necesarios

### 1. Distribución de Última Milla
- **Concepto**: Camión de delivery/entrega
- **Palabras clave**: truck, delivery, shipping, last mile
- **Características**: 
  - Entregas puerta a puerta en todo el Perú
  - Seguimiento GPS en tiempo real
  - Cobertura nacional con más de 8 almacenes

### 2. Logística Inversa
- **Concepto**: Flecha de retorno con caja/paquete
- **Palabras clave**: return, reverse, exchange, refund
- **Características**:
  - Trazabilidad completa de devoluciones
  - Cobertura nacional para retornos
  - Procesos ágiles y certificados

### 3. Distribución a Puntos de Venta
- **Concepto**: Tienda/edificio comercial
- **Palabras clave**: store, retail, shop, building
- **Características**:
  - Ventanas horarias personalizadas
  - Entregas corporativas programadas
  - Control de inventario en tiempo real

### 4. Same Day Delivery
- **Concepto**: Reloj con flecha rápida/relámpago
- **Palabras clave**: fast, express, clock, speed, quick
- **Características**:
  - Entrega en menos de 24 horas
  - Cobertura en Lima y ciudades principales
  - Seguimiento en tiempo real

### 5. Retiro en Puntos Mall Plaza
- **Concepto**: Pin de ubicación con shopping/tienda
- **Palabras clave**: location, pickup point, mall, place
- **Características**:
  - 5 puntos estratégicos a nivel nacional
  - Horarios extendidos de atención
  - Notificaciones automáticas de llegada

## 🌐 Dónde Descargar Iconos Gratuitos

### Opción 1: Flaticon (Recomendado)
- URL: https://www.flaticon.com/
- Buscar: "delivery truck", "return box", "store", "fast delivery", "location pin"
- Descargar en PNG 512px
- Asegurarse de que sean blancos o convertirlos

### Opción 2: Iconscout
- URL: https://iconscout.com/
- Filtrar por: Free, PNG, White
- Descargar en alta resolución

### Opción 3: Icons8
- URL: https://icons8.com/
- Seleccionar estilo: Line, Outline, o similar
- Descargar en PNG con color blanco

### Opción 4: Font Awesome (Convertir SVG a PNG)
- URL: https://fontawesome.com/
- Buscar iconos relacionados
- Exportar como PNG blanco

## 📤 Cómo Subir los Iconos

1. Ve al panel admin: `/admin/services`
2. Click en el botón de editar (✏️) de cada servicio
3. En "Icono del servicio", sube el PNG correspondiente
4. Guarda los cambios
5. Repite para los 5 servicios

## 🎨 Colores que se Aplicarán Automáticamente

Los iconos se mostrarán en BLANCO sobre estos fondos (gradientes oficiales):

1. **Servicio 1**: Android Green (#8FBD44)
2. **Servicio 2**: Cerise (#DE3464)
3. **Servicio 3**: Cerulean (#2354B8)
4. **Servicio 4**: Spanish Gray (#969798)
5. **Servicio 5**: Android Green (#8FBD44) - Se repite el ciclo

El CSS aplicará automáticamente:
```css
filter: brightness(0) invert;
```

Esto convierte cualquier ícono oscuro en blanco.

## ✨ Vista Previa

Una vez subidos los iconos, verás las tarjetas de servicios con:
- Ícono blanco sobre gradiente de color
- Título del servicio
- Descripción
- 3 características principales (check icons)
- Botón "Ver detalles"

## 🚀 Compilar Cambios

Después de subir los iconos, compila los assets:

```bash
npm run dev
```

Luego visita la landing page en `/` para ver los servicios en acción!

---

**Nota**: Los servicios ya están visibles en la landing page, solo se mostrarán sin icono hasta que los subas desde el admin panel.
