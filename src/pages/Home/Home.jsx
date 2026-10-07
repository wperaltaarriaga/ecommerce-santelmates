import styles from './Home.module.css'
import ItemListContainer from '../../components/ItemListContainer/ItemListContainer.jsx'
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.jsx'
import { useTituloPagina } from '../../hooks/useTituloPagina'

function Home({ busqueda }) {
  useTituloPagina(null)
  return (
    <>
      <section className={styles.home}>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h2 className={styles.greeting}>Mates para acompañar cada momento</h2>
          <p className={styles.subtext}>
            Mates artesanales, hechos a mano, para tu ritual de todos los días.
          </p>
        </div>
      </section>

      <section className={styles.catalogSection}>
        <h2 className={styles.catalogTitle}>Mirá nuestro catálogo completo</h2>
        <ItemListContainer busqueda={busqueda} actualizarTitulo={false} />
      </section>

      <ProductCarousel title="Los elegidos de este mes" />
    </>
  )
}

export default Home