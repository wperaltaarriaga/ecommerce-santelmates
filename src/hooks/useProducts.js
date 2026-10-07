import { useState, useEffect } from 'react'
import { getProducts } from '../services/firebaseProducts.js'

function useProducts(categoryId) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProducts(categoryId)
        setProducts(data)
      } catch {
        setError('Revisá tu conexión e intentá de nuevo en unos segundos.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [categoryId])

  return { products, loading, error }
}

export default useProducts