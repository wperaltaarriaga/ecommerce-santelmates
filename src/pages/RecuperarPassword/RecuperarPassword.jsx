import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import styles from '../Login/Login.module.css'

function traducirError(code) {
  switch (code) {
    case 'auth/invalid-email': return 'El email no es válido.'
    case 'auth/too-many-requests': return 'Demasiados intentos. Probá de nuevo más tarde.'
    case 'auth/network-request-failed': return 'No hay conexión. Revisá tu internet e intentá de nuevo.'
    default: return 'No pudimos enviar el email. Intentá de nuevo.'
  }
}

function RecuperarPassword() {
  const [email, setEmail] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const { resetPassword } = useAuth()

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await resetPassword(email)
      setEnviado(true)
    } catch (err) {
      // Si el email no tiene cuenta, se muestra lo mismo que si tuviera:
      // así nadie puede usar este formulario para averiguar qué emails están registrados.
      if (err.code === 'auth/user-not-found') setEnviado(true)
      else setError(traducirError(err.code))
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={styles.container}>
      <h1 className={styles.title}>Recuperar contraseña</h1>
      <p className={styles.subtitle}>
        Ingresá el email de tu cuenta y te mandamos un enlace para crear una contraseña nueva.
      </p>

      {enviado ? (
        <p className={styles.success} role="status">
          Si existe una cuenta con <strong>{email}</strong>, te llegará un email con el enlace en unos minutos.
          Revisá también la carpeta de spam.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="recuperar-email" className={styles.label}>Email</label>
            <input
              id="recuperar-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              placeholder="santelmates@mates.com.ar"
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
            />
          </div>
          {error && <p className={styles.error} role="alert">{error}</p>}
          <button type="submit" disabled={loading} className={styles.submitButton}>
            {loading ? 'Enviando...' : 'Enviar enlace'}
          </button>
        </form>
      )}

      <p className={styles.switchText}>
        <Link to="/login" className={styles.switchLink}>Volver a iniciar sesión</Link>
      </p>
    </section>
  )
}

export default RecuperarPassword
