import { Link } from 'react-router-dom'
import styles from './NotFound.module.css'

function NotFound() {
  return (
    <section className={styles.container}>
      <span className={styles.bigNumber}>404</span>

      <div className={styles.content}>
        <span className={styles.mate}>🧉</span> 
        <h1 className={styles.title}>Esta página se quedó sin yerba</h1>
        <p className={styles.subtext}>
          No encontramos lo que buscabas. Puede que el enlace esté roto
          o que la página se haya movido.
        </p>
        <div className={styles.actions}>
          <Link to="/" className={styles.primaryButton}>
            Ir al inicio
          </Link>
          <Link to="/productos" className={styles.secondaryButton}>
            Ver catálogo →
          </Link>
        </div>
      </div>
    </section>
  )
}

export default NotFound