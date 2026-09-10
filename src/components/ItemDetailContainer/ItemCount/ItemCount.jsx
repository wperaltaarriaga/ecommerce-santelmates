import { useState } from 'react'
import styles from './ItemCount.module.css'

function ItemCount({ stock, initial = 1, onAdd }) {
  const [cantidad, setCantidad] = useState(initial)

  const sumar = () => {
    setCantidad((prev) => (stock ? Math.min(prev + 1, stock) : prev + 1))
  }

  const restar = () => {
    setCantidad((prev) => (prev > 0 ? prev - 1 : 0))
  }

  return (
    <div className={styles.itemCount}>
      <button className={styles.button} onClick={restar}>-</button>
      <span className={styles.cantidad}>{cantidad}</span>
      <button className={styles.button} onClick={sumar}>+</button>
    </div>
  )
}

export default ItemCount