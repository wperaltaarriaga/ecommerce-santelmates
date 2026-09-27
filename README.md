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
│   └── firebaseProducts.js          # getProducts(categoryId) y getProductById(id) contra Firestore
├── data/
│   └── categorias.js                # Fuente única de categorías/subcategorías (la usan NavBar y categoryPath)
├── utils/
│   ├── slugify.js                   # Normaliza texto a formato de URL (minúsculas, sin acentos, guiones)
│   └── categoryPath.js              # Calcula el array de tags de categoría de un producto (categoryPathFor)
├── hooks/
│   ├── useFetch.js                  # Hook genérico de fetch a una URL (sin uso actual)
│   ├── useProducts.js               # Trae el listado de productos desde Firestore
│   └── useProductDetail.js          # Trae un producto por id desde Firestore
├── context/
│   ├── AuthContext.jsx              # Estado global de autenticación (user, register, login, logout)
│   ├── CartContext.jsx              # Estado global del carrito (dividido en Data/Actions)
│   └── FavoritesContext.jsx         # Estado global de favoritos
├── components/
│   ├── NavBar/                      # Navbar con categorías, buscador, AuthWidget y widgets
│   ├── AuthWidget/                  # Email + botón de cerrar sesión (o link a login) en la navbar
│   ├── ProtectedRoute/              # Redirige a /login si no hay sesión activa
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
    ├── Checkout/                    # Checkout protegido, con orden real en Firestore (/checkout)
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
| `/checkout` | `Checkout` (protegida por `ProtectedRoute`) | Formulario de entrega y confirmación de compra — requiere sesión activa |
| `*` | `NotFound` | Página 404 |

La navegación interna se hace siempre con `<Link>` / `<NavLink>` (nunca `<a>`), para no perder el estado de los Contexts al navegar.

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

Expone `user`, `loading`, `register(email, password)`, `login(email, password)` y `logout()`. Usa `onAuthStateChanged` para escuchar los cambios de sesión de Firebase y mantenerla sincronizada — incluida la persistencia al recargar la página, sin guardar nada manualmente en `localStorage`.

- `Login.jsx` / `Register.jsx`: formularios controlados con manejo de errores (traducidos a mensajes en español) y estado de carga durante la petición.
- `ProtectedRoute.jsx`: envuelve rutas que requieren sesión (`/checkout`); si no hay usuario, redirige a `/login` guardando la ruta de origen para volver ahí después de loguearse.
- `AuthWidget.jsx`: en la navbar, muestra el email del usuario logueado y un botón de "Cerrar sesión", o un link a "Iniciar sesión" si no hay sesión activa.

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

Hooks disponibles: `useCartData()`, `useCartActions()`, y `useCart()` (combina ambos).

Todas las actualizaciones son inmutables (`.map()`, `.filter()`, spread). Al agregar un producto no se abre automáticamente el `CartDrawer`: se muestra un `Toast` de confirmación, y el drawer se abre solo al hacer clic en el `CartWidget`.

### FavoritesContext

Mismo patrón, más simple: `favorites`, `toggleFavorite`, `isFavorite`, `totalFavorites`.

### AuthContext

Ver la sección **Autenticación** más arriba.

Los tres Providers envuelven el `BrowserRouter` en `App.jsx`. El carrito y los favoritos siguen en memoria (se reinician al recargar la página); la sesión de autenticación, en cambio, **sí persiste** al recargar, porque la maneja Firebase.

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
- **`ItemCount`**: selector de cantidad, respeta el stock, llama a `addItem` del `CartContext`.
- **`ProductInfo`**: componente compartido entre `Item`, `ItemDetail` y `ProductCarousel`.

## Página del carrito (`Cart.jsx`)

Si está vacío, muestra un `EmptyState` con CTA al catálogo. Si tiene productos, lista cada item con imagen, precio unitario, controles de cantidad, subtotal y botón de eliminar, más el total general y botones para vaciar el carrito o ir a `/checkout`.

## Checkout

Ruta protegida por `ProtectedRoute`: si no hay sesión, redirige a `/login` (y vuelve a `/checkout` después de loguearse). Si el carrito está vacío, muestra un `EmptyState` en vez del formulario.

Layout en dos columnas (una sola en mobile): a la izquierda el formulario de entrega, a la derecha (fijo con `sticky`) un resumen "En tu carrito" con cada producto, cantidad y subtotal, más el total.

El formulario pide nombre y apellido, teléfono, dirección, ciudad e información adicional (opcional). Los campos obligatorios se validan antes de habilitar la generación de la orden — si falta alguno, se marca el error puntual y no se llega a crear nada en Firestore.

Al confirmar, `handlePurchase` vuelve a verificar (además de lo que ya filtran la ruta protegida y el estado del carrito) que haya usuario, carrito con productos y datos válidos, y recién ahí:

1. Arma un objeto `order` con `userId`, `userEmail`, los datos del comprador (`buyer`), los productos (`id`, `name`, `price`, `quantity`), el `total` y `createdAt` (`serverTimestamp()`).
2. Lo guarda con `addDoc` en la colección `orders`.
3. Muestra el ID generado por Firestore como confirmación.
4. Vacía el carrito — **solo** si `addDoc` tuvo éxito; si falla, el carrito no se toca y se muestra un mensaje de error.

## Seguridad (reglas de Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /products/{productId} {
      allow read: if true;
      allow write: if false;
    }
    match /orders/{orderId} {
      allow create: if request.auth != null
        && request.resource.data.userId == request.auth.uid;
      allow read: if request.auth != null
        && resource.data.userId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

Cualquiera puede leer el catálogo (`products`) sin necesidad de loguearse, pero nadie puede escribirlo desde el cliente (se carga solo por `seedProduts.js` o desde la consola de Firebase). Las órdenes (`orders`) solo se pueden crear con sesión activa y con el `userId` propio — nunca a nombre de otro usuario — y no se pueden editar ni borrar desde el cliente una vez creadas.

## Notas importantes

- El estado del carrito y de favoritos vive en memoria (Context API); se reinicia si se recarga la página. La sesión de autenticación, en cambio, persiste al recargar (la maneja Firebase con `onAuthStateChanged`).
- El catálogo y las órdenes son datos reales en Cloud Firestore, no simulados.
- `.env` nunca se sube al repositorio (está en `.gitignore`); `.env.example` documenta los nombres de las variables necesarias sin sus valores.

## Próximos pasos

- Pantalla de "Mis compras" para que cada usuario vea el historial de sus propias órdenes.
- Deploy a producción (Vercel).