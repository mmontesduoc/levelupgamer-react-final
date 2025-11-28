# Guía Completa de Templates en Atomic Design

## ¿Qué son los Templates?

Los **Templates** son el nivel 4 de Atomic Design. Definen la **estructura/layout de una página** sin contenido específico.

### Los 5 niveles de Atomic Design:

```
1. ATOMS (Átomos)         → Componentes básicos
   Ejemplo: <Button>, <Input>, <Image>

2. MOLECULES (Moléculas)  → Combinación de átomos
   Ejemplo: <ProductCard>, <SearchBar>

3. ORGANISMS (Organismos) → Secciones complejas
   Ejemplo: <ProductGrid>, <Header>, <Footer>

4. TEMPLATES (Plantillas) → Layout/estructura SIN datos
   Ejemplo: <ProductPageTemplate>, <FormPageTemplate>

5. PAGES (Páginas)        → Templates CON datos reales
   Ejemplo: Nintendo.js, PlayStation.js
```

---

## Características de los Templates

### ✅ Lo que SON los Templates:
- **Estructuras reutilizables** de páginas
- **Layouts** sin contenido específico
- **Moldes/esqueletos** de páginas
- Reciben **todo por props**
- **No tienen estado propio** (o muy poco)
- **No importan datos** directamente

### ❌ Lo que NO SON los Templates:
- NO tienen datos hardcodeados
- NO hacen fetch a APIs
- NO tienen lógica de negocio compleja
- NO son específicos a un caso de uso

---

## Analogía Visual

### Sin Template (Código duplicado):

```
Nintendo.js       →  [Header] [Filters] [Grid]  ← 50 líneas
PlayStation.js    →  [Header] [Filters] [Grid]  ← 50 líneas
PC.js             →  [Header] [Filters] [Grid]  ← 50 líneas
Xbox.js           →  [Header] [Filters] [Grid]  ← 50 líneas
                     ─────────────────────────
                     Total: 200 líneas (¡duplicadas!)
```

### Con Template (Reutilizado):

```
ProductPageTemplate.js → [Header] [Filters] [Grid] ← 50 líneas (una vez)

Nintendo.js       → usa ProductPageTemplate ← 10 líneas
PlayStation.js    → usa ProductPageTemplate ← 10 líneas
PC.js             → usa ProductPageTemplate ← 10 líneas
Xbox.js           → usa ProductPageTemplate ← 10 líneas
                    ─────────────────────────
                    Total: 90 líneas (¡optimizado!)
```

---

## Ejemplos Reales de tu Proyecto

### Template 1: ProductPageTemplate

**Propósito**: Estructura para páginas de productos (Nintendo, PlayStation, PC, Tienda)

**Estructura**:
```jsx
<ProductPageTemplate>
  ├─ Header (título + subtítulo)
  ├─ FilterBar (botones de filtro)
  └─ ProductGrid (productos)
</ProductPageTemplate>
```

**Código**:
```jsx
// components/templates/ProductPageTemplate.js
const ProductPageTemplate = ({
  pageTitle,        // ← Props (datos vienen de afuera)
  pageSubtitle,
  filters,
  activeFilter,
  onFilterChange,
  products,
  onAddToCart,
}) => {
  return (
    <>
      <PageHeader title={pageTitle} subtitle={pageSubtitle} />
      <FilterBar filters={filters} activeFilter={activeFilter} />
      <ProductGrid products={products} onAddToCart={onAddToCart} />
    </>
  );
};
```

**Uso en página real**:
```jsx
// pages/Nintendo.js (PÁGINA - nivel 5)
const Nintendo = () => {
  const { filteredProducts } = useProductFilter(nintendoProducts);
  const { handleAddToCart } = useCart();

  return (
    <ProductPageTemplate
      pageTitle="NINTENDO"              // ← Datos específicos
      pageSubtitle="Descubre Nintendo"
      filters={[...]}
      products={filteredProducts}
      onAddToCart={handleAddToCart}
    />
  );
};
```

---

