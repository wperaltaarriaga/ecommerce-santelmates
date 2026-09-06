import useFetch from './useFetch'

function useProducts(url) {
  const { data, loading, error } = useFetch(url)

  // Mapeamos los campos de la Fake Store API (title/price/image/category)
  // a los nombres que usan nuestros componentes (nombre/precio/imagen/categoria).
  // Si data todavía no llegó (es null), devolvemos un array vacío para
  // que ItemList no reciba undefined.
  const products = data
    ? data.map((producto) => ({
        id: producto.id,
        nombre: producto.title,
        precio: producto.price,
        imagen: producto.image,
        categoria: producto.category,
      }))
    : []

  return { products, loading, error }
}

export default useProducts