import { useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import styles from './NavBar.module.css'
import CartWidget from '../CartWidget/CartWidget'
import FavoritesWidget from '../Favorite/FavoritesWidget/FavoritesWidget'
import { slugify } from '../../utils/slugify'
import { categorias } from '../../data/categorias'
import AuthWidget from '../AuthWidget/AuthWidget.jsx'
function NavBar({ busqueda, setBusqueda }) {
  const [menuAbierto, setMenuAbierto] = useState(null)
  const navRef = useRef(null)

  useEffect(() => {
    const cerrarSiEsAfuera = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuAbierto(null)
    }
    document.addEventListener('mousedown', cerrarSiEsAfuera)
    return () => document.removeEventListener('mousedown', cerrarSiEsAfuera)
  }, [])

  return (
    <nav className={styles.nav}>
      <NavLink to="/" className={styles.brand}>
        <h1 className={styles.brandName}>Santel Mates</h1>
      </NavLink>

      <div className={styles.pillNav} ref={navRef}>
        <NavLink
          to="/productos"
          end
          className={({ isActive }) => `${styles.pillItem} ${isActive ? styles.pillActive : ''}`}
        >
          Todos
        </NavLink>
        <span className={styles.divider} />
        {categorias.map((categoria) => (
          <div
            key={categoria.nombre}
            className={styles.dropdownWrapper}
            onMouseEnter={() => categoria.subcategorias.length > 0 && setMenuAbierto(categoria.nombre)}
            onMouseLeave={() => setMenuAbierto(null)}
          >
            <NavLink
              to={`/category/${slugify(categoria.nombre)}`}
              className={({ isActive }) => `${styles.pillItem} ${isActive ? styles.pillActive : ''}`}
              onClick={() => setMenuAbierto(null)}
            >
              {categoria.nombre}
            </NavLink>
            {menuAbierto === categoria.nombre && categoria.subcategorias.length > 0 && (
              <div className={styles.dropdownMenu}>
                {categoria.subcategorias.map((sub) => (
                  <NavLink
                    key={sub}
                    to={`/category/${slugify(sub)}`}
                    className={({ isActive }) => `${styles.dropdownItem} ${isActive ? styles.dropdownItemActive : ''}`}
                    onClick={() => setMenuAbierto(null)}
                  >
                    {sub}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
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
        <AuthWidget />
        <FavoritesWidget />
        <CartWidget />
      </div>
    </nav>
  )
}

export default NavBar