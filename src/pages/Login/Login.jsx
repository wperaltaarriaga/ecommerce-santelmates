import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from './Login.module.css'

function traducirError(code) {
  switch (code) {
    case 'auth/invalid-email': return 'El email no es válido.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Email o contraseña incorrectos.'
    case 'auth/too-many-requests': return 'Demasiados intentos. Probá de nuevo más tarde.'
    case 'auth/network-request-failed': return 'No hay conexión. Revisá tu internet e intentá de nuevo.'
    default: return 'No pudimos iniciar sesión. Intentá de nuevo.'
  }
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const redirectTo = location.state?.from || '/checkout'

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(redirectTo, { replace: true })
    } catch (err) {
      setError(traducirError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Iniciar sesión</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.field}>
          <label htmlFor="login-email" className={styles.label}>Email</label>
          <input
            id="login-email"
            type="email"
            autoComplete="email"
            required
            value={email}
            placeholder='santelmates@mates.com.ar'
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label htmlFor="login-password" className={styles.label}>Contraseña</label>
          <input
            id="login-password"
            type="password"
            autoComplete="current-password"
            required
            value={password}
            placeholder='********'
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <Link to="/recuperar" className={styles.forgotLink}>¿Olvidaste tu contraseña?</Link>
        {error && <p className={styles.error} role="alert">{error}</p>}
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>
      <p className={styles.switchText}>
        ¿No tenés cuenta? <Link to="/register" className={styles.switchLink}>Registrate</Link>
      </p>
    </section>
  )
}

export default Login