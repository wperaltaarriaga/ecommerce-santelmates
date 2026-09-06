import { useState, useEffect } from 'react'
import { getProductById } from '../../services/getProductById.js'
import ItemDetail from '../ItemDetail/ItemDetail'
import styles from './ItemDetailContainer.module.css'

function ItemDetailContainer({ productId }) {
  const [producto, setProducto] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await getProductById(productId)
        setProducto(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducto()

    // Array de dependencias [productId]: si el id cambia (por ejemplo,
    // cuando venga desde la URL con React Router), el efecto debe
    // volver a pedir el producto correspondiente a la API.
  }, [productId])

  if (loading) return <p className={styles.loadingText}>Cargando producto...</p>
  if (error) return <p className={styles.errorText}>⚠️ {error}</p>

  return <ItemDetail producto={producto} />
}

export default ItemDetailContainer