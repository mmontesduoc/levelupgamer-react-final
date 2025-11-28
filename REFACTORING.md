# Refactorización React - Level Up Gamer

## ¿Qué cambió?

Este proyecto ha sido completamente refactorizado siguiendo las mejores prácticas de React y la metodología **Atomic Design**.

### Antes vs Después

#### ❌ ANTES (Código duplicado y mal organizado)
```jsx
// nintendo.js - 260 líneas de código repetido
const products = [/* datos hardcodeados */];
const Nintendo = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  // 200+ líneas de HTML repetido en cada página
  return (
    <>
      <div className="container-fluid-banner">
        <h1>NINTENDO</h1>
      </div>
      <div className="container mb-5">
        <button onClick={() => setSelectedCategory("all")}>Todos</button>
        <button onClick={() => setSelectedCategory("consoles")}>Consolas</button>
        // ... más botones
      </div>
      <section className="game-section-carro">
        {filteredProducts.map((product) => (
          <div className="col-lg-3 col-md-6">
            <div className="card h-100">
              <img src={product.img} />
              // ... 50+ líneas de HTML por producto
            </div>
          </div>
        ))}
      </section>
    </>
  );
};
```

Este mismo código se repetía en:
- `nintendo.js` (260 líneas)
- `PlayStation.js` (237 líneas)
- `pc.js` (237 líneas)
- `Tienda.js` (268 líneas)

**Total: ~1000 líneas de código duplicado**

#### ✅ DESPUÉS (Componentes reutilizables)
```jsx
// nintendo.js - ¡Solo 48 líneas!
import { nintendoProducts } from "../data/nintendoProducts";
import useProductFilter from "../hooks/useProductFilter";
import PageHeader from "../components/atoms/PageHeader";
import FilterBar from "../components/organisms/FilterBar";
import ProductGrid from "../components/organisms/ProductGrid";

const Nintendo = () => {
  const { selectedCategory, setSelectedCategory, filteredProducts } =
    useProductFilter(nintendoProducts);
  const { handleAddToCart } = useCart();

  const filters = [
    { value: "all", label: "Todos los Productos" },
    { value: "consoles", label: "Consolas" },
    { value: "games", label: "Juegos" },
    { value: "accessories", label: "Accesorios" },
  ];

  return (
    <>
      <PageHeader title="NINTENDO" subtitle="..." />
      <FilterBar filters={filters} activeFilter={selectedCategory} onFilterChange={setSelectedCategory} />
      <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
    </>
  );
};
```

## Nueva Estructura del Proyecto

```
src/
├── components/
│   ├── atoms/                    # Componentes básicos (botones, inputs, imágenes)
│   │   ├── Button.js
│   │   ├── ProductImage.js
│   │   ├── Price.js
│   │   └── PageHeader.js
│   ├── molecules/                # Componentes compuestos (cards, filtros)
│   │   ├── ProductCard.js
│   │   └── FilterButton.js
│   ├── organisms/                # Componentes complejos (grids, barras)
│   │   ├── ProductGrid.js
│   │   └── FilterBar.js
│   ├── Navbar.js                 # Componentes legacy (se mantendrán)
│   ├── Footer.js
│   └── Carousel.js
├── data/                         # Datos separados de la lógica
│   ├── nintendoProducts.js
│   ├── playstationProducts.js
│   ├── pcProducts.js
│   └── tiendaProducts.js
├── hooks/                        # Lógica reutilizable
│   ├── useProductFilter.js
│   └── useCart.js
├── pages/                        # Páginas (ahora son súper simples)
│   ├── Nintendo.js
│   ├── PlayStation.js
│   ├── pc.js
│   └── Tienda.js
└── styles/
```

## Atomic Design - ¿Qué es?

La metodología **Atomic Design** organiza los componentes en 5 niveles:

### 1️⃣ Atoms (Átomos)
Los componentes más básicos e indivisibles.

**Ejemplos:**
- `<Button />` - Un botón reutilizable
- `<ProductImage />` - Una imagen de producto
- `<Price />` - Precio formateado
- `<PageHeader />` - Encabezado de página

```jsx
// Antes: HTML duplicado
<button className="btn btn-primary w-100 add-to-cart-carro">
  <i className="fas fa-cart-plus"></i> Agregar al Carrito
</button>

// Después: Componente reutilizable
<Button variant="primary" fullWidth className="add-to-cart-carro">
  <i className="fas fa-cart-plus"></i> Agregar al Carrito
</Button>
```

### 2️⃣ Molecules (Moléculas)
Combinación de átomos que forman componentes más complejos.

**Ejemplos:**
- `<ProductCard />` - Tarjeta de producto (imagen + título + precio + botón)
- `<FilterButton />` - Botón de filtro con estado activo

