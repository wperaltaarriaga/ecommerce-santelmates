import { useCartData } from '../../context/CartContext'
import styles from './Toast.module.css'

function Toast() {
  const { toast } = useCartData()
  if (!toast) return null

  return (
    <div className={styles.toast}>
      <span className={styles.check}>✓</span>
      {toast}
    </div>
  )
}

export default Toast