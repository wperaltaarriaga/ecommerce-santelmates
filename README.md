# Santelmates 🧉

E-commerce de mates artesanales, desarrollado con **React + Vite** como práctica de composición de componentes, manejo de estado (`useState`), efectos (`useEffect`), simulación de datos asíncronos con `Promise`, y navegación con **React Router**.

## Stack

- React
- Vite
- React Router DOM
- CSS Modules

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

No requiere ninguna API externa ni servidor adicional: los datos de productos se simulan localmente con un mock asíncrono (ver sección "Simulación de datos").

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
    CartWidget/
      CartWidget.jsx
      CartWidget.module.css
    ItemListContainer/
      ItemListContainer.jsx
      ItemListContainer.module.css
    ItemList/
      ItemList.jsx
      ItemList.module.css
    ProductCard/
      ProductCard.jsx
      ProductCard.module.css
    ItemCount/
      ItemCount.jsx
      ItemCount.module.css
    ItemDetailContainer/
      ItemDetailContainer.jsx
      ItemDetailContainer.module.css
    ItemDetail/
      ItemDetail.jsx
      ItemDetail.module.css
  pages/
    Home.jsx
    Home.module.css
    NotFound.jsx
  App.jsx
  App.css
  main.jsx
  index.css
public/
  hero/
    hero-mate.jpg
```

## Simulación de datos asíncronos

En lugar de consumir una API externa, el catálogo de productos vive en un **mock local** que simula el comportamiento de una petición de red real.

### `src/mock/asyncMock.js`

Contiene:

- Un array `products` con 12 productos de ejemplo. Cada uno tiene las propiedades `id`, `name`, `price`, `category`, `img`, `stock` y `description`.
- La función `getProducts()`, que retorna una `Promise`. Dentro de la promesa, un `setTimeout` de 1000ms simula la demora de una petición de red antes de resolver con el array completo de productos.

```jsx
export function getProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products)
    }, 1000)
  })
}
```

### Consumo en `ItemListContainer`

`ItemListContainer` define sus propios estados con `useState` (`items`, inicializado como array vacío, y `loading`, inicializado en `true`), y dentro de un `useEffect` con array de dependencias vacío (`[]`) llama a `getProducts()` de forma asincrónica:

```jsx
useEffect(() => {
  const fetchItems = async () => {
    const data = await getProducts()
    setItems(data)
    setLoading(false)
  }
  fetchItems()
}, [])
```

El array de dependencias vacío garantiza que la carga simulada ocurra una única vez, al montar el componente. Si se omitiera, el efecto se dispararía en cada render y, como dentro de él se actualiza el estado, entraría en un bucle infinito.

Mientras `loading` es `true`, se muestra "Cargando productos..."; una vez resuelta la promesa, se filtra el array (`itemsFiltrados`) según la categoría activa y el texto de búsqueda, y se renderiza `<ItemList items={itemsFiltrados} />`.

### `src/services/getProductById.js`

Función usada por `ItemDetailContainer` para obtener un producto puntual por su `id`. También retorna una `Promise`: internamente reutiliza `getProducts()` del mock, busca dentro del array con `.find(p => p.id === Number(productId))` (nunca por posición/índice) y resuelve con el producto encontrado, o rechaza con un error si no existe ningún producto con ese id.

## Componentes

### `App`
Envuelto por `BrowserRouter` (definido en `main.jsx`). Centraliza el estado compartido `categoriaActiva` y `busqueda`, que baja por props a `NavBar` (para modificarlos) e `ItemListContainer` (para filtrar con ellos). Define las rutas de la aplicación con `Routes`/`Route`:

| Ruta | Componente |
|---|---|
| `/` | `Home` |
| `/productos` | `ItemListContainer` |
| `/detalle/:id` | `ItemDetailContainer` |
| `*` | `NotFound` (404) |

### `NavBar`
Presente en todas las páginas (se renderiza fuera de `<Routes>`, arriba). Contiene el branding, enlaces de navegación (`NavLink` a `/` y `/productos`, con estilo condicional según la ruta activa), las categorías de producto como filtro tipo píldora, un input de búsqueda y el `CartWidget`.

### `Home`
Página de bienvenida con hero de imagen de fondo, mostrada en la ruta `/`.

### `CartWidget`
Ícono de carrito con badge de cantidad (prop `cantidad`, hardcodeada por ahora).

### `ItemListContainer`
Ver sección "Simulación de datos asíncronos" arriba. No hace el `.map()` de productos: esa responsabilidad es de `ItemList`.

### `ItemList`
Recorre los productos filtrados con `.map()` y renderiza un `ProductCard` por cada uno, con `key={item.id}` en el elemento retornado por el `.map()` (id real del mock, nunca el índice del array).

### `ProductCard`
Componente de presentación de cada producto en la grilla. Recibe `item` por props y desestructura `id`, `name`, `price`, `img`, `category`. Envuelve la imagen y el título en un `Link` de React Router hacia `/detalle/:id`, para navegar al detalle sin recargar la página. Mantiene su propio estado `esFavorito` (booleano). Reutiliza `ItemCount` para el contador, sin límite de stock.

### `ItemCount`
Componente reutilizable de contador con botones `-`/`+`. Si recibe la prop `stock`, respeta ese tope máximo; si no la recibe, incrementa sin límite. Nunca permite bajar de cero. Se usa tanto en `ProductCard` (sin stock) como en `ItemDetail` (con el stock real del producto).

### `ItemDetailContainer`
Lee el parámetro `id` de la URL con `useParams()` (de React Router). Ejecuta `getProductById(id)` dentro de un `useEffect` con dependencia `[id]` (para volver a buscar si el usuario navega a otro producto sin recargar), guarda el resultado en estado y delega la presentación a `ItemDetail`. Maneja los estados de carga y error.

### `ItemDetail`
Componente de presentación del detalle completo. Recibe el producto por props y muestra información adicional a la que aparece en `ProductCard`: descripción completa y stock disponible. Reutiliza `ItemCount`, pasándole el stock real para que el contador respete ese límite.

### `NotFound`
Página comodín para cualquier URL que no matchea ninguna ruta definida (`path="*"`), con un enlace de vuelta al inicio.

## Filtrado en `ItemListContainer`

```jsx
const itemsFiltrados = items
  .filter((item) => categoriaActiva === null || item.category === categoriaActiva)
  .filter((item) => item.name.toLowerCase().includes(busqueda.toLowerCase()))
```

Se recalcula en cada render a partir de `items`, `categoriaActiva` y `busqueda`, sin necesidad de un `useEffect` adicional.

## Próximos pasos

- Convertir el `CartWidget` en un carrito funcional con estado global (Context API), integrando la cantidad seleccionada en `ItemCount` al agregar un producto.
- Agregar tests unitarios con Vitest + React Testing Library.
- Debounce en el input de búsqueda.
- Reemplazar el mock local por una base de datos real (Firebase o un backend propio) cuando el proyecto lo requiera.