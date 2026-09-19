import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.top}>
        <div className={styles.brandBlock}>
          <span className={styles.brandName}>Santel Mates</span>
          <p className={styles.tagline}>
            Un ritual que se comparte, taza a taza.
          </p>
        </div>

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Navegación</h3>
          <Link to="/" className={styles.link}>Inicio</Link>
          <Link to="/productos" className={styles.link}>Catálogo</Link>
        </div>

        <div className={styles.column}>
          <h3 className={styles.columnTitle}>Contacto</h3>
          <a href="mailto:hola@santelmates.com" className={styles.link}>
            hola@santelmates.com
          </a>
          <a href="https://wa.me/5490000000000" className={styles.link} target="_blank" rel="noreferrer">
            +54 9 000 000-0000
          </a>
          <a href="https://instagram.com/santelmates" className={styles.link} target="_blank" rel="noreferrer">
            @santelmates
          </a>
        </div>
      </div>

      <div className={styles.bottom}>
        <p className={styles.copy}>
          © {new Date().getFullYear()} Santel Mates — Mates artesanales, hechos a mano.
        </p>
      </div>
    </footer>
  )
}

export default Footer