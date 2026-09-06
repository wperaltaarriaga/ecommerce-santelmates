import styles from './NavBar.module.css'
import CartWidget from '../CartWidget/CartWidget'

const categorias = ['Mates', 'Bombillas', 'Despolvilladores']

function NavBar({ categoriaActiva, setCategoriaActiva, busqueda, setBusqueda }) {
  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>
        <h1 className={styles.brandName}>Santel Mates</h1>
      </div>

      <div className={styles.pillNav}>
        {categorias.map((categoria) => (
          <button
            key={categoria}
            className={`${styles.pillItem} ${categoria === categoriaActiva ? styles.pillActive : ''}`}
            onClick={() => setCategoriaActiva(categoria)}
          >
            {categoria}
          </button>
        ))}
      </div>

      <div className={styles.rightSide}>
        <input
          type="text"
          placeholder="Buscar productos..."
          className={styles.searchInput}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <CartWidget cantidad={3} />
      </div>
    </nav>
  )
}

export default NavBar