### Template 2: FormPageTemplate

**Propósito**: Estructura para páginas con formularios (Login, Registro, Checkout)

**Estructura**:
```jsx
<FormPageTemplate>
  ├─ Título del formulario
  ├─ Formulario (children)
  └─ Footer (links adicionales)
</FormPageTemplate>
```

**Código**:
```jsx
const FormPageTemplate = ({ title, children, footer }) => {
  return (
    <div className="container">
      <h2>{title}</h2>
      {children}        {/* El formulario va aquí */}
      {footer}          {/* Links adicionales */}
    </div>
  );
};
```

**Uso ejemplo** (para Login):
```jsx
// pages/Login.js
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <FormPageTemplate
      title="Iniciar Sesión"
      footer={<Link to="/registro">¿No tienes cuenta?</Link>}
    >
      {/* El formulario es el children */}
      <form onSubmit={handleLogin}>
        <input type="email" value={email} onChange={...} />
        <input type="password" value={password} onChange={...} />
        <button type="submit">Entrar</button>
      </form>
    </FormPageTemplate>
  );
};
```

---

## Otros Ejemplos de Templates Comunes

### 1. DashboardTemplate
```jsx
const DashboardTemplate = ({ sidebar, mainContent, topBar }) => (
  <div className="dashboard">
    {topBar}
    <div className="dashboard-body">
      <aside>{sidebar}</aside>
      <main>{mainContent}</main>
    </div>
  </div>
);
```

### 2. TwoColumnTemplate
```jsx
const TwoColumnTemplate = ({ leftColumn, rightColumn }) => (
  <div className="row">
    <div className="col-md-8">{leftColumn}</div>
    <div className="col-md-4">{rightColumn}</div>
  </div>
);
```

### 3. BlogPostTemplate
```jsx
const BlogPostTemplate = ({ title, author, date, content, relatedPosts }) => (
  <>
    <article>
      <h1>{title}</h1>
      <AuthorInfo author={author} date={date} />
      <div>{content}</div>
    </article>
    <aside>
      <RelatedPosts posts={relatedPosts} />
    </aside>
  </>
);
```

---

## Ventajas de Usar Templates

### 1. **DRY (Don't Repeat Yourself)**
```jsx
// ❌ Sin template - repetir en 4 páginas
<div>
  <PageHeader title="..." />
  <FilterBar filters={...} />
  <ProductGrid products={...} />
</div>

// ✅ Con template - escribir una vez, usar 4 veces
<ProductPageTemplate pageTitle="..." filters={...} products={...} />
```

### 2. **Consistencia**
Si cambias el template, **todas las páginas se actualizan** automáticamente.

```jsx
// Si quieres agregar un breadcrumb a TODAS las páginas:
const ProductPageTemplate = ({ ... }) => (
  <>
    <Breadcrumb />  {/* ← Agregado en UN solo lugar */}
    <PageHeader />
    <FilterBar />
    <ProductGrid />
  </>
);
```

### 3. **Fácil de Testear**
```jsx
// Testear template una vez
<ProductPageTemplate
  pageTitle="Test"
  filters={mockFilters}
  products={mockProducts}
/>

// Todas las páginas que usan el template están testeadas ✅
```

### 4. **Escalabilidad**
Crear nuevas páginas es trivial:

```jsx
// Nueva página Xbox - ¡solo 15 líneas!
const Xbox = () => {
  const { filteredProducts } = useProductFilter(xboxProducts);
  return (
    <ProductPageTemplate
      pageTitle="XBOX"
      filters={xboxFilters}
      products={filteredProducts}
    />
  );
};
```

---

## Cuándo Crear un Template

### ✅ Crea un template cuando:
- Tienes **2 o más páginas con estructura similar**
- La estructura es **clara y repetible**
- Quieres **mantener consistencia** visual

### ❌ NO creas un template si:
- Solo tienes **1 página** con esa estructura
- La estructura es **muy específica** a un caso
- Las páginas son **demasiado diferentes** entre sí

---

## Diferencia: Template vs Organism

