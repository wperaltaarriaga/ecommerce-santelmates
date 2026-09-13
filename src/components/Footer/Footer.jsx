import styles from './Footer.module.css'

function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        © {new Date().getFullYear()} Santel Mates — Mates artesanales, hechos a mano.
      </p>
    </footer>
  )
}

export default Footer