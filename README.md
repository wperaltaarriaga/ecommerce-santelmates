# Santelmates 🧉

E-commerce de mates artesanales, desarrollado con **React + Vite** como práctica de composición de componentes, manejo de estado (`useState`), efectos (`useEffect`), custom hooks, consumo de APIs externas con `fetch`/promesas y comunicación vía props.

## Stack

- React
- Vite
- CSS Modules
- Fake Store API (https://fakestoreapi.com)

## Cómo correr el proyecto

```bash
npm install
npm run dev
```

La app queda disponible en `http://localhost:5173`.

### Variables de entorno

Creá un archivo `.env` en la raíz del proyecto (al lado de `package.json`) con:

```
VITE_API_URL=https://fakestoreapi.com/products
VITE_API_URL_BASE=https://fakestoreapi.com
```

- `VITE_API_URL`: endpoint del listado completo de productos, usado por `useProducts`.
- `VITE_API_URL_BASE`: base de la API, usada por `getProductById` para armar la URL de un producto puntual (`/products/{id}`).

Vite expone automáticamente cualquier variable que empiece con `VITE_` a través de `import.meta.env`. Hay un `.env.example` con la misma estructura, sin datos sensibles, como referencia para quien clone el repo.

## Estructura del proyecto

```
src/
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
  hooks/
    useFetch.js
    useProducts.js
  services/
    getProductById.js
  App.jsx
  App.css
  main.jsx
  index.css
public/
  hero/
    hero-mate.jpg
.env
.env.example
```

## Componentes y manejo de estado

### `App`
Ancestro común que centraliza el estado compartido entre `NavBar` e `ItemListContainer`:

- `categoriaActiva` (string o `null`): categoría seleccionada en el filtro del navbar. `null` significa "sin filtro, mostrar todo".
- `busqueda` (string): texto ingresado en el buscador.

Ambos estados bajan por props (comunicación unidireccional padre → hijo) hacia `NavBar` (para modificarlos) y hacia `ItemListContainer` (para filtrar con ellos). También renderiza `ItemDetailContainer` con un `productId` de prueba, a la espera de conectarse con rutas dinámicas más adelante.

### `NavBar`
Contiene el branding, las categorías reales de producto (Mates, Bombillas, Despolvilladores) mapeadas desde un array y mostradas como selector tipo píldora, un input de búsqueda y el `CartWidget`. Recibe todo su estado de filtro por props desde `App`.

### `CartWidget`
Muestra un ícono de carrito y un badge con la cantidad de ítems, recibida por prop (`cantidad`). Por ahora hardcodeado desde `NavBar`; a futuro vendrá de un estado global del carrito.

### `ItemListContainer`
Obtiene el listado completo de productos a través del custom hook `useProducts` y filtra el resultado según `categoriaActiva` y `busqueda` antes de pasarlo a `ItemList`. No hace fetch directamente ni maneja `useState`/`useEffect` propios para los datos — esa responsabilidad vive en los hooks.

### `ItemList`
Recorre los productos filtrados con `.map()` y renderiza un `ProductCard` por cada uno, con `key={item.id}` en el elemento retornado por el `.map()` (usando el id real, nunca el índice).

### `ProductCard`
Componente de presentación de cada producto en la grilla. Recibe el objeto `item` por props y desestructura sus campos (`nombre`, `precio`, `imagen`, `categoria`). Mantiene su propio estado `esFavorito` (booleano, `useState`), invertido con `toggleFavorite`. El contador de cantidad no vive acá: reutiliza el componente `ItemCount`.

### `ItemCount`
Componente reutilizable de contador con botones `-`/`+`. Recibe `stock` por prop (opcional): si se pasa, el contador respeta ese tope máximo (`Math.min`); si no se pasa, incrementa sin límite. Nunca permite bajar de cero. Se usa tanto en `ProductCard` (sin límite de stock) como en `ItemDetail` (con el stock real del producto) — evitando reescribir la misma lógica dos veces.

### `ItemDetailContainer`
Contenedor de la vista de detalle de un producto. Recibe `productId` por props, ejecuta `getProductById(productId)` dentro de un `useEffect` (con `async/await`), y guarda el resultado en el estado `producto`. Mientras se resuelve la promesa muestra "Cargando producto...", y si la promesa se rechaza (producto inexistente o error de red) muestra un mensaje de error en rojo. No contiene el diseño del detalle: delega toda la presentación a `ItemDetail`.

### `ItemDetail`
Componente de presentación de la vista de detalle. Recibe el `producto` completo por props y desestructura sus campos (`nombre`, `precio`, `categoria`, `imagen`, `descripcion`, `stock`). Muestra información que no aparece en la tarjeta resumida (`ProductCard`): descripción completa y stock disponible. Reutiliza `ItemCount`, pasándole el `stock` real del producto para que el contador respete ese límite.

## Custom Hooks

### `useFetch(url)`
Hook genérico y reutilizable que encapsula el patrón repetitivo de hacer un `fetch`, manejar `loading`/`error`, y guardar el resultado crudo en `data`. No sabe nada sobre productos ni sobre la forma específica de los datos — podría usarse para consumir cualquier endpoint.

```jsx
const { data, loading, error } = useFetch(url)
```

- **Estados:** `data` (inicia en `null`), `loading` (inicia en `true`), `error` (inicia en `null`).
- **`useEffect` con dependencia `[url]`:** vuelve a ejecutar el fetch si la URL cambia, no solo al montar.
- Verifica `response.ok` manualmente y fuerza un error con `throw new Error(...)` si la respuesta HTTP no es exitosa, ya que `fetch` no lanza excepciones automáticamente ante un 404 o 500.
- Usa `finally` para garantizar que `loading` pase a `false` tanto en el caso de éxito como en el de error.

### `useProducts(url)`
Hook específico del dominio de productos, construido **sobre** `useFetch` (composición de hooks). Se encarga únicamente de la transformación de datos: mapea los campos de la Fake Store API (`title`, `price`, `image`, `category`) a los nombres que usan los componentes (`nombre`, `precio`, `imagen`, `categoria`). No tiene `useState` ni `useEffect` propios — toda esa lógica la delega a `useFetch`.

```jsx
const { products, loading, error } = useProducts(import.meta.env.VITE_API_URL)
```

Esta separación en dos capas evita repetir el patrón de fetch en cada hook nuevo que se necesite: si mañana hiciera falta un hook para traer categorías o usuarios, alcanzaría con reutilizar `useFetch` y sumar solo la lógica de mapeo particular.

## Servicios

### `getProductById(productId)`
Función que retorna una `Promise`, ubicada en `src/services/`. Recibe un `productId` dinámico (nunca un valor fijo) y hace un `fetch` a `${VITE_API_URL_BASE}/products/${productId}`. Si la respuesta no es exitosa, o si la API devuelve `null` (caso en el que la Fake Store API responde 200 con cuerpo vacío para ids inexistentes), rechaza la promesa con un `Error`. Si el producto existe, lo mapea a los mismos nombres de campo usados en el resto de la app y resuelve la promesa con ese objeto. El campo `stock` no existe en la Fake Store API real, por lo que se simula con un valor fijo.

## Filtrado en `ItemListContainer`

`itemsFiltrados` se recalcula en cada render a partir de `products`, `categoriaActiva` y `busqueda`, sin necesidad de un `useEffect` adicional ni de repetir el fetch:

```jsx
const itemsFiltrados = products
  .filter((item) => categoriaActiva === null || item.categoria === categoriaActiva)
  .filter((item) => item.nombre.toLowerCase().includes(busqueda.toLowerCase()))
```

## Verificación manual del manejo de errores

Para comprobar que la UI no se rompe si la API falla, se puede cambiar temporalmente `VITE_API_URL` (o `VITE_API_URL_BASE`) en `.env` a una ruta inexistente, reiniciar el servidor de Vite, y confirmar que aparece el mensaje de error en rojo en vez de que la aplicación quede en blanco.

## Próximos pasos

- Implementar rutas de navegación (React Router), incluyendo la vista de detalle conectada dinámicamente por URL (`/producto/:id`) en vez del `productId` fijo actual.
- Convertir el `CartWidget` en un carrito funcional con estado global (Context API), integrando el valor seleccionado en `ItemCount` al agregar un producto al carrito.
- Agregar tests unitarios con Vitest + React Testing Library.
- Debounce en el input de búsqueda para no filtrar en cada tecla presionada.