import { estadoDe, etiquetaEstado } from '../../data/estadosOrden'
import styles from './EstadoOrden.module.css'

// Etiqueta de color con el estado de una orden
function EstadoOrden({ orden }) {
  const estado = estadoDe(orden)
  return <span className={`${styles.estado} ${styles[estado] ?? ''}`}>{etiquetaEstado(estado)}</span>
}

export default EstadoOrden
