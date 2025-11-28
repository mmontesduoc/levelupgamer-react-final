# 📁 Estructura de Carpetas del Proyecto - Guía Completa

## 🌳 Estructura General

```
Level-Up-Gamer_React_V3/
├── public/              ← Archivos estáticos (HTML, favicon, logos)
├── src/                 ← CÓDIGO FUENTE (TODO tu código React)
│   ├── components/      ← Componentes reutilizables (Atomic Design)
│   │   ├── atoms/       ← Componentes más básicos
│   │   ├── molecules/   ← Combinación de átomos
│   │   ├── organisms/   ← Secciones complejas
│   │   └── templates/   ← Layouts de página
│   ├── data/            ← Datos hardcodeados (productos)
│   ├── hooks/           ← Lógica reutilizable (custom hooks)
│   ├── images/          ← Imágenes del proyecto
│   ├── pages/           ← Páginas completas (rutas)
│   ├── styles/          ← Archivos CSS
│   ├── App.js           ← Componente principal + Router
│   └── index.js         ← Punto de entrada de la app
├── node_modules/        ← Dependencias instaladas (NO tocar)
├── build/               ← Build de producción (generado automáticamente)
├── package.json         ← Dependencias y scripts del proyecto
└── README.md            ← Documentación del proyecto
```

---

## 📂 Carpetas Principales

---

## 1️⃣ `public/` - Archivos Estáticos

**¿Qué es?**
Archivos que se sirven directamente sin procesamiento de React.

**¿Qué contiene?**
```
public/
├── index.html      ← HTML base (tiene el div#root)
├── favicon.ico     ← Icono de la pestaña del navegador
├── logo192.png     ← Logo PWA pequeño
├── logo512.png     ← Logo PWA grande
├── manifest.json   ← Configuración PWA
└── robots.txt      ← Para SEO/crawlers
```

**¿Cuándo usar?**
- Archivos que NO necesitan ser procesados por Webpack
- Meta tags, títulos, descripciones
- Configuración de PWA

**Ejemplo - index.html**:
```html
<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Level UP Gamer</title>
  </head>
  <body>
    <div id="root"></div>  ← React se monta aquí
  </body>
</html>
```

---

## 2️⃣ `src/` - Código Fuente

**¿Qué es?**
TODO el código React de tu aplicación.

**Archivos raíz en src/**:
```
src/
├── index.js        ← PUNTO DE ENTRADA (monta React)
├── App.js          ← Componente principal (Router)
├── App.css         ← Estilos del App
└── index.css       ← Estilos globales
```

### `index.js` - Punto de Entrada
```jsx
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);  // ← Monta <App /> en el DOM
```

**¿Qué hace?**
- Encuentra el div#root en index.html
- Monta el componente `<App />`
- Inicia la aplicación React

### `App.js` - Router Principal
```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Nintendo from "./pages/nintendo";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/nintendo" element={<Nintendo />} />
      </Routes>
      <Footer />
    </Router>
  );
}
```

**¿Qué hace?**
- Configura React Router (navegación)
- Define todas las rutas de la aplicación
- Renderiza Navbar y Footer en todas las páginas

---

## 3️⃣ `src/components/` - Componentes Reutilizables

**¿Qué es?**
Componentes que se usan en múltiples lugares.

**Estructura Atomic Design**:
```
components/
├── atoms/          ← Nivel 1: Bloques básicos
├── molecules/      ← Nivel 2: Combinación de átomos
├── organisms/      ← Nivel 3: Secciones complejas
├── templates/      ← Nivel 4: Layouts de página
├── Navbar.js       ← Componentes legacy (fuera de Atomic)
├── Footer.js
├── Carousel.js
├── contact.js
└── FeaturedProducts.js
```

---

### 🔬 `components/atoms/` - Componentes Básicos

**¿Qué son?**
Los componentes **MÁS SIMPLES** e **INDIVISIBLES**. No se pueden dividir más.

**Ejemplos**:
```
atoms/
├── Button.js         ← Un botón reutilizable
├── ProductImage.js   ← Una imagen de producto
├── Price.js          ← Precio formateado
└── PageHeader.js     ← Encabezado de página
```

#### Ejemplo: `Button.js`
```jsx
const Button = ({ children, onClick, variant = "primary" }) => {
  return (
    <button className={`btn btn-${variant}`} onClick={onClick}>
      {children}
    </button>
  );
};
```

**¿Cuándo crear un átomo?**
- ✅ Se usa en MÚLTIPLES lugares
- ✅ Es un componente simple (input, botón, texto, imagen)
- ✅ NO depende de otros componentes
- ❌ NO si solo se usa en un lugar específico

**Regla de oro**: Si ves HTML repetido 3+ veces → crea un átomo

---

### 🧪 `components/molecules/` - Combinación de Átomos

**¿Qué son?**
Componentes formados por **varios átomos** trabajando juntos.

**Ejemplos**:
```
molecules/
├── ProductCard.js      ← Imagen + Título + Precio + Botón
└── FilterButton.js     ← Botón con estado activo/inactivo
```

#### Ejemplo: `ProductCard.js`
```jsx
import ProductImage from "../atoms/ProductImage";
import Price from "../atoms/Price";
import Button from "../atoms/Button";

const ProductCard = ({ product, onAddToCart }) => {
  return (
    <div className="card">
      <ProductImage src={product.img} />    {/* ← ÁTOMO */}
      <h5>{product.name}</h5>
      <Price price={product.price} />       {/* ← ÁTOMO */}
      <Button onClick={onAddToCart}>       {/* ← ÁTOMO */}
        Agregar al Carrito
      </Button>
    </div>
  );
};
```

**¿Cuándo crear una molécula?**
- ✅ Combina 2+ átomos
- ✅ Tiene una funcionalidad específica (ej: card de producto)
- ✅ Se reutiliza en varios lugares
- ❌ NO si es demasiado compleja (sería un organismo)

---

### 🔬 `components/organisms/` - Secciones Complejas

**¿Qué son?**
Componentes **complejos** formados por moléculas y/o átomos. Representan **secciones** de la página.

**Ejemplos**:
```
organisms/
├── ProductGrid.js    ← Grid completo de productos
└── FilterBar.js      ← Barra completa de filtros
```

#### Ejemplo: `ProductGrid.js`
```jsx
import ProductCard from "../molecules/ProductCard";

