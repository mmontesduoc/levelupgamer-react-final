# 🔄 Ciclo de Vida Completo del Proyecto - Ejemplo Real

## 📖 Escenario: Usuario Compra "Zelda" en Nintendo

Vamos a seguir TODO el flujo desde que el usuario abre la app hasta que agrega un producto al carrito.

---

## 🎬 INICIO: Usuario Abre la Aplicación

### 1. Entry Point - `index.js`

```jsx
// src/index.js
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);  // ← TODO EMPIEZA AQUÍ
```

**¿Qué pasa?**
- React monta `<App />` en el DOM
- URL inicial: `http://localhost:3000/`

---

## 📍 PASO 1: App.js - Router Principal

```jsx
// src/App.js
function App() {
  return (
    <Router>
      <Navbar />              {/* ← Siempre visible */}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/nintendo" element={<NintendoPage />} />
          {/* ... */}
        </Routes>
      </main>
      <Footer />              {/* ← Siempre visible */}
    </Router>
  );
}
```

**Renderiza**:
```
┌──────────────────────────┐
│   NAVBAR                 │ ← Logo, Links, Carrito
├──────────────────────────┤
│                          │
│   HOME PAGE              │ ← Carousel, Featured Products
│   (porque URL = /)       │
│                          │
├──────────────────────────┤
│   FOOTER                 │ ← Info contacto, redes sociales
└──────────────────────────┘
```

---

## 🖱️ PASO 2: Usuario Click en "Nintendo"

### En el Navbar:

```jsx
// src/components/Navbar.js (línea 38-40)
<Link className="nav-link" to="/nintendo">
  Nintendo
</Link>
```

**¿Qué pasa al hacer click?**
1. `<Link>` de React Router cambia URL a `/nintendo`
2. **NO recarga la página** (SPA - Single Page Application)
3. React Router detecta cambio de URL
4. Busca en `<Routes>`: `path="/nintendo"` → renderiza `<NintendoPage />`

**URL cambia**: `http://localhost:3000/` → `http://localhost:3000/nintendo`

---

## 📄 PASO 3: Nintendo Page Se Carga

```jsx
// src/pages/nintendo.js
const Nintendo = () => {
  // PASO 3A: Importa datos de productos
  const nintendoProducts = [...];  // 8 productos

  // PASO 3B: Hook de filtrado
  const { selectedCategory, setSelectedCategory, filteredProducts } =
    useProductFilter(nintendoProducts);
  // Retorna:
  // - selectedCategory: "all"
  // - setSelectedCategory: función para cambiar
  // - filteredProducts: [8 productos] (todos inicialmente)

  // PASO 3C: Hook de carrito
  const { handleAddToCart } = useCart();
  // Retorna: función para agregar al carrito

  // PASO 3D: Define filtros
  const filters = [
    { value: "all", label: "Todos los Productos" },
    { value: "consoles", label: "Consolas" },
    { value: "games", label: "Juegos" },
    { value: "accessories", label: "Accesorios" },
  ];

  // PASO 3E: Renderiza el template
  return (
    <ProductPageTemplate
      pageTitle="NINTENDO"
      pageSubtitle="Descubre el mundo de Nintendo..."
      filters={filters}                    // → 4 opciones
      activeFilter={selectedCategory}      // → "all"
      onFilterChange={setSelectedCategory} // → función
      products={filteredProducts}          // → 8 productos
      onAddToCart={handleAddToCart}        // → función
    />
  );
};
```

---

## 🪝 PASO 4: useProductFilter Hook - Filtrado Inteligente

```jsx
// src/hooks/useProductFilter.js
const useProductFilter = (products, initialCategory = "all") => {
  // 1. Estado: categoría seleccionada
  const [selectedCategory, setSelectedCategory] = useState("all");

  // 2. Filtrado con memoización (optimización de performance)
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "all") {
      return products;  // Retorna TODOS [8 productos]
    }
    return products.filter(
      (product) => product.category === selectedCategory
    );
  }, [products, selectedCategory]);  // Solo recalcula si cambian

  // 3. Retorna 3 valores
  return {
    selectedCategory,     // "all"
    setSelectedCategory,  // función
    filteredProducts,     // [8 productos]
  };
};
```

**Estado Actual**:
- `selectedCategory = "all"`
- `filteredProducts = [8 productos de Nintendo]`

---

## 🏗️ PASO 5: ProductPageTemplate - Estructura de la Página

