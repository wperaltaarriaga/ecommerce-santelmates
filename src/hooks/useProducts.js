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
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [categoryId])

  return { products, loading, error }
}

export default useProducts