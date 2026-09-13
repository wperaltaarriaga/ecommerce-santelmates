# Santelmates 🧉

E-commerce de mates artesanales, desarrollado con **React + Vite** como práctica de composición de componentes, manejo de estado (`useState`), efectos (`useEffect`), simulación de datos asíncronos con `Promise`, y navegación con **React Router** (rutas dinámicas, layout persistente y checkout con navegación programática).

## Stack

- React
- Vite
- React Router DOM
- Bootstrap (estilos base)
- CSS Modules

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`. No requiere ninguna API externa ni servidor adicional: los datos de productos se simulan localmente con un mock asíncrono (ver sección "Simulación de datos").

## Estructura del proyecto

```
src/
  mock/
    asyncMock.js
  services/
    getProductById.js
  components/
    NavBar/
      NavBar.jsx
      NavBar.module.css
    Footer/
      Footer.jsx
      Footer.module.css
    CartWidget/
      CartWidget.jsx
      CartWidget.module.css
    ItemListContainer/
      ItemListContainer.jsx
      ItemListContainer.module.css
      ItemList/
        ItemList.jsx
        ItemList.module.css
      Item/
        Item.jsx
        Item.module.css
    ItemDetailContainer/
      ItemDetailContainer.jsx
      ItemDetailContainer.module.css
      ItemDetail/
        ItemDetail.jsx
        ItemDetail.module.css
      ItemCount/
        ItemCount.jsx
        ItemCount.module.css
    ProductInfo/
      ProductInfo.jsx
      ProductInfo.module.css
    FavoriteButton/
      FavoriteButton.jsx
      FavoriteButton.module.css
  pages/
    Home.jsx
    Home.module.css
    Checkout/
      Checkout.jsx
      Checkout.module.css
    NotFound/
      NotFound.jsx
      NotFound.module.css
  App.jsx
  App.module.css
  main.jsx
  index.css
public/
  hero/
    hero-mate.jpg
  imagenes/
```

## Enrutamiento

`BrowserRouter` se declara dentro de `App.jsx` (no en `main.jsx`), envolviendo tanto el layout persistente (`NavBar` + `Footer`) como el `<Routes>`. Esto hace que `App` funcione como el layout de toda la aplicación: `NavBar` y `Footer` se escriben una única vez, fuera de `<Routes>`, y se mantienen fijos en pantalla sin importar qué ruta esté activa.

```jsx
<BrowserRouter>
  <div className={styles.page}>
    <NavBar busqueda={busqueda} setBusqueda={setBusqueda} />
    <main className={styles.main}>
      <Routes>...</Routes>
    </main>
    <Footer />
  </div>
</BrowserRouter>
```

### Tabla de rutas

| Ruta | Componente | Descripción |
|---|---|---|
| `/` | `Home` | Página de bienvenida con hero de imagen de fondo. |
| `/productos` | `ItemListContainer` | Catálogo completo, sin filtro de categoría. |
| `/category/:categoryId` | `ItemListContainer` | Catálogo filtrado dinámicamente por categoría según el parámetro de la URL. |
| `/item/:id` | `ItemDetailContainer` | Vista de detalle de un producto puntual, identificado por su id en la URL. |
| `/checkout` | `Checkout` | Simulación de pago con formulario y redirección automática. |
| `*` | `NotFound` | Página 404 para cualquier URL que no matchea ninguna ruta anterior. |

### Navegación por categoría (`/category/:categoryId`)

Las categorías del `NavBar` son `NavLink` que apuntan directo a una URL, en vez de botones que solo cambiaban un estado local:

```jsx
<NavLink to={`/category/${categoria.toLowerCase()}`}>{categoria}</NavLink>
```

`ItemListContainer` lee ese parámetro con `useParams()` y filtra el catálogo ya cargado:

```jsx
const { categoryId } = useParams()

const itemsFiltrados = items
  .filter((item) => !categoryId || item.category.toLowerCase() === categoryId.toLowerCase())
  .filter((item) => item.name.toLowerCase().includes((busqueda || '').toLowerCase()))
```

Como la categoría vive en la URL (no en estado de React compartido a mano entre componentes), el filtro funciona desde cualquier página de la app —incluida la vista de detalle— sin necesitar lógica adicional de sincronización.

### Detalle de producto (`/item/:id`)

`Item` (la card del catálogo) enlaza a cada producto con `Link`:

```jsx
<Link to={`/item/${id}`}>Ver detalle</Link>
```

`ItemDetailContainer` lee el id con `useParams()` y, cuando cambia (el usuario navega de un producto a otro sin recargar), vuelve a buscar el producto correspondiente:

```jsx
const { id } = useParams()

