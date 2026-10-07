# Santelmates 🧉

E-commerce de productos artesanales de mate (yerberas, bombillas, mates, etc.) construido con React + Vite como proyecto integrador del curso.

## Stack

- **React** (componentes funcionales + hooks)
- **Vite** (bundler y dev server)
- **React Router DOM** (v7) para el enrutamiento
- **Firebase**
  - **Cloud Firestore**: catálogo de productos y órdenes de compra.
  - **Firebase Authentication** (email/contraseña): registro, login y sesión de usuarios.
- **Context API** para el estado global (carrito, favoritos y autenticación)
- **CSS Modules** para los estilos

## Cómo correr el proyecto

```bash
npm install
```

Creá un archivo `.env` en la raíz (mismo nivel que `package.json`) con las variables de tu proyecto de Firebase — fijate `.env.example` para ver los nombres exactos que hay que completar:

```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

El archivo `.env` está en `.gitignore` y nunca se sube al repositorio — la seguridad de los datos depende de la configuración de Firebase Authentication y de las reglas de Firestore, no de ocultar la API Key.

Después:

```bash
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Cargar el catálogo por primera vez

El catálogo vive en Firestore, no en el código. Para poblarlo, `src/firebase/seedProduts.js` exporta una función `seedProducts()` que sube el array de productos definido ahí mismo, usando `addDoc` (Firestore genera el ID de cada documento automáticamente). Para correrla una vez:

1. En `main.jsx`, descomentá temporalmente el `import` y la llamada a `seedProducts()`.
2. Corré `npm run dev`, recargá la página y mirá la consola del navegador — vas a ver un log por cada producto cargado.
3. Volvé a comentar esas dos líneas (si no, cada recarga vuelve a duplicar los productos, porque `addDoc` siempre crea documentos nuevos).

## Estructura del proyecto

```
src/
├── App.jsx                          # Layout raíz: Providers + BrowserRouter + Routes
├── main.jsx                         # Punto de entrada (renderiza <App />)
├── firebase/
│   ├── config.js                    # Inicializa Firebase, exporta `db` (Firestore) y `auth` (Authentication)
│   └── seedProduts.js               # Carga inicial del catálogo a Firestore (addDoc, se corre una sola vez)
├── services/
│   ├── firebaseProducts.js          # getProducts, getProductById y updateProducto (admin) contra Firestore
│   └── firebaseOrders.js            # crearOrden (transacción que descuenta stock), órdenes por usuario y todas (admin)
├── data/
│   └── categorias.js                # Fuente única de categorías/subcategorías (la usan NavBar y categoryPath)
├── utils/
│   ├── slugify.js                   # Normaliza texto a formato de URL (minúsculas, sin acentos, guiones)
│   └── categoryPath.js              # Calcula el array de tags de categoría de un producto (categoryPathFor)
├── hooks/
│   ├── useFetch.js                  # Hook genérico de fetch a una URL (sin uso actual)
│   ├── useProducts.js               # Trae el listado de productos desde Firestore
│   ├── useProductDetail.js          # Trae un producto por id desde Firestore
│   ├── useAuth.js                   # Lee el AuthContext
│   ├── useCart.js                   # useCart, useCartData y useCartActions
│   └── useFavorites.js              # Lee el FavoritesContext
├── context/
│   ├── contexts.js                  # Los objetos createContext (sin componentes)
│   ├── AuthContext.jsx              # AuthProvider: user, isAdmin, register, login, resetPassword, logout
│   ├── CartContext.jsx              # CartProvider: carrito (Data/Actions), guardado en localStorage
│   └── FavoritesContext.jsx         # FavoritesProvider
├── components/
│   ├── NavBar/                      # Navbar con categorías, buscador, AuthWidget y widgets
│   ├── AuthWidget/                  # Email + botón de cerrar sesión (o link a login) en la navbar
│   ├── Footer/
│   ├── CartWidget/                  # Ícono del carrito con contador (abre el CartDrawer)
│   ├── CartDrawer/                  # Panel lateral con el resumen del carrito
│   ├── Favorite/
│   │   ├── FavoriteButton/           # Botón de favorito compartido (card y detalle)
│   │   └── FavoritesWidget/          # Ícono de favoritos con contador
│   ├── Toast/                       # Notificación de "producto agregado"
│   ├── Skeletons/                   # Placeholders de carga (card y detalle)
│   ├── EmptyState/                  # Mensaje + CTA reutilizado en listas/carrito/checkout vacíos
│   ├── ProductInfo/                 # Info de producto compartida (card y detalle)
│   ├── ProductCarousel/             # Carrusel horizontal (loop infinito) de productos relacionados
│   ├── ItemListContainer/
│   │   ├── ItemListContainer.jsx    # Usa useProducts(categoryId), filtra, ordena y controla loading/error
│   │   ├── ItemList/                 # Renderiza la grilla de Items
│   │   └── Item/                     # Card de producto (catálogo)
│   └── ItemDetailContainer/
│       ├── ItemDetailContainer.jsx  # Usa useProductDetail(id); renderiza ItemDetail + ProductCarousel
│       ├── Breadcrumbs/              # Migas de pan (Catálogo / Categoría / Producto)
│       ├── ItemDetail/               # Vista completa del producto
│       └── ItemCount/                # Selector de cantidad (reutilizable)
└── pages/
    ├── Home/                        # Hero + catálogo + carrusel
    ├── Cart/                        # Vista del carrito (/cart)
    ├── Favoritos/                   # Vista de favoritos (/favoritos)
    ├── Login/                       # Inicio de sesión (/login)
    ├── Register/                    # Registro de usuario (/register)
    ├── RecuperarPassword/           # Envío de email para resetear la contraseña (/recuperar)
    ├── Checkout/                    # Checkout con renderizado condicional y orden real en Firestore (/checkout)
    ├── MisCompras/                  # Historial de órdenes del usuario (/mis-compras)
    ├── Admin/                       # Panel de admin: órdenes y edición de precio/stock (/admin)
    └── NotFound/                    # Página 404
```

