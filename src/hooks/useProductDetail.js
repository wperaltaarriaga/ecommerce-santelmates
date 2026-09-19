import { useState, useEffect } from 'react'
import { getProductById } from '../services/getProductById'

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
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducto()
  }, [id])

  return { producto, loading, error }
}

export default useProductDetail