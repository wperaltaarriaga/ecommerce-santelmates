import { Component } from 'react'
import styles from './ErrorBoundary.module.css'

// Atrapa errores de render (por ejemplo, cuando falla la descarga de una página lazy
// porque se cortó la conexión o hubo un deploy nuevo) y muestra un mensaje
// en lugar de dejar la pantalla en blanco.
// Tiene que ser un componente de clase: React no tiene hook para esto.
class ErrorBoundary extends Component {
  state = { hayError: false }

  static getDerivedStateFromError() {
    return { hayError: true }
  }

  componentDidUpdate(prevProps) {
    // Si el usuario navega a otra ruta, se intenta de nuevo
    if (this.state.hayError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hayError: false })
    }
  }

  render() {
    if (!this.state.hayError) return this.props.children

    return (
      <div className={styles.container}>
        <span className={styles.emoji}>🧉</span>
        <h2 className={styles.title}>No pudimos cargar esta página</h2>
        <p className={styles.text}>
          Puede que se haya cortado la conexión o que la tienda se haya actualizado.
        </p>
        <button className={styles.button} onClick={() => window.location.reload()}>
          Recargar
        </button>
      </div>
    )
  }
}

export default ErrorBoundary
