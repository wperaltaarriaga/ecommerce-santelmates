import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'
import CartWidget from '../CartWidget/CartWidget'

const categorias = ['Mates', 'Bombillas', 'Despolvilladores']

function NavBar({ busqueda, setBusqueda }) {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.brand}>
        <h1 className={styles.brandName}>Santel Mates</h1>
      </NavLink>

      <div className={styles.links}>
        <NavLink
          to="/"
          end
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
          Inicio
        </NavLink>

        <NavLink
          to="/productos"
          className={({ isActive }) => `${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
        >
          Catálogo
        </NavLink>
      </div>

      <div className={styles.pillNav}>
        {categorias.map((categoria) => (
          <NavLink
            key={categoria}
            to={`/category/${categoria.toLowerCase()}`}
            className={({ isActive }) => `${styles.pillItem} ${isActive ? styles.pillActive : ''}`}
          >
            {categoria}
          </NavLink>
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