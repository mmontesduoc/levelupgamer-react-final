# Arquitectura del Proyecto - Level Up Gamer

## Diagrama de Componentes

```
┌─────────────────────────────────────────────────────────────┐
│                         PÁGINAS                              │
│  (Nintendo, PlayStation, PC, Tienda)                         │
└────────────────────┬────────────────────────────────────────┘
                     │
                     │ usan
                     │
        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼
┌──────────────┐          ┌──────────────┐
│   HOOKS      │          │   DATOS      │
│              │          │              │
│ • useProduct │          │ • nintendo   │
│   Filter     │          │   Products   │
│              │          │              │
│ • useCart    │          │ • playstation│
│              │          │   Products   │
└──────────────┘          │              │
                          │ • pcProducts │
                          │              │
                          │ • tienda     │
                          │   Products   │
                          └──────────────┘

┌─────────────────────────────────────────────────────────────┐
│                      COMPONENTES                             │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ORGANISMS (Organismos)                   │   │
│  │                                                       │   │
│  │  ┌─────────────────┐    ┌─────────────────┐         │   │
│  │  │  ProductGrid    │    │   FilterBar     │         │   │
│  │  │                 │    │                 │         │   │
│  │  │  Renderiza grid │    │  Barra completa │         │   │
│  │  │  de productos   │    │  de filtros     │         │   │
│  │  └────────┬────────┘    └────────┬────────┘         │   │
│  │           │                      │                   │   │
│  └───────────┼──────────────────────┼───────────────────┘   │
│              │                      │                       │
│              │ usa                  │ usa                   │
│              ▼                      ▼                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │             MOLECULES (Moléculas)                     │   │
│  │                                                       │   │
│  │  ┌─────────────────┐    ┌─────────────────┐         │   │
│  │  │  ProductCard    │    │  FilterButton   │         │   │
│  │  │                 │    │                 │         │   │
│  │  │  Card completa  │    │  Botón de filtro│         │   │
│  │  │  de producto    │    │  con estado     │         │   │
│  │  └────────┬────────┘    └────────┬────────┘         │   │
│  │           │                      │                   │   │
│  └───────────┼──────────────────────┼───────────────────┘   │
│              │                      │                       │
│              │ usa                  │ usa                   │
│              ▼                      ▼                       │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              ATOMS (Átomos)                          │   │
│  │                                                       │   │
│  │  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐    │   │
│  │  │ Button │  │ Image  │  │ Price  │  │ Header │    │   │
│  │  └────────┘  └────────┘  └────────┘  └────────┘    │   │
│  │                                                       │   │
│  └───────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Flujo de Datos

```
Usuario navega a /nintendo
         │
         ▼
┌────────────────────┐
│  Nintendo.js       │
│  (Página)          │
└─────────┬──────────┘
          │
          │ 1. Importa datos
          ├─────────────────────► nintendoProducts.js
          │
          │ 2. Usa hooks
          ├─────────────────────► useProductFilter(products)
          │                       └─► Retorna: filteredProducts
          │
          ├─────────────────────► useCart()
          │                       └─► Retorna: handleAddToCart
          │
          │ 3. Renderiza componentes
          ▼
    ┌─────────────┐
    │ PageHeader  │ ◄─── Props: title, subtitle
    └─────────────┘
          │
          ▼
    ┌─────────────┐
    │ FilterBar   │ ◄─── Props: filters, activeFilter, onFilterChange
    └──────┬──────┘
           │
           │ Renderiza múltiples
           ▼
      ┌──────────────┐
      │FilterButton  │ (uno por categoría)
      └──────────────┘
          │
          ▼
    ┌─────────────┐
    │ProductGrid  │ ◄─── Props: filteredProducts, onAddToCart
    └──────┬──────┘
           │
           │ Mapea productos y renderiza
           ▼
      ┌──────────────┐
      │ ProductCard  │ (uno por producto)
      └──────┬───────┘
             │
             │ Usa componentes atómicos
             ▼
        ┌────────┐  ┌────────┐  ┌────────┐
        │ Image  │  │ Price  │  │ Button │
        └────────┘  └────────┘  └────────┘
```

## Ejemplo de Flujo: "Agregar al Carrito"

```
1. Usuario hace click en "Agregar al Carrito"
   │
   ▼
2. Button (atom) dispara onClick
   │
   ▼
3. ProductCard (molecule) recibe el evento
   │
   ▼
4. ProductCard llama a onAddToCart (prop)
   │
   ▼
5. ProductGrid (organism) pasa el evento
   │
   ▼
6. Página (Nintendo.js) tiene handleAddToCart de useCart
   │
   ▼
