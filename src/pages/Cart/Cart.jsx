import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import styles from './Cart.module.css'

function Cart() {
  const { cart, removeItem, clear, updateQuantity, totalPrice } = useCart()

  if (cart.length === 0) {
    return (
      <EmptyState
        emoji="🧉"
        title="Tu carrito está esperando su primer mate"
        text="Todavía no agregaste nada. ¡Elegí el que más te guste!"
        ctaText="Ver catálogo"
        ctaTo="/productos"
      />
    )
  }

  return (
    <section className={styles.cart}>
      <h1 className={styles.title}>Tu pedido</h1>

      <div className={styles.list}>
        {cart.map((item) => (
          <div className={styles.row} key={item.id}>
            <img src={item.img} alt={item.name} className={styles.thumb} />

            <div className={styles.info}>
              <p className={styles.name}>{item.name}</p>
              <p className={styles.unitPrice}>
                ${item.price.toLocaleString('es-AR')} c/u
              </p>
            </div>

            <div className={styles.quantityControls}>
              <button
                className={styles.qtyButton}
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
              >
                -
              </button>
              <span className={styles.qtyValue}>{item.quantity}</span>
              <button
                className={styles.qtyButton}
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
              >
                +
              </button>
            </div>

            <p className={styles.subtotal}>
              ${(item.price * item.quantity).toLocaleString('es-AR')}
            </p>

            <button
              className={styles.removeButton}
              onClick={() => removeItem(item.id)}
            >
              Eliminar
            </button>
          </div>
        ))}
      </div>

      <div className={styles.summary}>
        <p className={styles.total}>
          Total: <strong>${totalPrice.toLocaleString('es-AR')}</strong>
        </p>

        <div className={styles.actions}>
          <button className={styles.clearButton} onClick={clear}>
            Vaciar carrito
          </button>
          <Link to="/checkout" className={styles.checkoutButton}>
            Finalizar compra
          </Link>
        </div>
      </div>
    </section>
  )
}

export default Cart