```jsx
// src/components/templates/ProductPageTemplate.js
const ProductPageTemplate = ({
  pageTitle,       // "NINTENDO"
  filters,         // [{value: "all", ...}, {value: "games", ...}]
  activeFilter,    // "all"
  onFilterChange,  // setSelectedCategory
  products,        // [8 productos]
  onAddToCart,     // handleAddToCart
}) => {
  return (
    <>
      {/* 1. HEADER */}
      <PageHeader
        title="NINTENDO"
        subtitle="Descubre el mundo de Nintendo..."
      />

      {/* 2. FILTROS */}
      <FilterBar
        filters={filters}              // 4 botones
        activeFilter="all"             // "all" está activo
        onFilterChange={setSelectedCategory}
      />

      {/* 3. GRID DE PRODUCTOS */}
      <ProductGrid
        products={[8 productos]}
        onAddToCart={handleAddToCart}
      />
    </>
  );
};
```

**Renderiza**:
```
┌────────────────────────────────────────┐
│   🎮 NINTENDO                          │ ← PageHeader
│   Descubre el mundo de Nintendo...    │
├────────────────────────────────────────┤
│  [Todos] [Consolas] [Juegos] [Accs]   │ ← FilterBar
│    ↑                                   │
│  activo                                │
├────────────────────────────────────────┤
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │
│  │ 📦 │ │ 📦 │ │ 📦 │ │ 📦 │         │ ← ProductGrid
│  └────┘ └────┘ └────┘ └────┘         │   (8 productos)
│  ┌────┐ ┌────┐ ┌────┐ ┌────┐         │
│  │ 📦 │ │ 📦 │ │ 📦 │ │ 📦 │         │
│  └────┘ └────┘ └────┘ └────┘         │
└────────────────────────────────────────┘
```

---

## 🎛️ PASO 6: FilterBar - Renderiza Botones

```jsx
// src/components/organisms/FilterBar.js
const FilterBar = ({ filters, activeFilter, onFilterChange }) => {
  return (
    <div className="container">
      {filters.map((filter) => (
        <FilterButton
          key={filter.value}
          label={filter.label}                    // "Todos", "Juegos"...
          isActive={activeFilter === filter.value} // true si activo
          onClick={() => onFilterChange(filter.value)}
        />
      ))}
    </div>
  );
};
```

**Genera 4 botones**:
```jsx
<FilterButton label="Todos los Productos" isActive={true} onClick={...} />
<FilterButton label="Consolas" isActive={false} onClick={...} />
<FilterButton label="Juegos" isActive={false} onClick={...} />
<FilterButton label="Accesorios" isActive={false} onClick={...} />
```

**Visual**:
```
[Todos los Productos] [Consolas] [Juegos] [Accesorios]
  ↑ azul (activo)       gris       gris       gris
```

---

## 🖱️ PASO 7: Usuario Click en "Juegos"

### Secuencia Completa del Click:

```jsx
// 1. Usuario hace click en botón "Juegos"
<FilterButton
  label="Juegos"
  onClick={() => onFilterChange("games")}  // ← SE EJECUTA
/>

// 2. onFilterChange = setSelectedCategory (del hook)
setSelectedCategory("games");

// 3. Estado de React cambia
// ANTES: selectedCategory = "all"
// AHORA: selectedCategory = "games"

// 4. useMemo detecta el cambio (porque selectedCategory cambió)
const filteredProducts = useMemo(() => {
  // selectedCategory = "games", entonces:
  return products.filter(
    (product) => product.category === "games"
  );
  // ANTES: retornaba [8 productos]
  // AHORA: retorna [3 productos: Zelda, Mario Odyssey, Mario Kart]
}, [products, selectedCategory]); // ← selectedCategory cambió!

// 5. React detecta que filteredProducts cambió
// 6. React re-renderiza ProductGrid con nuevos productos
```

**Resultado**:
- Antes: 8 productos visibles
- Ahora: 3 productos (solo juegos)

---

## 🎮 PASO 8: ProductGrid - Muestra Solo Juegos

