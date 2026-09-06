import { useState, useEffect } from 'react'

function useProducts(url) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(url)

        if (!response.ok) {
          throw new Error(`Error al cargar productos: ${response.status}`)
        }

        const data = await response.json()

        // Mapeamos los campos de la Fake Store API (title/price/image/category)
        // a los nombres que usan nuestros componentes (nombre/precio/imagen/categoria).
        const productosMapeados = data.map((producto) => ({
          id: producto.id,
          nombre: producto.title,
          precio: producto.price,
          imagen: producto.image,
          categoria: producto.category,
        }))

        setProducts(productosMapeados)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()

    // Array de dependencias [url]: el efecto debe volver a ejecutarse si
    // la URL cambia (por ejemplo, si en el futuro el hook se reutiliza
    // con un endpoint distinto), pero no en cada render sin motivo.
  }, [url])

  return { products, loading, error }
}

export default useProducts