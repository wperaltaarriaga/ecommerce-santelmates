import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './AuthWidget.module.css'

function AuthWidget() {
  const { user, isAdmin, logout } = useAuth()

  if (!user) {
    return (
      <Link to="/login" className={styles.loginLink}>
        Iniciar sesión
      </Link>
    )
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.cuenta}>
        <span className={styles.email} title={user.email}>{user.email}</span>
        <div className={styles.cuentaLinks}>
          <Link to="/mis-compras" className={styles.cuentaLink}>Mis compras</Link>
          {isAdmin && <Link to="/admin" className={styles.cuentaLink}>Admin</Link>}
        </div>
      </div>
      <button className={styles.logoutButton} onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default AuthWidget