## Enrutamiento

El `BrowserRouter` vive en `App.jsx`, envuelto por `AuthProvider`, `CartProvider` y `FavoritesProvider`, para que la sesión y el estado global estén disponibles en toda la app.

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home` | Hero + catálogo completo + carrusel de destacados |
| `/productos` | `ItemListContainer` | Catálogo completo, con orden y búsqueda |
| `/category/:categoryId` | `ItemListContainer` | Catálogo filtrado por categoría (consulta con `where` a Firestore) |
| `/item/:id` | `ItemDetailContainer` | Detalle de un producto (`doc` + `getDoc`) |
| `/cart` | `Cart` | Carrito de compras |
| `/favoritos` | `Favoritos` | Productos marcados como favoritos |
| `/login` | `Login` | Inicio de sesión |
| `/register` | `Register` | Registro con email y contraseña |
| `/recuperar` | `RecuperarPassword` | Recuperar contraseña por email |
| `/mis-compras` | `MisCompras` | Historial de compras del usuario logueado |
| `/admin` | `Admin` | Panel solo para usuarios con rol admin |
| `/checkout` | `Checkout` | Renderizado condicional: pide iniciar sesión si no hay usuario, o muestra el formulario de entrega y la confirmación de compra |
| `*` | `NotFound` | Página 404 |

La navegación interna se hace siempre con `<Link>` / `<NavLink>` (nunca `<a>`), para no perder el estado de los Contexts al navegar.

Todas las vistas salvo `Home` se cargan con `React.lazy` + `<Suspense>`: el código de cada página se descarga recién cuando el usuario entra a esa ruta, así la primera carga es más liviana.

## Firebase

### Configuración (`firebase/config.js`)

Inicializa la app de Firebase con las variables de entorno y exporta dos instancias que se usan en todo el proyecto:

- `db`: instancia de Cloud Firestore.
- `auth`: instancia de Firebase Authentication.

### Catálogo (`services/firebaseProducts.js`)

- `getProducts(categoryId)`: si viene `categoryId`, arma una consulta con `query` + `where('categoryPath', 'array-contains', slugify(categoryId))`; si no, trae todos los documentos de la colección `products`. Mapea el `id` del documento de Firestore al objeto que consume React.
- `getProductById(id)`: trae un único documento con `doc()` + `getDoc()`.

### Categorías (`data/categorias.js` + `utils/categoryPath.js`)

`categorias.js` es la única fuente de verdad de categorías y subcategorías (la usan tanto el `NavBar` para el menú como `categoryPathFor()` para calcular a qué "tags" pertenece un producto). Cada producto en Firestore guarda un campo `categoryPath` (array, ej. `["accesorios", "yerberas"]`) calculado a partir de su `category` — así, agregar una categoría nueva solo implica sumarla una vez en `categorias.js`, sin tocar productos existentes.

### Autenticación (`context/AuthContext.jsx`)

Expone `user`, `isAdmin`, `loading`, `register(email, password)`, `login(email, password)`, `resetPassword(email)` y `logout()`. `isAdmin` se lee del custom claim `admin` del token (`getIdTokenResult()`). Usa `onAuthStateChanged` para escuchar los cambios de sesión de Firebase y mantenerla sincronizada — incluida la persistencia al recargar la página, sin guardar nada manualmente en `localStorage`.

- `Login.jsx` / `Register.jsx`: formularios controlados con manejo de errores (traducidos a mensajes en español) y estado de carga durante la petición.
- `RecuperarPassword.jsx`: envía el email de reseteo con `sendPasswordResetEmail`. Muestra el mismo mensaje exista o no la cuenta, para no revelar qué emails están registrados.
- `AuthWidget.jsx`: en la navbar, muestra el email del usuario logueado con links a "Mis compras" (y "Admin" si corresponde) y un botón de "Cerrar sesión", o un link a "Iniciar sesión" si no hay sesión activa.
- Todos los formularios tienen sus `<label>` conectados a los inputs (`htmlFor` + `id`) y `autoComplete`, para accesibilidad y autocompletado del navegador.

## Custom hooks

- **`useProducts(categoryId)`**: trae el listado de productos desde Firestore (filtrado por categoría si corresponde). Devuelve `{ products, loading, error }`.
- **`useProductDetail(id)`**: trae un producto puntual por id desde Firestore. Devuelve `{ producto, loading, error }`.
- **`useFetch`**: hook genérico de fetch a una URL, sin uso actual en el proyecto.

Encapsular esta lógica en hooks separa el "cómo se consiguen los datos" del "cómo se muestran": los containers (`ItemListContainer`, `ItemDetailContainer`) solo llaman al hook correspondiente y quedan enfocados en el renderizado.

## Estado global con Context API

### CartContext

Dividido en dos contexts para optimizar renders:

- **`CartDataContext`**: expone los datos (`cart`, `totalItems`, `totalPrice`, `isCartOpen`, `toast`).
- **`CartActionsContext`**: expone las acciones (`addItem`, `removeItem`, `updateQuantity`, `clear`, `isInCart`, `openCart`, `closeCart`), envueltas en `useCallback`.

Hooks disponibles (en `hooks/useCart.js`): `useCartData()`, `useCartActions()`, y `useCart()` (combina ambos).

El carrito se guarda en `localStorage` cada vez que cambia y se lee al iniciar, así sobrevive a una recarga de página. Si el storage no está disponible (modo incógnito estricto) o lo guardado está roto, arranca vacío y sigue funcionando en memoria.

Todas las actualizaciones son inmutables (`.map()`, `.filter()`, spread). Al agregar un producto no se abre automáticamente el `CartDrawer`: se muestra un `Toast` de confirmación, y el drawer se abre solo al hacer clic en el `CartWidget`.

### FavoritesContext

Mismo patrón, más simple: `favorites`, `toggleFavorite`, `isFavorite`, `totalFavorites`.

### AuthContext

Ver la sección **Autenticación** más arriba.

Los tres Providers envuelven el `BrowserRouter` en `App.jsx`. Los objetos de contexto viven en `context/contexts.js` y los hooks en `hooks/`, para que cada archivo de Provider exporte solo un componente (requisito de Fast Refresh de Vite).

## Componentes de experiencia (UI)

- **`CartDrawer`**: panel lateral que se abre desde el `CartWidget`, muestra los items, subtotal y botones para ir al carrito o a checkout.
- **`Toast`**: notificación temporal ("Producto agregado al carrito") que se autodestruye a los 2.5s.
- **`Skeletons`** (`SkeletonCard`, `SkeletonDetail`): placeholders animados mientras se resuelven las consultas a Firestore.
- **`EmptyState`**: componente genérico reutilizado en catálogo sin resultados, categoría sin productos, favoritos vacíos y carrito vacío (incluido en el checkout).
- **`Breadcrumbs`**: migas de pan en la vista de detalle.
- **`CartWidget` / `FavoritesWidget` / `AuthWidget`**: íconos/controles con estado en la navbar.

## Catálogo y detalle de producto

- **`ItemListContainer`**: usa `useProducts(categoryId)` para traer los productos desde Firestore, controla `loading`/`error`, filtra por búsqueda (prop `busqueda`) y permite ordenar por precio o nombre. Distingue entre "la categoría no tiene productos todavía" (mensaje alentador) y "tu búsqueda no encontró nada" (mensaje distinto).
- **`Item`**: card de catálogo, `<Link>` completo hacia `/item/:id`, con el botón de favorito posicionado por fuera del link.
- **`ItemDetailContainer`**: usa `useProductDetail(id)`, maneja `loading`/`error`, y renderiza `ItemDetail` junto con un `ProductCarousel` de productos relacionados.
- **`ItemCount`**: muestra el stock disponible y no deja elegir más de lo que queda (descuenta lo que ya está en el carrito). Si no hay stock, muestra un aviso en vez del selector. El `CartContext` también limita las cantidades al stock, y los botones `+` del carrito se deshabilitan al llegar al máximo.
- **`ProductInfo`**: componente compartido entre `Item`, `ItemDetail` y `ProductCarousel`.

## Página del carrito (`Cart.jsx`)

Si está vacío, muestra un `EmptyState` con CTA al catálogo. Si tiene productos, lista cada item con imagen, precio unitario, controles de cantidad, subtotal y botón de eliminar, más el total general y botones para vaciar el carrito o ir a `/checkout`.

## Checkout

El contenido cambia según el estado del usuario (renderizado condicional dentro de `Checkout.jsx`):

- Mientras Firebase valida la sesión: spinner con "Verificando tu sesión...".
- Carrito vacío: `EmptyState` con CTA al catálogo.
- Sin sesión: mensaje "Iniciá sesión para continuar" con links a login y registro. Después de loguearse vuelve a `/checkout` con el carrito intacto (vive en el Context y la navegación no recarga la página).
- Con sesión: el formulario de entrega.

Layout en dos columnas (una sola en mobile): a la izquierda el formulario de entrega, a la derecha (fijo con `sticky`) un resumen "En tu carrito" con cada producto, cantidad y subtotal, más el total.

El formulario pide nombre y apellido, teléfono, dirección, ciudad e información adicional (opcional). Los campos obligatorios se validan antes de habilitar la generación de la orden — si falta alguno, se marca el error puntual y no se llega a crear nada en Firestore.

Al confirmar, `handlePurchase` vuelve a verificar (además de lo que ya filtran la ruta protegida y el estado del carrito) que haya usuario, carrito con productos y datos válidos, y recién ahí:

1. Arma un objeto `order` con `userId`, `userEmail`, los datos del comprador (`buyer`), los productos (`id`, `name`, `price`, `quantity`), el `total` y `createdAt` (`serverTimestamp()`).
2. Llama a `crearOrden(order)` (`services/firebaseOrders.js`), que usa una **transacción** (`runTransaction`): lee el stock actual de cada producto, y si alcanza, guarda la orden en `orders` y descuenta el stock — todo junto. Si a algún producto no le alcanza el stock, no se escribe nada y se avisa cuál es.
3. Muestra el ID generado por Firestore como confirmación (con link a "Mis compras").
4. Vacía el carrito — **solo** si la transacción tuvo éxito; si falla, el carrito no se toca y se muestra un mensaje de error.

## Seguridad (reglas de Firestore)

Las reglas viven en [`firestore.rules`](firestore.rules) (versionadas en el repo) y se publican con Firebase CLI:

```bash
firebase deploy --only firestore:rules
```

Resumen de lo que validan:

- **Roles**: existe un rol `admin`, asignado como *custom claim* desde el Admin SDK (`admin.auth().setCustomUserClaims(uid, { admin: true })`). Las reglas lo leen con `request.auth.token.admin == true`.
- **`products`**: lectura pública. Solo un admin puede crear/editar/borrar, y al crear o editar se valida la forma del documento (campos permitidos, `price > 0`, `stock` entero `>= 0`, largos de texto). Un comprador logueado solo puede **bajar** el `stock` (nunca subirlo ni tocar otro campo), y únicamente si en `lastOrderId` indica una orden suya que se está creando en esa misma transacción (`existsAfter` / `getAfter`).
- **`orders`**:
  - Crear: con sesión activa, a nombre propio (`userId == request.auth.uid` y `userEmail` igual al email del token), con exactamente los campos esperados, datos del comprador válidos, entre 1 y 50 productos, `total > 0` y `createdAt == request.time` (obliga a usar `serverTimestamp()`).
  - Leer: cada usuario solo sus órdenes; el admin puede leer todas.
  - Editar / borrar: nunca desde el cliente.
- **Cualquier otra colección**: cerrada por defecto.

Limitaciones: las reglas no pueden recorrer listas, así que solo se valida el primer ítem de `items` como muestra; tampoco pueden verificar que el `total` coincida con los precios reales del catálogo, ni que lo descontado de stock coincida exactamente con las cantidades de la orden. Para eso haría falta generar la orden desde una Cloud Function.

> Ojo: `seedProducts()` escribe desde el cliente, así que para correrlo hay que estar logueado con un usuario `admin`.

## Testing

Tests con **Vitest** + **React Testing Library** (entorno `jsdom`):

```bash
npm test          # modo watch
npx vitest run    # una sola corrida
```

- `src/context/CartContext.test.jsx`: lógica del carrito (agregar sin duplicar, sumar cantidades, totales, límite de stock, `updateQuantity` a 0, `removeItem`, `clear`, toast, persistencia en `localStorage` y error fuera del Provider).
- `src/pages/Checkout/Checkout.test.jsx`: flujo de compra con Firebase mockeado (loader de sesión, carrito vacío, sin sesión, validación de campos, creación de la orden con los datos correctos, y que el carrito **no** se vacíe si Firestore falla o falta stock).
- `src/services/firebaseOrders.test.js`: la transacción de `crearOrden` (descuenta el stock de cada producto, y si a uno no le alcanza no escribe nada).

## Notas importantes

- El carrito persiste al recargar (`localStorage`); los favoritos viven solo en memoria. La sesión de autenticación persiste al recargar (la maneja Firebase con `onAuthStateChanged`).
- El catálogo y las órdenes son datos reales en Cloud Firestore, no simulados.
- `.env` nunca se sube al repositorio (está en `.gitignore`); `.env.example` documenta los nombres de las variables necesarias sin sus valores.

## Deploy en Vercel

1. Importar el repo en Vercel (framework: Vite, build `npm run build`, output `dist`).
2. En **Settings → Environment Variables**, cargar las 6 variables `VITE_FIREBASE_*` de `.env.example` y volver a desplegar.
3. En Firebase Console → **Authentication → Settings → Dominios autorizados**, agregar el dominio de Vercel (ej. `nombre-del-proyecto.vercel.app`).
4. `vercel.json` redirige todas las rutas a `index.html`, así las rutas internas (`/item/:id`, `/cart`, `/checkout`) funcionan al recargar el navegador.

## Mis compras y panel de admin

- **`/mis-compras`**: lista las órdenes del usuario logueado (`where('userId', '==', uid)`), de la más nueva a la más vieja, con fecha, productos, total y dirección de entrega.
- **`/admin`**: solo para usuarios con el custom claim `admin` (se asigna con `node scripts/hacerAdmin.mjs email`, ver más abajo). Tiene dos pestañas: **Órdenes** (todas, con datos del cliente y total vendido) y **Productos** (editar precio y stock de cada producto). Las reglas de Firestore son las que realmente protegen estos datos: aunque alguien entre a `/admin`, sin el claim Firestore rechaza las lecturas y escrituras.

### Cómo crear un admin

1. Firebase Console → Configuración del proyecto → Cuentas de servicio → **Generar nueva clave privada**.
2. Guardar el archivo como `serviceAccountKey.json` en la raíz (está en `.gitignore`, **nunca subirlo**).
3. `node scripts/hacerAdmin.mjs email@ejemplo.com`
4. Cerrar sesión y volver a entrar para que el token incluya el rol.

## Próximos pasos

- Favoritos persistentes por usuario (guardarlos en Firestore).
- Generar las órdenes desde una Cloud Function para validar precios y stock del lado del servidor.