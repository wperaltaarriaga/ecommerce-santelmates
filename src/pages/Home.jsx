import styles from './Home.module.css'

function Home() {
  return (
    <section className={styles.home}>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h2 className={styles.greeting}>Mates para acompañar cada momento</h2>
        <p className={styles.subtext}>
          Mates artesanales, hechos a mano, para tu ritual de todos los días.
        </p>
      </div>
    </section>
  )
}

export default Home