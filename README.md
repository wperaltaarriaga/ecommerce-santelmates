# Santelmates 🧉

E-commerce de productos artesanales de mate (yerberas, bombillas, mates, etc.) construido con React + Vite como proyecto integrador del curso.

## Stack

- **React** (componentes funcionales + hooks)
- **Vite** (bundler y dev server)
- **React Router DOM** (v7) para el enrutamiento
- **Context API** para el estado global (carrito y favoritos)
- **CSS Modules** para los estilos
- Datos simulados con una **Promise + setTimeout** (sin backend real todavía)

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

## Estructura del proyecto

```
src/
├── App.jsx                        # Layout raíz: Providers + BrowserRouter + Routes
├── main.jsx                       # Punto de entrada (renderiza <App />)
├── mock/
│   └── asyncMock.js                # Array de productos + getProducts() (Promise, 2000ms)
├── services/
│   └── getProductById.js           # Busca un producto por id (Promise)
├── hooks/
│   ├── useFetch.js                 # Hook genérico de fetch a una URL (preparado para API real)
│   ├── useProducts.js              # Trae el listado de productos (hoy desde el mock)
│   └── useProductDetail.js         # Trae un producto por id (hoy desde el mock)
├── context/
│   ├── CartContext.jsx             # Estado global del carrito (dividido en Data/Actions)
│   └── FavoritesContext.jsx        # Estado global de favoritos
├── components/
│   ├── NavBar/                     # Navbar con categorías, buscador y widgets
│   ├── Footer/
│   ├── CartWidget/                 # Ícono del carrito con contador (abre el CartDrawer)
│   ├── CartDrawer/                 # Panel lateral con el resumen del carrito
│   ├── Favorite/
│   │   ├── FavoriteButton/          # Botón de favorito compartido (card y detalle)
│   │   └── FavoritesWidget/         # Ícono de favoritos con contador
│   ├── Toast/                      # Notificación de "producto agregado"
│   ├── Skeletons/                  # Placeholders de carga (card y detalle)
│   ├── EmptyState/                 # Mensaje + CTA para listas vacías
│   ├── ProductInfo/                # Info de producto compartida (card y detalle)
│   ├── ProductCarousel/            # Carrusel horizontal de productos destacados
│   ├── ItemListContainer/
│   │   ├── ItemListContainer.jsx   # Usa useProducts(), filtra, ordena y controla loading
│   │   ├── ItemList/                # Renderiza la grilla de Items
│   │   └── Item/                    # Card de producto (catálogo)
│   └── ItemDetailContainer/
│       ├── ItemDetailContainer.jsx # Usa useProductDetail(id); renderiza ItemDetail + ProductCarousel
│       ├── Breadcrumbs/             # Migas de pan (Catálogo / Categoría / Producto)
│       ├── ItemDetail/              # Vista completa del producto
│       └── ItemCount/               # Selector de cantidad (reutilizable)
└── pages/
    ├── Home.jsx                    # Hero + catálogo + carrusel
    ├── Cart/                       # Vista del carrito (/cart)
    ├── Favoritos/                  # Vista de favoritos (/favoritos)
    ├── Checkout/                   # Simulación de compra (/checkout)
    └── NotFound/                   # Página 404
```

## Enrutamiento