```jsx
// src/components/organisms/ProductGrid.js
const ProductGrid = ({ products, onAddToCart }) => {
  // products = [Zelda, Mario Odyssey, Mario Kart] (3 juegos)

  return (
    <section>
      <div className="row">
        {products.map((product) => (
          // Renderiza 3 cards (antes 8)
          <div key={product.id} className="col-lg-3">
            <ProductCard
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

**Visual**:
```
┌────────────────────────────────────────┐
│  [Todos] [Consolas] [Juegos] [Accs]   │
│                       ↑                │
│                    activo              │
├────────────────────────────────────────┤
│  ┌──────────┐ ┌──────────┐ ┌────────┐ │
│  │  Zelda   │ │  Mario   │ │ Mario  │ │
│  │  TOTK    │ │ Odyssey  │ │ Kart 8 │ │
│  │ $69.990  │ │ $59.990  │ │$59.990 │ │
│  │[+Carrito]│ │[+Carrito]│ │[+Carr.]│ │
│  └──────────┘ └──────────┘ └────────┘ │
└────────────────────────────────────────┘
```

---

## 🃏 PASO 9: ProductCard - Renderiza Cada Juego

```jsx
// src/components/molecules/ProductCard.js
const ProductCard = ({ product, onAddToCart }) => {
  // product = { id: 3, name: "Zelda TOTK", price: "$69.990", ... }

  return (
    <div className="card h-100">
      {/* ÁTOMO: Imagen */}
      <ProductImage src={product.img} alt={product.name} />

      <div className="card-body">
        {/* Nombre */}
        <h5>{product.name}</h5>  {/* "The Legend of Zelda: TOTK" */}

        {/* Especificaciones */}
        <div className="specs">
          <h6>Especificaciones:</h6>
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key}>
              <span>{key}:</span>  {/* "Género:" */}
              <span>{value}</span> {/* "Aventura/Acción" */}
            </div>
          ))}
        </div>

        {/* Descripción */}
        <p>{product.description}</p>

        {/* ÁTOMO: Precio */}
        <Price price={product.price} />  {/* "$69.990" */}

        {/* ÁTOMO: Botón */}
        <Button
          variant="primary"
          fullWidth
          onClick={onAddToCart}
        >
          <i className="fas fa-cart-plus"></i> Agregar al Carrito
        </Button>
      </div>
    </div>
  );
};
```

**Visual de UNA card**:
```
┌────────────────────┐
│   [IMAGEN ZELDA]   │
├────────────────────┤
│ Zelda: TOTK        │
│                    │
│ Especificaciones:  │
│ Género: Aventura   │
│ Jugadores: 1       │
│ Espacio: 18.2 GB   │
│                    │
│ La épica aventura  │
│ continúa...        │
│                    │
│   $69.990          │
│                    │
│ [+ Agregar Carrito]│
└────────────────────┘
```

---

## 🛒 PASO 10: Usuario Click en "Agregar al Carrito"

### Secuencia del Click en el Botón:

```jsx
// 1. Usuario hace click en botón "Agregar al Carrito"
<Button onClick={onAddToCart}>  {/* ← CLICK */}
  Agregar al Carrito
</Button>

// 2. onAddToCart = handleAddToCart (del hook useCart)
handleAddToCart(event);

// 3. useCart ejecuta la lógica
```

---

## 🪝 PASO 11: useCart Hook - Maneja el Carrito

```jsx
// src/hooks/useCart.js
const useCart = () => {
  const [cart, setCart] = useState(0);  // Contador de productos

  const handleAddToCart = (e) => {
    // 1. Obtiene el botón clickeado
    const button = e.currentTarget;
    const originalText = button.textContent;
    // originalText = "⛓️ Agregar al Carrito"

    // 2. Cambia el texto y color del botón
    button.textContent = "¡Agregado!";
    button.style.backgroundColor = "#28a745"; // verde

    // 3. Incrementa contador del carrito
    setCart((prevCart) => prevCart + 1);
    // cart: 0 → 1

    // 4. Después de 2 segundos, restaura el botón
    setTimeout(() => {
      button.textContent = originalText;
      button.style.backgroundColor = "";
    }, 2000);
  };

  return {
    cart,            // 1
    handleAddToCart, // función
  };
};
```

### Animación del Botón:

```
ANTES del click:
┌──────────────────────┐
│ + Agregar al Carrito │  ← Azul
└──────────────────────┘

AL HACER CLICK:
┌──────────────────────┐
│    ¡Agregado!        │  ← Verde
└──────────────────────┘

DESPUÉS DE 2 SEGUNDOS:
┌──────────────────────┐
│ + Agregar al Carrito │  ← Azul otra vez
└──────────────────────┘
```

---

## 📊 RESUMEN: Flujo Completo de Datos

### Diagrama del Flujo:

```
1. Usuario abre app
   └─> index.js
       └─> App.js renderiza
           ├─> Navbar (siempre visible)
           ├─> Routes
           │   └─> Home (URL = /)
           └─> Footer (siempre visible)