Puede ser confuso distinguirlos. Aquí está la diferencia:

### Organism (Organismo)
- **Parte** de una página
- Ejemplo: `<ProductGrid>`
- Se usa **dentro** de páginas

### Template (Plantilla)
- **Página completa** (o casi)
- Ejemplo: `<ProductPageTemplate>`
- Define el **layout entero**

### Ejemplo visual:
```jsx
// ORGANISM - Solo una sección
<ProductGrid products={products} />

// TEMPLATE - Página completa
<ProductPageTemplate>
  <PageHeader />      ← Organism
  <FilterBar />       ← Organism
  <ProductGrid />     ← Organism
</ProductPageTemplate>
```

---

## Tu Proyecto - Templates Actuales

### ProductPageTemplate
**Ubicación**: `src/components/templates/ProductPageTemplate.js`

**Usado por**:
- `Nintendo.js`
- `PlayStation.js`
- `pc.js`
- `Tienda.js`

**Props**:
- `pageTitle` - Título principal
- `pageSubtitle` - Subtítulo descriptivo
- `filters` - Array de filtros
- `activeFilter` - Filtro actual
- `onFilterChange` - Callback al cambiar filtro
- `products` - Productos filtrados
- `onAddToCart` - Callback agregar al carrito
- `customHeader` - Header personalizado (opcional)

### FormPageTemplate
**Ubicación**: `src/components/templates/FormPageTemplate.js`

**Puede usarse para**:
- Login (InicioSesion.js)
- Registro (Registro.js)
- Checkout (futuro)
- Contacto (contacto.js)

**Props**:
- `title` - Título del formulario
- `children` - El formulario
- `footer` - Links adicionales

---

## Ejercicio: Crea tu Propio Template

Si quisieras crear una página de "Detalles de Producto", podrías hacer:

```jsx
// components/templates/ProductDetailTemplate.js
const ProductDetailTemplate = ({
  product,
  relatedProducts,
  onAddToCart,
  reviews,
}) => {
  return (
    <div className="container">
      <div className="row">
        {/* Columna izquierda - Imagen */}
        <div className="col-md-6">
          <ProductImage src={product.image} />
        </div>

        {/* Columna derecha - Info */}
        <div className="col-md-6">
          <ProductInfo product={product} />
          <AddToCartButton onClick={onAddToCart} />
        </div>
      </div>

      {/* Reviews */}
      <ProductReviews reviews={reviews} />

      {/* Productos relacionados */}
      <RelatedProducts products={relatedProducts} />
    </div>
  );
};
```

Luego cada página de detalle solo pasa los datos:

```jsx
// pages/ProductDetail.js
const ProductDetail = () => {
  const { id } = useParams();
  const product = getProductById(id);
  const relatedProducts = getRelatedProducts(id);

  return (
    <ProductDetailTemplate
      product={product}
      relatedProducts={relatedProducts}
      onAddToCart={handleAddToCart}
      reviews={product.reviews}
    />
  );
};
```

---

## Resumen

| Concepto | Descripción | Ejemplo |
|----------|-------------|---------|
| **Atoms** | Componentes básicos | `<Button>` |
| **Molecules** | Combinación de átomos | `<ProductCard>` |
| **Organisms** | Secciones complejas | `<ProductGrid>` |
| **Templates** | Layout/estructura SIN datos | `<ProductPageTemplate>` |
| **Pages** | Templates CON datos | `Nintendo.js` |

### Regla de oro:
> **Si copias y pegas la estructura de una página → necesitas un Template**

---

## Conclusión

Los **Templates** son el "pegamento" entre tus componentes reutilizables (atoms, molecules, organisms) y tus páginas específicas.

**Antes del template**:
- Cada página: 50+ líneas
- Código duplicado en 4 archivos
- Cambios = editar 4 archivos

**Después del template**:
- Template: 50 líneas (una vez)
- Cada página: 10-15 líneas
- Cambios = editar 1 archivo

**¡Eso es el poder de los Templates! 🚀**
