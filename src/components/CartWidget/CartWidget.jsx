import { useState, useEffect, useRef } from 'react'
import styles from './CartWidget.module.css'
import { useCartData, useCartActions } from '../../context/CartContext'

function CartWidget() {
  const { totalItems } = useCartData()
  const { openCart } = useCartActions()
  const [bump, setBump] = useState(false)
  const isFirstRender = useRef(true)

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    setBump(true)
    const timer = setTimeout(() => setBump(false), 400)
    return () => clearTimeout(timer)
  }, [totalItems])

  return (
    <button className={styles.cartWidget} onClick={openCart}>
      <span className={`${styles.icon} ${bump ? styles.bump : ''}`}>🛒</span>
      {totalItems > 0 && <span className={styles.badge}>{totalItems}</span>}
    </button>
  )
}

export default CartWidget