2. Usuario click "Nintendo" en Navbar
   └─> React Router cambia URL a /nintendo
       └─> Routes renderiza <NintendoPage />

3. NintendoPage se carga
   ├─> Importa nintendoProducts.js (8 productos)
   ├─> Llama useProductFilter(products)
   │   └─> Retorna: filteredProducts = [8 productos]
   ├─> Llama useCart()
   │   └─> Retorna: handleAddToCart función
   └─> Renderiza <ProductPageTemplate />

4. ProductPageTemplate renderiza
   ├─> <PageHeader title="NINTENDO" />
   ├─> <FilterBar filters={...} />
   │   └─> Renderiza 4 <FilterButton />
   └─> <ProductGrid products={[8]} />
       └─> Renderiza 8 <ProductCard />

5. Usuario click "Juegos"
   └─> FilterButton onClick
       └─> onFilterChange("games")
           └─> setSelectedCategory("games")
               └─> useMemo recalcula filteredProducts
                   └─> filteredProducts = [3 juegos]
                       └─> ProductGrid re-renderiza
                           └─> Ahora muestra 3 cards

6. Usuario click "Agregar al Carrito"
   └─> Button onClick
       └─> onAddToCart(event)
           └─> handleAddToCart ejecuta
               ├─> Cambia texto botón: "¡Agregado!"
               ├─> Cambia color: verde
               ├─> Incrementa cart: 0 → 1
               └─> Después 2s: restaura botón
```

---

## 🔄 Ciclo de Re-renders

### ¿Cuándo React Re-renderiza?

1. **Click en "Juegos"**:
   ```
   selectedCategory cambia: "all" → "games"
   └─> useMemo recalcula
       └─> filteredProducts cambia
           └─> ProductGrid re-renderiza
               └─> ProductCard re-renderiza (solo 3, antes 8)
   ```

2. **Click en "Agregar al Carrito"**:
   ```
   cart cambia: 0 → 1
   └─> Navbar re-renderiza (para mostrar nuevo contador)
   └─> Botón cambia visualmente (no re-render, solo DOM directo)
   ```

---

## 📦 Arquitectura de Componentes - Visual

```
App
├─ Navbar
│  └─ Link (a Nintendo)
├─ Routes
│  └─ Nintendo Page
│     ├─ useProductFilter(products)
│     ├─ useCart()
│     └─ ProductPageTemplate
│        ├─ PageHeader (ATOM)
│        ├─ FilterBar (ORGANISM)
│        │  └─ FilterButton (MOLECULE)
│        │     └─ Button (ATOM)
│        └─ ProductGrid (ORGANISM)
│           └─ ProductCard (MOLECULE)
│              ├─ ProductImage (ATOM)
│              ├─ Price (ATOM)
│              └─ Button (ATOM)
└─ Footer
```

---

## 🎯 Ventajas de esta Arquitectura

### 1. Separación de Responsabilidades
```
✅ Datos        → data/nintendoProducts.js
✅ Lógica       → hooks/useProductFilter.js
✅ UI           → components/
✅ Páginas      → pages/nintendo.js (súper simple)
```

### 2. Reutilización
```
ProductCard usado en:
- Nintendo (8 veces)
- PlayStation (8 veces)
- PC (8 veces)
- Tienda (7 veces)
= 31 usos del MISMO componente
```

### 3. Performance
```
useMemo → Solo recalcula si cambia selectedCategory
└─> Evita filtrar en cada re-render
```

### 4. Mantenibilidad
```
Cambiar diseño de card:
❌ Antes: Editar 4 archivos (Nintendo, PS, PC, Tienda)
✅ Ahora: Editar 1 archivo (ProductCard.js)
```

---

## 🚀 Conclusión

El proyecto sigue un flujo de datos **unidireccional** (de arriba hacia abajo):

```
Datos (nintendoProducts)
  ↓
Lógica (useProductFilter)
  ↓
Template (ProductPageTemplate)
  ↓
Organisms (FilterBar, ProductGrid)
  ↓
Molecules (ProductCard, FilterButton)
  ↓
Atoms (Button, Image, Price)
  ↓
DOM (HTML final)
```

**Interacciones del usuario** van hacia arriba (callbacks):
```
Usuario click botón
  ↓
onClick callback
  ↓
onFilterChange/onAddToCart
  ↓
Hook actualiza estado
  ↓
React re-renderiza componentes afectados
```

**¡Eso es el ciclo de vida completo! 🎉**