useEffect(() => {
  // ...getProductById(id)...
}, [id])
```

### Ruta 404

`path="*"` actúa como comodín: React Router evalúa las rutas en orden, así que esta, al ser la última, captura cualquier URL que no coincidió con ninguna de las anteriores. `NotFound` muestra un "404" grande de fondo con el mensaje y enlaces (`Link`) de vuelta a `Inicio` y `Catálogo`.

## Simulación de datos asíncronos

En lugar de consumir una API externa, el catálogo vive en un **mock local** (`src/mock/asyncMock.js`) que simula el comportamiento de una petición de red real:

- Un array `products` con 12 productos, cada uno con `id`, `name`, `price`, `category`, `img`, `stock` y `description`.
- La función `getProducts()`, que retorna una `Promise`. Un `setTimeout` de 2000ms simula la demora de red antes de resolver con el array completo.

`ItemListContainer` consume esto con `useState` + `useEffect` (array de dependencias vacío, para que la carga ocurra una única vez al montar) y `async/await`. Mientras `loading` es `true` se muestra "Cargando productos...".

`src/services/getProductById.js` reutiliza `getProducts()` para buscar un producto puntual por `id` con `.find()` (nunca por índice/posición), y rechaza la promesa si no existe ningún producto con ese id.

## Componentes

### `NavBar`
Presente en todas las páginas (vive en `App`, fuera de `<Routes>`). Contiene el branding, enlaces de navegación (`NavLink` a `/` y `/productos`, con estilo condicional según la ruta activa), las categorías como `NavLink` dinámicos hacia `/category/:categoryId`, un input de búsqueda y el `CartWidget`.

### `Footer`
Presente en todas las páginas, junto al `NavBar`. Contiene el copyright de la marca.

### `CartWidget`
Ícono de carrito con badge de cantidad (prop `cantidad`, hardcodeada por ahora; pendiente de conectar a un estado global del carrito).

### `ItemListContainer`
Obtiene los productos del mock, lee `categoryId` de la URL con `useParams`, y filtra por categoría y por texto de búsqueda antes de pasarle el resultado a `ItemList`. No hace el `.map()` de productos ni conoce la forma de la card: esa responsabilidad es de `ItemList`/`Item`.

### `ItemList`
Recorre los productos filtrados con `.map()` y renderiza un `Item` por cada uno, con `key={item.id}` en el elemento retornado por el `.map()` (id real del mock, nunca el índice).

### `Item`
Card de producto en el catálogo. Recibe `item` por props y arma: imagen + `FavoriteButton`, el bloque de información (`ProductInfo`) y un botón "Ver detalle" que enlaza a `/item/:id`. No incluye `ItemCount` (ese control solo tiene sentido en la vista de detalle, donde se conoce el stock real).

### `ItemDetailContainer`
Lee `id` de la URL con `useParams()`, ejecuta `getProductById(id)` dentro de un `useEffect` con dependencia `[id]`, guarda el resultado en estado y delega toda la presentación a `ItemDetail`. Maneja los estados de carga y error.

### `ItemDetail`
Vista de detalle completa. Arma: imagen + `FavoriteButton`, el bloque de información (`ProductInfo`, en su variante `detail`, con tipografía más grande) y `ItemCount` con el stock real del producto.

### `ProductInfo` (compartido)
Componente de presentación puro, extraído para eliminar la duplicación que existía entre `Item` e `ItemDetail`: ambos mostraban exactamente el mismo bloque (categoría, nombre, precio, descripción), solo con distinto tamaño de tipografía. Recibe `category`, `name`, `price`, `description` y una prop `variant` (`'card'` por defecto o `'detail'`) que decide si el título se renderiza como `h3` o `h1`, y aplica los tamaños de fuente correspondientes vía una clase modificadora en CSS.

```jsx
<ProductInfo category={category} name={name} price={price} description={description} />
<ProductInfo ... variant="detail" />
```

### `FavoriteButton` (compartido)
Botón de favorito (🤍 / ❤️) extraído a su propio componente, reutilizado tanto en `Item` como en `ItemDetail`. Mantiene su propio estado `esFavorito` (`useState`), independiente por cada instancia.

### `ItemCount`
Contador reutilizable con botones `-`/`+`. Si recibe la prop `stock`, respeta ese tope máximo (`Math.min`); nunca permite bajar de cero. Se usa únicamente dentro de `ItemDetail`.

### `Checkout`
Simula un flujo de pago real usando `onSubmit` + `event.preventDefault()` (evita la recarga completa de la página que rompería el estado de React). Usa `useNavigate()`:

- Redirección automática a `/` unos segundos después de completar el pago simulado.
- Botón "Volver ya mismo" con navegación inmediata (`navigate('/')`).
- Botón "Cancelar" con `navigate(-1)`, equivalente a apretar "atrás" en el navegador.

### `NotFound`
Página comodín para `path="*"`. Muestra un "404" grande de fondo (marca de agua) con el mensaje de error superpuesto y dos enlaces de vuelta (`Inicio` / `Ver catálogo`).

## Próximos pasos

- Conectar `CartWidget` y `ItemCount` a un `CartContext` (Context API) para un carrito funcional real, evitando prop drilling.
- Persistir el carrito en `localStorage`.
- Agregar tests unitarios con Vitest + React Testing Library.
- Debounce en el input de búsqueda.