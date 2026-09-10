import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getProductById } from '../../services/getProductById'
import ItemDetail from './ItemDetail/ItemDetail.jsx'
import styles from './ItemDetailContainer.module.css'

function ItemDetailContainer() {
  const { id } = useParams()

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

    // Array de dependencias [id]: si el usuario navega de un producto a
    // otro (cambia el parámetro de la URL), el efecto debe volver a
    // pedir el nuevo producto correspondiente.
  }, [id])

  if (loading) return <p className={styles.loadingText}>Cargando producto...</p>
  if (error) return <p className={styles.errorText}>⚠️ {error}</p>

  return <ItemDetail producto={producto} />
}

export default ItemDetailContainer