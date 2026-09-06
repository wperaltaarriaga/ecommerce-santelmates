# Santelmates 🧉

E-commerce de mates artesanales, desarrollado con **React + Vite** como práctica de composición de componentes, manejo de estado (`useState`), efectos (`useEffect`), consumo de APIs externas con `fetch` y comunicación vía props.

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

La URL de la API se lee desde una variable de entorno, para poder cambiarla sin tocar el código:

```
# .env
VITE_API_URL=https://fakestoreapi.com/products
```

Creá un archivo `.env` en la raíz del proyecto (al lado de `package.json`) con esa línea. Vite expone automáticamente cualquier variable que empiece con `VITE_` a través de `import.meta.env`.

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
  App.jsx
  App.css
  main.jsx
  index.css
public/
  hero/
    hero-mate.jpg
.env
```

## Componentes y manejo de estado

### `App`
Es el ancestro común que centraliza el estado compartido entre `NavBar` e `ItemListContainer`:

- `categoriaActiva` (string): categoría seleccionada en el filtro del navbar.
- `busqueda` (string): texto ingresado en el buscador.

Ambos estados se pasan por props hacia abajo (comunicación unidireccional padre → hijo) para que `NavBar` pueda modificarlos y `ItemListContainer` pueda usarlos para filtrar los productos.

### `NavBar`
Contiene el branding, las categorías (mapeadas desde un array, con selector tipo píldora), un input de búsqueda y el `CartWidget`. No define su propio estado de filtro: lo recibe por props desde `App` (`categoriaActiva`, `setCategoriaActiva`, `busqueda`, `setBusqueda`).

### `CartWidget`
Muestra un ícono de carrito y un badge con la cantidad de ítems, recibida por prop (`cantidad`). Por ahora el valor está hardcodeado desde `NavBar`; a futuro vendrá de un estado global del carrito.

### `ItemListContainer`
Componente contenedor de la sección principal. Recibe `greeting`, `categoriaActiva` y `busqueda` por props desde `App`.

**Consumo de la API (Fake Store API):**

- **Estados:** `items` (array, inicia vacío), `isLoading` (booleano, `true` al montar) y `error` (string o `null`, inicia en `null`).
- **`useEffect` con `fetch`:** dentro del efecto se define una función `async` (`fetchProductos`) que hace la petición a `https://fakestoreapi.com/products` — no se puede hacer el propio callback de `useEffect` `async`, porque React espera que devuelva `undefined` o una función de limpieza, no una `Promise`.
- **Manejo de errores:** `fetch` no lanza una excepción automáticamente ante respuestas HTTP fallidas (404, 500, etc.) — solo falla ante errores de red. Por eso se verifica `response.ok` manualmente y, si es `false`, se fuerza un error con `throw new Error(...)`, que es capturado por el bloque `catch` y guardado en el estado `error`.
- **`.json()` asincrónico:** la conversión de la respuesta a JSON (`response.json()`) también es una operación asincrónica y lleva su propio `await`.
- **`finally`:** garantiza que `isLoading` pase a `false` tanto si la petición tuvo éxito como si falló, sin duplicar esa línea en el `try` y en el `catch`.
- **Mapeo de datos:** la Fake Store API devuelve los campos `title`, `price`, `image` y `category` en inglés; se transforman a `nombre`, `precio`, `imagen` y `categoria` para mantener consistencia con el resto de los componentes ya construidos (`ProductCard`, `ItemList`).
- **Array de dependencias `[]`:** el efecto se ejecuta una única vez al montar el componente, simulando la carga inicial de datos desde la API. Si se omitiera el array de dependencias, el efecto se dispararía en cada render; y como dentro de él se actualiza el estado (`setItems`/`setIsLoading`/`setError`), cada actualización generaría un nuevo render, que a su vez volvería a disparar el efecto — entrando en un bucle infinito de peticiones a la API.

**Renderizado condicional:**
- Si `isLoading` es `true` → "Cargando productos...".
- Si hay `error` → mensaje de error en rojo.
- Si no hay carga ni error, pero el filtro no encuentra resultados → "No se encontraron productos.".
- En cualquier otro caso → se renderiza `<ItemList items={itemsFiltrados} />`.

**Filtrado:** `itemsFiltrados` se calcula en cada render a partir de `items`, `categoriaActiva` y `busqueda` (filtro por categoría exacta + búsqueda por nombre, insensible a mayúsculas), sin necesidad de un nuevo `useEffect` ni de repetir el fetch.

### `ItemList`
Recorre `items` con `.map()` y renderiza un `ProductCard` por cada uno, asignando `key={item.id}` en el elemento retornado por el `.map()` (usando el `id` real del producto de la API, nunca el índice del array).

### `ProductCard`
Componente de presentación de cada producto. Recibe el objeto completo por prop (`item`) y desestructura sus campos:

```jsx
const { nombre, precio, imagen, categoria } = item
```

Maneja dos estados propios, independientes por cada instancia de la card:

- **`cantidad`** (número, inicial `1`): se incrementa/decrementa con `sumarCantidad` / `restarCantidad`, usando la forma funcional del setter (`setCantidad(prev => prev + 1)`). `restarCantidad` está validado para que nunca baje de `0`.
- **`esFavorito`** (booleano, inicial `false`): se invierte con `toggleFavorite` usando `setEsFavorito(prev => !prev)`. El ícono cambia (🤍 / ❤️) según el valor del estado.

## Verificación manual del manejo de errores

Para probar que la UI no se rompe si la API falla, se puede cambiar temporalmente la URL en `.env` a una ruta inexistente:

```
VITE_API_URL=https://fakestoreapi.com/ruta-que-no-existe
```

Al recargar, en vez de mostrar los productos debería verse el mensaje de error en rojo ("⚠️ Error al cargar productos: 404"), sin que la aplicación quede en blanco ni rompa. Después hay que volver a poner la URL correcta.

## Próximos pasos

- Implementar rutas de navegación (React Router), incluyendo vista de detalle por producto usando `https://fakestoreapi.com/products/:id`.
- Convertir el `CartWidget` en un carrito funcional con estado global (Context API).
- Agregar tests unitarios con Vitest + React Testing Library para el renderizado de componentes.
- Debounce en el input de búsqueda para no filtrar en cada tecla presionada.