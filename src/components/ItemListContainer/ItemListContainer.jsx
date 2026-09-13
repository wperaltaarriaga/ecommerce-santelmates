import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import styles from './ItemListContainer.module.css'
import ItemList from './ItemList/ItemList.jsx'
import { getProducts } from '../../mock/asyncMock'

function ItemListContainer({ busqueda }) {
  const { categoryId } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getProducts()
      setItems(data)
      setLoading(false)
    }
    fetchItems()
  }, [])

  const itemsFiltrados = items
    .filter((item) => !categoryId || item.category.toLowerCase() === categoryId.toLowerCase())
    .filter((item) => item.name.toLowerCase().includes((busqueda || '').toLowerCase()))

  return (
    <section className={styles.productsSection}>
      {loading ? (
        <p className={styles.loadingText}>Cargando productos...</p>
      ) : itemsFiltrados.length === 0 ? (
        <p className={styles.loadingText}>No se encontraron productos.</p>
      ) : (
        <ItemList items={itemsFiltrados} />
      )}
    </section>
  )
}

export default ItemListContainer