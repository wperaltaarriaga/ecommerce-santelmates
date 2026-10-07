import { useState } from 'react'
import styles from './ItemCount.module.css'

function ItemCount({ stock, enCarrito = 0, initial = 1, onAdd }) {
  const disponible = Math.max(stock - enCarrito, 0)
  const [cantidad, setCantidad] = useState(Math.min(initial, disponible))

  const sumar = () => {
    setCantidad((prev) => Math.min(prev + 1, disponible))
  }

  const restar = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1))
  }

  const handleAgregar = () => {
    if (onAdd && cantidad > 0) onAdd(cantidad)
  }

  if (stock === 0) {
    return <p className={styles.sinStock}>Sin stock por el momento</p>
  }

  if (disponible === 0) {
    return (
      <p className={styles.sinStock}>
        Ya tenés en el carrito todo el stock disponible ({stock}).
      </p>
    )
  }

  return (
    <div className={styles.wrapper}>
      <p className={styles.stock}>
        Stock disponible: {disponible}
        {enCarrito > 0 && ` (ya tenés ${enCarrito} en el carrito)`}
      </p>

      <div className={styles.itemCount}>
        <button className={styles.button} onClick={restar} disabled={cantidad <= 1}>-</button>
        <span className={styles.cantidad}>{cantidad}</span>
        <button className={styles.button} onClick={sumar} disabled={cantidad >= disponible}>+</button>
      </div>

      {onAdd && (
        <button className={styles.addButton} onClick={handleAgregar}>
          Agregar al carrito
        </button>
      )}
    </div>
  )
}

export default ItemCount
