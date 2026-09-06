import styles from './ItemListContainer.module.css'
import ItemList from '../ItemList/ItemList'
import useProducts from '../../hooks/useProducts.js'

function ItemListContainer({ greeting, categoriaActiva, busqueda }) {
  const { products, loading, error } = useProducts(import.meta.env.VITE_API_URL)

  const itemsFiltrados = products
  .filter((item) => categoriaActiva === null || item.categoria === categoriaActiva)
  .filter((item) => item.nombre.toLowerCase().includes(busqueda.toLowerCase()))

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h2 className={styles.greeting}>{greeting}</h2>
          <p className={styles.subtext}>
            Mates artesanales, hechos a mano, para tu ritual de todos los días.
          </p>
          <button className={styles.cta}>Ver productos</button>
        </div>
      </section>

      <section className={styles.productsSection}>
        {loading ? (
          <p className={styles.loadingText}>Cargando productos...</p>
        ) : error ? (
          <p className={styles.errorText}>⚠️ {error}</p>
        ) : itemsFiltrados.length === 0 ? (
          <p className={styles.loadingText}>No se encontraron productos.</p>
        ) : (
          <ItemList items={itemsFiltrados} />
        )}
      </section>
    </>
  )
}

export default ItemListContainer