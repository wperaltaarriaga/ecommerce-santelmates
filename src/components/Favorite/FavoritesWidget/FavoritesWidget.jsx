import { Link } from 'react-router-dom'
import { useFavorites } from '../../../context/FavoritesContext.jsx'
import styles from './FavoritesWidget.module.css'

function FavoritesWidget() {
  const { totalFavorites } = useFavorites()

  return (
    <Link to="/favoritos" className={styles.widget}>
      <span className={styles.icon}>🤍</span>
      {totalFavorites > 0 && <span className={styles.badge}>{totalFavorites}</span>}
    </Link>
  )
}

export default FavoritesWidget