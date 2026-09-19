import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'
import CartWidget from '../CartWidget/CartWidget'
import FavoritesWidget from '../Favorite/FavoritesWidget/FavoritesWidget'

const categorias = ['Mates', 'Bombillas', 'Despolvilladores']

function NavBar({ busqueda, setBusqueda }) {
  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.brand}>
        <h1 className={styles.brandName}>Santel Mates</h1>
      </NavLink>

      <div className={styles.pillNav}>
        <NavLink
          to="/productos"
          end
          className={({ isActive }) => `${styles.pillItem} ${isActive ? styles.pillActive : ''}`}
        >
          Todos
        </NavLink>
        <span className={styles.divider} />
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
        <FavoritesWidget />
        <CartWidget />
      </div>
    </nav>
  )
}

export default NavBar