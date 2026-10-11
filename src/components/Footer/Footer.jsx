import { Link } from 'react-router-dom'
import { contacto, linkWhatsApp } from '../../data/contacto'
import styles from './Footer.module.css'

function Footer() {
  const hayContacto = contacto.whatsapp || contacto.email || contacto.instagram

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
          <h3 className={styles.columnTitle}>Tienda</h3>
          <Link to="/" className={styles.link}>Inicio</Link>
          <Link to="/productos" className={styles.link}>Catálogo</Link>
          <Link to="/favoritos" className={styles.link}>Favoritos</Link>
          <Link to="/mis-compras" className={styles.link}>Mis compras</Link>
        </div>

        {hayContacto && (
          <div className={styles.column}>
            <h3 className={styles.columnTitle}>Contacto</h3>
            {contacto.whatsapp && (
              <a href={linkWhatsApp('¡Hola! Tengo una consulta.')} className={styles.link} target="_blank" rel="noreferrer">
                WhatsApp
              </a>
            )}
            {contacto.email && (
              <a href={`mailto:${contacto.email}`} className={styles.link}>
                {contacto.email}
              </a>
            )}
            {contacto.instagram && (
              <a href={`https://instagram.com/${contacto.instagram}`} className={styles.link} target="_blank" rel="noreferrer">
                @{contacto.instagram}
              </a>
            )}
          </div>
        )}
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