7. useCart hook ejecuta la lógica:
   - Cambia texto del botón a "¡Agregado!"
   - Cambia color a verde
   - Incrementa contador del carrito
   - Después de 2 segundos, restaura el botón
```

## Ejemplo de Flujo: "Filtrar Productos"

```
1. Usuario hace click en "Consolas"
   │
   ▼
2. FilterButton (molecule) dispara onClick
   │
   ▼
3. FilterBar (organism) llama a onFilterChange("consoles")
   │
   ▼
4. Página (Nintendo.js) recibe el cambio
   │
   ▼
5. useProductFilter hook actualiza selectedCategory
   │
   ▼
6. useMemo recalcula filteredProducts
   │
   ▼
7. ProductGrid recibe nuevos productos filtrados
   │
   ▼
8. Re-renderiza solo las ProductCards necesarias
```

## Ventajas de esta Arquitectura

### 1. Reutilización
```jsx
// El mismo ProductCard se usa en:
- Nintendo.js
- PlayStation.js
- pc.js
- Tienda.js

// ¡4 páginas, 1 componente!
```

### 2. Mantenibilidad
```jsx
// Si necesitas cambiar el diseño de TODAS las cards:
// ANTES: Editar 4 archivos (nintendo, playstation, pc, tienda)
// DESPUÉS: Editar 1 archivo (ProductCard.js)
```

### 3. Testabilidad
```jsx
// Puedes testear cada componente de forma aislada
<ProductCard product={mockProduct} onAddToCart={mockFunction} />

// Sin depender de:
// - Páginas completas
// - Datos reales
// - Router
```

### 4. Escalabilidad
```jsx
// Fácil añadir nuevas páginas:
const Xbox = () => {
  const { filteredProducts } = useProductFilter(xboxProducts);
  return (
    <>
      <PageHeader title="XBOX" />
      <FilterBar filters={filters} />
      <ProductGrid products={filteredProducts} />
    </>
  );
};
// ¡Solo 10 líneas de código!
```

### 5. Performance
```jsx
// useMemo en useProductFilter previene recálculos innecesarios
const filteredProducts = useMemo(() => {
  // Solo se ejecuta si products o selectedCategory cambian
}, [products, selectedCategory]);
```

## Comparación de Código

### Antes (Código duplicado)
```
nintendo.js     ─┐
PlayStation.js  ─┤ 4 archivos × 250 líneas = 1000 líneas
pc.js           ─┤ ¡TODO DUPLICADO!
Tienda.js       ─┘
```

### Después (Componentes reutilizables)
```
Pages (4 × 50 líneas)          = 200 líneas
Atoms (4 componentes)          = 100 líneas
Molecules (2 componentes)      = 150 líneas
Organisms (2 componentes)      = 100 líneas
Hooks (2 hooks)                = 80 líneas
Data (4 archivos)              = 400 líneas
──────────────────────────────────────────
TOTAL                          = 1030 líneas

¡Pero ahora todo es REUTILIZABLE y MANTENIBLE!
```

### Beneficio Real
- **Antes**: 1000 líneas duplicadas + 0 reutilización
- **Después**: 1030 líneas organizadas + 100% reutilización

**Para añadir una nueva página:**
- **Antes**: 250 líneas nuevas (copiar/pegar/modificar)
- **Después**: 50 líneas nuevas (reutilizar componentes existentes)

## Próximos Pasos de Arquitectura

### 1. Context API para Estado Global
```
┌─────────────────┐
│  CartContext    │ ◄─── Estado global del carrito
└────────┬────────┘
         │
    ┌────┴─────┬──────────┬──────────┐
    │          │          │          │
    ▼          ▼          ▼          ▼
 Nintendo  PlayStation   PC      Tienda
```

### 2. API Layer
```
┌──────────────┐
│ API Service  │ ◄─── Centralizar llamadas HTTP
└──────┬───────┘
       │
   ┌───┴───┬────────┬────────┐
   │       │        │        │
   ▼       ▼        ▼        ▼
 getProducts  addToCart  checkout  auth
```

### 3. Template Components
```
┌────────────────────┐
│ ProductPageTemplate│ ◄─── Template reutilizable
└──────────┬─────────┘
           │
       ┌───┴───┬────────┬────────┐
       │       │        │        │
       ▼       ▼        ▼        ▼
   Nintendo PlayStation PC   Tienda
```

## Conclusión

Esta arquitectura transforma tu proyecto de "HTML con React" a **verdadero código React profesional**:

✅ **Componentes pequeños y enfocados**
✅ **Reutilización máxima**
✅ **Fácil de testear**
✅ **Fácil de mantener**
✅ **Fácil de escalar**
✅ **Optimizado para performance**

**¡Ahora tu código es digno de un proyecto profesional! 🚀**
