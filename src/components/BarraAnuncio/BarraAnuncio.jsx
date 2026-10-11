import styles from './BarraAnuncio.module.css'

// Franja fina arriba de la navbar. Cambiá el texto por la promo del momento
// (por ejemplo, "Envío gratis en compras desde $50.000").
const MENSAJE = 'Mates artesanales hechos a mano · No hay dos iguales'

function BarraAnuncio() {
  return <div className={styles.barra}>{MENSAJE}</div>
}

export default BarraAnuncio
