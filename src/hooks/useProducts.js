// useProducts.js
import useFetch from './useFetch'

function useProducts(url) {
  const { data, loading, error } = useFetch(url)
  const products = data || []
  return { products, loading, error }
}

export default useProducts