El `BrowserRouter` vive en `App.jsx`, envolviendo tanto el `NavBar` como las `Routes`, para que la navegación esté disponible en toda la app.

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home` | Hero + catálogo completo + carrusel de destacados |
| `/productos` | `ItemListContainer` | Catálogo completo, con orden y búsqueda |
| `/category/:categoryId` | `ItemListContainer` | Catálogo filtrado por categoría |
| `/item/:id` | `ItemDetailContainer` | Detalle de un producto |
| `/cart` | `Cart` | Carrito de compras |
| `/favoritos` | `Favoritos` | Productos marcados como favoritos |
| `/checkout` | `Checkout` | Simulación de finalización de compra |
| `*` | `NotFound` | Página 404 |

La navegación interna se hace siempre con `<Link>` / `<NavLink>` (nunca `<a>`), para no perder el estado de los Contexts al navegar.

## Custom hooks

- **`useProducts`**: trae el listado completo de productos (hoy desde `getProducts()` del mock). Devuelve `{ products, loading, error }`.
- **`useProductDetail(id)`**: trae un producto puntual por id (hoy desde `getProductById()`). Devuelve `{ producto, loading, error }`.
- **`useFetch`**: hook genérico de fetch a una URL, dejado preparado para cuando se conecte una API real (por ahora sin usar).

Encapsular esta lógica en hooks separa el "cómo se consiguen los datos" del "cómo se muestran": los containers (`ItemListContainer`, `ItemDetailContainer`) solo llaman al hook correspondiente y quedan enfocados en el renderizado. El día que se reemplace el mock por una API real, el cambio queda contenido adentro del hook, sin tocar los componentes que lo consumen.

## Estado global con Context API

### CartContext

Está dividido en dos contexts para optimizar renders:

- **`CartDataContext`**: expone los datos (`cart`, `totalItems`, `totalPrice`, `isCartOpen`, `toast`).
- **`CartActionsContext`**: expone las acciones (`addItem`, `removeItem`, `updateQuantity`, `clear`, `isInCart`, `openCart`, `closeCart`), todas envueltas en `useCallback` para que su referencia no cambie entre renders.

Hooks disponibles:
- `useCartData()` / `useCartActions()`: para consumir solo lo que se necesita.
- `useCart()`: combina ambos, pensado para componentes que necesitan de todo un poco (como `Cart.jsx`).

Todas las actualizaciones son inmutables (`.map()`, `.filter()`, spread), nunca se muta el array `cart` directamente.

Al agregar un producto (`addItem`) **no se abre automáticamente el CartDrawer**: solo se muestra un `Toast` de confirmación. El drawer se abre exclusivamente al hacer clic en el `CartWidget` de la navbar.

### FavoritesContext

Mismo patrón, más simple (un solo context): `favorites`, `toggleFavorite`, `isFavorite`, `totalFavorites`.

Ambos Providers envuelven el `BrowserRouter` en `App.jsx`, así que el estado persiste al navegar entre rutas (se pierde solo si se recarga la página por completo, porque es estado en memoria).

## Componentes de experiencia (UI)

- **`CartDrawer`**: panel lateral que se abre desde el `CartWidget`, muestra los items, subtotal y botones para ir al carrito o a checkout.
- **`Toast`**: notificación temporal ("Producto agregado al carrito") que se autodestruye a los 2.5s.
- **`Skeletons`** (`SkeletonCard`, `SkeletonDetail`): placeholders animados (shimmer) que se muestran mientras `getProducts()` / `getProductById()` resuelven su Promise.
- **`EmptyState`**: componente genérico reutilizado en catálogo sin resultados, favoritos vacíos y carrito vacío.
- **`Breadcrumbs`**: migas de pan en la vista de detalle.
- **`CartWidget` / `FavoritesWidget`**: íconos con contador en la navbar.

## Catálogo y detalle de producto

- **`ItemListContainer`**: usa el hook `useProducts()` para traer los productos, controla el estado de `loading`, filtra por categoría (`useParams`) y por búsqueda (prop `busqueda`), y permite ordenar por precio o nombre.
- **`Item`**: card de catálogo, es un `<Link>` completo hacia `/item/:id`, con el botón de favorito posicionado por fuera del link para que no dispare la navegación.
- **`ItemDetailContainer`**: usa el hook `useProductDetail(id)` para traer un producto puntual, maneja `loading` y `error`, y renderiza `ItemDetail` junto con un `ProductCarousel` de productos relacionados.
- **`ItemDetail`**: vista completa del producto (breadcrumb, imagen, botón de favorito, info y `ItemCount`).
- **`ItemCount`**: selector de cantidad reutilizado en el detalle, respeta el stock y no permite valores negativos; al agregar, llama a `addItem` del `CartContext`.
- **`ProductInfo`**: componente compartido entre `Item`, `ItemDetail` y `ProductCarousel` (con prop `variant` para adaptar el heading, y el precio es opcional para poder ocultarlo en el carrusel).

## Página del carrito (`Cart.jsx`)

- Si el carrito está vacío, muestra un `EmptyState` con CTA al catálogo.
- Si tiene productos, lista cada item con imagen, precio unitario, controles de cantidad (+/-), subtotal y botón de eliminar.
- Muestra el total general y botones para vaciar el carrito o ir a `/checkout`.

## Checkout

Simulación de finalización de compra: al enviar el formulario se muestra un estado de "procesando" (2s) y luego un mensaje de éxito con redirección automática a `/` (3s), además de botones para volver antes o cancelar.

## Notas importantes

- El estado del carrito y de favoritos vive en memoria (Context API), no hay persistencia real todavía. Si se recarga la página por completo (o se escribe una URL directamente en la barra de direcciones), el estado se reinicia — es el comportamiento esperado, no un bug.
- Los datos de productos son simulados con `getProducts()` / `getProductById()`, que devuelven Promises con delay artificial (2000ms y 500ms respectivamente) para practicar el manejo de estados de carga.

## Próximos pasos

- Persistencia real con Firebase (guardar orden de compra, descontar stock).
- Migrar `useProducts` / `useProductDetail` para consumir una API real (usando `useFetch`).
- Formulario de checkout con validación de datos del comprador.
- Deploy a producción (Vercel).