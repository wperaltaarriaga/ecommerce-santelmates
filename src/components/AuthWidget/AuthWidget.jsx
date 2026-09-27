import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './AuthWidget.module.css'

function AuthWidget() {
  const { user, logout } = useAuth()

  if (!user) {
    return (
      <Link to="/login" className={styles.loginLink}>
        Iniciar sesión
      </Link>
    )
  }

  return (
    <div className={styles.wrapper}>
      <span className={styles.email} title={user.email}>{user.email}</span>
      <button className={styles.logoutButton} onClick={logout}>
        Cerrar sesión
      </button>
    </div>
  )
}

export default AuthWidget