const ProductGrid = ({ products, onAddToCart }) => {
  return (
    <section className="game-section">
      <div className="row">
        {products.map((product) => (
          <div key={product.id} className="col-lg-3">
            <ProductCard               {/* ← MOLÉCULA */}
              product={product}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
```

**¿Cuándo crear un organismo?**
- ✅ Es una **sección completa** de la página
- ✅ Combina múltiples moléculas
- ✅ Tiene lógica de presentación (mapear, filtrar, etc.)
- ❌ NO si es toda la página (sería un template)

---

### 🏗️ `components/templates/` - Layouts de Página

**¿Qué son?**
**Esqueletos/estructura** de páginas completas **SIN datos específicos**.

**Ejemplos**:
```
templates/
├── ProductPageTemplate.js    ← Estructura de páginas de productos
└── FormPageTemplate.js       ← Estructura de formularios
```

#### Ejemplo: `ProductPageTemplate.js`
```jsx
import PageHeader from "../atoms/PageHeader";
import FilterBar from "../organisms/FilterBar";
import ProductGrid from "../organisms/ProductGrid";

const ProductPageTemplate = ({
  pageTitle,      // ← Props (datos vienen de afuera)
  filters,
  products,
  onAddToCart,
}) => {
  return (
    <>
      <PageHeader title={pageTitle} />      {/* ← ÁTOMO */}
      <FilterBar filters={filters} />       {/* ← ORGANISMO */}
      <ProductGrid products={products} />   {/* ← ORGANISMO */}
    </>
  );
};
```

**¿Cuándo crear un template?**
- ✅ Tienes 2+ páginas con **estructura similar**
- ✅ Solo cambian los **datos**, no la estructura
- ✅ Defines el **layout completo** de la página
- ❌ NO si cada página es muy diferente

**Ejemplo de uso**:
```jsx
// pages/Nintendo.js
<ProductPageTemplate pageTitle="NINTENDO" products={nintendoProducts} />

// pages/PlayStation.js
<ProductPageTemplate pageTitle="PLAYSTATION" products={psProducts} />

// Mismo template, diferentes datos ✅
```

---

## 4️⃣ `src/pages/` - Páginas Completas

**¿Qué son?**
Componentes que representan **rutas/páginas** completas de tu aplicación.

**Contenido**:
```
pages/
├── Home.js           ← Página principal (/)
├── nintendo.js       ← Página Nintendo (/nintendo)
├── PlayStation.js    ← Página PlayStation (/play-station)
├── pc.js             ← Página PC (/pc)
├── Tienda.js         ← Tienda general (/tienda)
├── contacto.js       ← Contacto (/contacto)
├── InicioSesion.js   ← Login (/inicio-sesion)
└── Registro.js       ← Registro (/registro)
```

**¿Qué hace cada página?**
```jsx
// pages/Nintendo.js
const Nintendo = () => {
  // 1. Importa datos
  const products = [...];

  // 2. Usa hooks para lógica
  const { filteredProducts } = useProductFilter(products);
  const { handleAddToCart } = useCart();

  // 3. Renderiza template con datos
  return (
    <ProductPageTemplate
      pageTitle="NINTENDO"
      products={filteredProducts}
      onAddToCart={handleAddToCart}
    />
  );
};
```

**¿Cuándo crear una página?**
- ✅ Cada **ruta** de tu aplicación es una página
- ✅ Se registra en `App.js` con `<Route path="/ruta" element={<Pagina />} />`
- ✅ Combina datos + lógica + template

**Diferencia Template vs Page**:
```
TEMPLATE (ProductPageTemplate):
- Define la ESTRUCTURA
- NO tiene datos específicos
- Reutilizable

PAGE (Nintendo.js):
- Usa el template
- Provee los DATOS específicos
- Específica a una ruta
```

---

## 5️⃣ `src/data/` - Datos del Proyecto

**¿Qué son?**
Archivos con **datos hardcodeados** (productos, configuración, etc.).

**Contenido**:
```
data/
├── nintendoProducts.js      ← 8 productos Nintendo
├── playstationProducts.js   ← 8 productos PlayStation
├── pcProducts.js            ← 8 productos PC
└── tiendaProducts.js        ← 7 productos tienda
```

#### Ejemplo: `nintendoProducts.js`
```jsx
import img1 from "../images/nintendoswoled.jpg";
import img2 from "../images/switchlite.png";

export const nintendoProducts = [
  {
    id: 1,
    category: "consoles",
    name: "Nintendo Switch OLED",
    img: img1,
    specs: { Pantalla: "OLED 7", Almacenamiento: "64GB" },
    description: "La consola híbrida...",
    price: "$349.990",
  },
  // ... más productos
];
```

**¿Por qué separar los datos?**
- ✅ Fácil de mantener (todos los productos en un lugar)
- ✅ Fácil de migrar a una API (cambiar import por fetch)
- ✅ Componentes no dependen de datos específicos
- ✅ Reutilización (mismo componente, diferentes datos)

**Futuro con API**:
```jsx
// AHORA (hardcoded):
import { nintendoProducts } from "../data/nintendoProducts";

// FUTURO (API):
const { data: nintendoProducts } = await fetch("/api/nintendo");
```

---

## 6️⃣ `src/hooks/` - Lógica Reutilizable

**¿Qué son?**
**Custom Hooks** - Funciones que extraen lógica reutilizable usando hooks de React.

**Contenido**:
```
hooks/
├── useProductFilter.js    ← Filtrado de productos
└── useCart.js             ← Lógica del carrito
```

#### Ejemplo: `useProductFilter.js`
```jsx
import { useState, useMemo } from "react";

const useProductFilter = (products, initialCategory = "all") => {
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") return products;
    return products.filter(p => p.category === selectedCategory);
  }, [products, selectedCategory]);

  return {
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
  };
};

export default useProductFilter;
```

**¿Por qué usar hooks personalizados?**
- ✅ Reutilizar lógica en múltiples componentes
- ✅ Mantener componentes simples (solo UI)
- ✅ Testear lógica de forma aislada
- ✅ Separar lógica de presentación

**¿Cuándo crear un hook?**
- ✅ La misma lógica se usa en 2+ componentes
- ✅ Usa hooks de React (useState, useEffect, etc.)
- ✅ Tiene un propósito claro (filtrar, fetch, validar, etc.)
- ❌ NO si es solo una función normal (usa utils/)

**Convención de nombres**: Siempre empiezan con `use` (useNombreDelHook)

---

## 7️⃣ `src/images/` - Imágenes del Proyecto

**¿Qué contiene?**
Todas las imágenes (logos, productos, banners, etc.).

**Contenido**:
```
images/
├── logo2.png              ← Logo principal
├── nintendoswoled.jpg     ← Productos Nintendo
├── switchlite.png
├── zelda.jpg
├── 5.jpg                  ← Productos PlayStation
├── rdr.jpg
├── i3.jpg                 ← Productos PC
├── mousepad.PNG           ← Productos Tienda
└── ...                    ← 50+ imágenes
```

**¿Cómo se usan?**
```jsx
// Importar
import logo from "../images/logo2.png";

// Usar en JSX
<img src={logo} alt="Logo" />
```

**¿Por qué importar en lugar de usar ruta?**
- ✅ Webpack las optimiza (compresión, cache)
- ✅ Detecta errores en build (si falta la imagen)
- ✅ Genera nombres únicos (evita cache problems)

---

## 8️⃣ `src/styles/` - Archivos CSS

**¿Qué contiene?**
Archivos CSS para estilos.

**Contenido**:
```
styles/
├── App.css           ← Estilos del App.js
├── Navbar.css        ← Estilos del Navbar
├── playstation.css   ← Estilos de páginas de productos
├── Tienda.css        ← Estilos de Tienda
├── contacts.css      ← Estilos de contacto
└── ...
```

**Tipos de CSS en React**:
1. **CSS Modules** (recomendado):
   ```jsx
   import styles from './Button.module.css';
   <button className={styles.primary}>Click</button>
   ```

2. **CSS Global** (lo que usas ahora):
   ```jsx
   import './playstation.css';
   <button className="btn btn-primary">Click</button>
   ```

3. **CSS-in-JS** (styled-components):
   ```jsx
   const Button = styled.button`
     background: blue;
   `;
   ```

---

## 9️⃣ `node_modules/` - Dependencias

**¿Qué es?**
Carpeta con todas las librerías instaladas (React, React Router, Bootstrap, etc.).

**¿Tocar?**
❌ **NUNCA TOCAR** - Se genera automáticamente con `npm install`

**Tamaño**:
- ~200-500 MB
- Miles de archivos

**Git**:
- NO se sube a GitHub (está en `.gitignore`)
- Se regenera con `npm install`

---

## 🔟 `build/` - Build de Producción

**¿Qué es?**
Versión optimizada de tu app lista para producción.

**¿Cómo se genera?**
```bash
npm run build
```

**Contenido**:
```
build/
├── static/
│   ├── js/       ← JavaScript compilado y minificado
│   └── css/      ← CSS compilado y minificado
└── index.html    ← HTML con referencias a archivos
```

**¿Tocar?**
❌ **NO EDITAR** - Se genera automáticamente

**¿Cuándo usar?**
- Para deploy a producción
- Para testear la versión final
- Para medir performance real

---

## 📊 Resumen Visual por Carpeta

```
┌─────────────────────────────────────────────────────┐
│ CARPETA          │ QUÉ VA                │ CUÁNDO   │
├─────────────────────────────────────────────────────┤
│ public/          │ HTML, favicon         │ Estático │
│ src/             │ TODO el código React  │ Siempre  │
│ src/components/  │ Componentes reusables │ Siempre  │
│   ├─ atoms/      │ Básicos (Button)      │ Nivel 1  │
│   ├─ molecules/  │ Combinados (Card)     │ Nivel 2  │
│   ├─ organisms/  │ Secciones (Grid)      │ Nivel 3  │
│   └─ templates/  │ Layouts (PageTemplate)│ Nivel 4  │
│ src/pages/       │ Rutas/Páginas         │ Nivel 5  │
│ src/data/        │ Datos hardcodeados    │ Temporal │
│ src/hooks/       │ Lógica reutilizable   │ Siempre  │
│ src/images/      │ Imágenes del proyecto │ Assets   │
│ src/styles/      │ Archivos CSS          │ Estilos  │
│ node_modules/    │ Dependencias          │ NO TOCAR │
│ build/           │ Build producción      │ Deploy   │
└─────────────────────────────────────────────────────┘
```

---

## 🎯 Reglas de Oro

### 1. **Atomic Design - Dónde Crear Componentes**

```
¿Es un componente básico (botón, input)?
  → atoms/

¿Combina 2-3 átomos con una funcionalidad?
  → molecules/

¿Es una sección completa de la página?
  → organisms/

¿Es un layout/estructura de página completa?
  → templates/

¿Es una página/ruta específica?
  → pages/
```

### 2. **Separación de Responsabilidades**

```
Datos        → data/
Lógica       → hooks/
UI           → components/
Páginas      → pages/
Estilos      → styles/
Assets       → images/
```

### 3. **Import Order (Orden Recomendado)**

```jsx
// 1. React y librerías externas
import React from "react";
import { Link } from "react-router-dom";

// 2. Componentes locales
import Button from "../atoms/Button";
import ProductCard from "../molecules/ProductCard";

// 3. Hooks
import useProductFilter from "../hooks/useProductFilter";

// 4. Datos
import { nintendoProducts } from "../data/nintendoProducts";

// 5. Estilos
import "./styles.css";

// 6. Imágenes
import logo from "../images/logo.png";
```

---

## 🚀 Conclusión

Tu proyecto sigue una estructura **modular y escalable**:

✅ **Atomic Design** - Componentes reutilizables en 5 niveles
✅ **Separación de datos** - data/ independiente de UI
✅ **Custom Hooks** - Lógica extraída y reutilizable
✅ **Rutas claras** - pages/ para cada ruta
✅ **Organización profesional** - Fácil de mantener y escalar

**¡Cada carpeta tiene un propósito claro y definido! 🎉**
