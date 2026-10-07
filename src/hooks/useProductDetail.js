import { useState, useEffect } from 'react'
import { getProductById } from '../services/firebaseProducts.js'

function useProductDetail(id) {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(id)
        setProducto(data)
      } catch (err) {
        setError(err.message === 'Producto no encontrado'
          ? err.message
          : 'No pudimos cargar el producto. Revisá tu conexión e intentá de nuevo.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducto()
  }, [id])

  return { producto, loading, error }
}

export default useProductDetail