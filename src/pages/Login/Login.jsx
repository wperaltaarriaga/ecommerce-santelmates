import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from './Login.module.css'

function traducirError(code) {
  switch (code) {
    case 'auth/invalid-email': return 'El email no es válido.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential': return 'Email o contraseña incorrectos.'
    case 'auth/too-many-requests': return 'Demasiados intentos. Probá de nuevo más tarde.'
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
          <label className={styles.label}>Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Contraseña</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
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