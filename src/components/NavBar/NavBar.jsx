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
  const [menuMovilAbierto, setMenuMovilAbierto] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const cerrarSiEsAfuera = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) setMenuAbierto(null)
    }
    document.addEventListener('mousedown', cerrarSiEsAfuera)
    return () => document.removeEventListener('mousedown', cerrarSiEsAfuera)
  }, [])

  // Menú del celular: se cierra con Escape y mientras está abierto la página de fondo no scrollea
  useEffect(() => {
    if (!menuMovilAbierto) return
    const cerrarConEscape = (e) => {
      if (e.key === 'Escape') setMenuMovilAbierto(false)
    }
    document.addEventListener('keydown', cerrarConEscape)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', cerrarConEscape)
      document.body.style.overflow = ''
    }
  }, [menuMovilAbierto])

  const cerrarMenuMovil = () => setMenuMovilAbierto(false)

  // Cualquier link que se toque dentro del panel lo cierra
  const cerrarSiEsLink = (e) => {
    if (e.target.closest('a')) cerrarMenuMovil()
  }

  const claseLinkMovil = ({ isActive }) => `${styles.mobileLink} ${isActive ? styles.mobileLinkActive : ''}`

  return (
    <nav className={styles.nav}>
      <button
        className={styles.hamburger}
        onClick={() => setMenuMovilAbierto(true)}
        aria-label="Abrir menú"
        aria-expanded={menuMovilAbierto}
        aria-controls="menu-movil"
      >
        <span />
        <span />
        <span />
      </button>

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
          type="search"
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          className={`${styles.searchInput} ${styles.soloEscritorio}`}
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
        <div className={styles.soloEscritorio}>
          <AuthWidget />
        </div>
        <FavoritesWidget />
        <CartWidget />
      </div>

      {menuMovilAbierto && (
        <>
          <div className={styles.backdrop} onClick={cerrarMenuMovil} />
          <div
            id="menu-movil"
            className={styles.mobilePanel}
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            onClick={cerrarSiEsLink}
          >
            <div className={styles.mobileHeader}>
              <span className={styles.brandName}>Santel Mates</span>
              <button className={styles.closeButton} onClick={cerrarMenuMovil} aria-label="Cerrar menú">
                ✕
              </button>
            </div>

            <input
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              className={styles.mobileSearch}
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />

            <div className={styles.mobileLinks}>
              <NavLink to="/productos" end className={claseLinkMovil}>Todos los productos</NavLink>
              {categorias.map((categoria) => (
                <div key={categoria.nombre} className={styles.mobileGroup}>
                  <NavLink to={`/category/${slugify(categoria.nombre)}`} end className={claseLinkMovil}>
                    {categoria.nombre}
                  </NavLink>
                  {categoria.subcategorias.map((sub) => (
                    <NavLink
                      key={sub}
                      to={`/category/${slugify(sub)}`}
                      className={({ isActive }) => `${styles.mobileSubLink} ${isActive ? styles.mobileLinkActive : ''}`}
                    >
                      {sub}
                    </NavLink>
                  ))}
                </div>
              ))}
              <NavLink to="/favoritos" className={claseLinkMovil}>Favoritos</NavLink>
            </div>

            <div className={styles.mobileAuth}>
              <AuthWidget />
            </div>
          </div>
        </>
      )}
    </nav>
  )
}

export default NavBar