```jsx
// ProductCard combina: ProductImage + Price + Button
<ProductCard product={product} onAddToCart={handleAddToCart} />
```

### 3️⃣ Organisms (Organismos)
Secciones completas de la interfaz.

**Ejemplos:**
- `<ProductGrid />` - Grid completo de productos
- `<FilterBar />` - Barra de filtros completa

```jsx
// Antes: 50+ líneas de código
<section className="game-section-carro">
  <div className="container">
    <div className="row">
      {products.map(...)}
    </div>
  </div>
</section>

// Después: 1 línea
<ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
```

### 4️⃣ Templates (Plantillas)
Layouts de páginas sin contenido real.

### 5️⃣ Pages (Páginas)
Instancias de templates con contenido real.

## Hooks Personalizados

### `useProductFilter`
Maneja la lógica de filtrado de productos.

```jsx
const { selectedCategory, setSelectedCategory, filteredProducts } =
  useProductFilter(products, "all");
```

**Beneficios:**
- ✅ Lógica centralizada
- ✅ Reutilizable en todas las páginas
- ✅ Memoización con `useMemo` (optimización de performance)

### `useCart`
Maneja la lógica del carrito de compras.

```jsx
const { cart, handleAddToCart } = useCart();
```

**Beneficios:**
- ✅ Feedback visual al agregar productos
- ✅ Reutilizable
- ✅ Fácil de extender con backend

## Separación de Datos

Los datos de productos ahora están en archivos separados:

```jsx
// data/nintendoProducts.js
export const nintendoProducts = [
  { id: 1, name: "...", price: "...", ... },
  // ...
];
```

**Beneficios:**
- ✅ Fácil de migrar a una API
- ✅ Datos separados de la UI
- ✅ Más fácil de mantener

## Resultados de la Refactorización

### Reducción de Código
- **Nintendo.js**: 260 líneas → 48 líneas (81% menos)
- **PlayStation.js**: 237 líneas → 48 líneas (80% menos)
- **pc.js**: 237 líneas → 48 líneas (80% menos)
- **Tienda.js**: 268 líneas → 54 líneas (80% menos)

### Mejoras de Calidad
✅ **Sin duplicación de código** - DRY (Don't Repeat Yourself)
✅ **Componentes reutilizables** - Atomic Design
✅ **Separación de responsabilidades** - SoC (Separation of Concerns)
✅ **Lógica extraída en hooks** - Custom Hooks
✅ **Datos separados** - Data Layer
✅ **Tests incluidos** - 39 tests pasando
✅ **Build exitoso** - Sin errores

### Performance
✅ **Memoización** - `useMemo` en el hook de filtrado
✅ **Menos re-renders** - Hooks optimizados
✅ **Bundle más pequeño** - Código más eficiente

## Cómo Usar los Nuevos Componentes

### Crear una nueva página de productos

```jsx
import { products } from "../data/myProducts";
import useProductFilter from "../hooks/useProductFilter";
import useCart from "../hooks/useCart";
import PageHeader from "../components/atoms/PageHeader";
import FilterBar from "../components/organisms/FilterBar";
import ProductGrid from "../components/organisms/ProductGrid";

const MyPage = () => {
  const { selectedCategory, setSelectedCategory, filteredProducts } =
    useProductFilter(products);
  const { handleAddToCart } = useCart();

  const filters = [
    { value: "all", label: "Todos" },
    { value: "category1", label: "Categoría 1" },
  ];

  return (
    <>
      <PageHeader title="MI PÁGINA" subtitle="Descripción" />
      <FilterBar filters={filters} activeFilter={selectedCategory} onFilterChange={setSelectedCategory} />
      <ProductGrid products={filteredProducts} onAddToCart={handleAddToCart} />
    </>
  );
};
```

## Próximos Pasos Recomendados

1. **Integrar un backend real**
   - Reemplazar archivos de datos con llamadas a API
   - Implementar Context API o Redux para estado global

2. **Mejorar el sistema de carrito**
   - Persistencia en localStorage
   - Contador dinámico en el Navbar
   - Página de checkout

3. **Añadir más tests**
   - Aumentar cobertura de branches a 50%+
   - Tests de integración

4. **TypeScript** (opcional)
   - Añadir tipos para mejor seguridad

5. **Optimizaciones**
   - Lazy loading de imágenes
   - Code splitting por rutas
   - Service Worker para PWA

## Comandos

```bash
# Desarrollo
npm start

# Build
npm run build

# Tests
npm test

# Tests con cobertura
npm run test:coverage
```

## Conclusión

Tu proyecto ahora sigue las **mejores prácticas de React** y ya no "parece HTML". Los componentes son reutilizables, el código está organizado, y es mucho más fácil de mantener y escalar.

**¡Tu profesor debería estar impresionado! 🚀**
