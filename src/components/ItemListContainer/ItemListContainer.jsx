import { useState, useEffect } from 'react'
import styles from './ItemListContainer.module.css'
import ItemList from './ItemList/ItemList.jsx'
import { getProducts } from '../../mock/asyncMock'

function ItemListContainer({ categoriaActiva, busqueda }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getProducts()
      setItems(data)
      setLoading(false)
    }

    fetchItems()

    // Array de dependencias vacío ([]): la carga simulada debe ocurrir
    // una sola vez, al montar el componente. Si se omitiera, el efecto
    // se dispararía en cada render y, como adentro cambia el estado,
    // entraría en un bucle infinito.
  }, [])

  const itemsFiltrados = items
    .filter((item) => categoriaActiva === null || item.category === categoriaActiva)
    .filter((item) => item.name.toLowerCase().includes(busqueda.toLowerCase()))

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