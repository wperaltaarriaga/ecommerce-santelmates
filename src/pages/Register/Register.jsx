import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import styles from '../Login/Login.module.css'

function traducirError(code) {
  switch (code) {
    case 'auth/email-already-in-use': return 'Ya existe una cuenta con ese email.'
    case 'auth/invalid-email': return 'El email no es válido.'
    case 'auth/weak-password': return 'La contraseña tiene que tener al menos 6 caracteres.'
    default: return 'No pudimos crear tu cuenta. Intentá de nuevo.'
  }
}

function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await register(email, password)
      navigate('/checkout', { replace: true })
    } catch (err) {
      setError(traducirError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Crear cuenta</h1>
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
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <button type="submit" disabled={loading} className={styles.submitButton}>
          {loading ? 'Creando cuenta...' : 'Registrarme'}
        </button>
      </form>
      <p className={styles.switchText}>
        ¿Ya tenés cuenta? <Link to="/login" className={styles.switchLink}>Iniciá sesión</Link>
      </p>
    </section>
  )
}

export default Register