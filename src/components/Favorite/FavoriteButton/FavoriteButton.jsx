import { useFavorites } from '../../../context/FavoritesContext'
import styles from './FavoriteButton.module.css'

function FavoriteButton({ item }) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const esFavorito = isFavorite(item.id)

  const handleClick = (event) => {
    event.preventDefault()
    toggleFavorite(item)
  }

  return (
    <button
      className={`${styles.favButton} ${esFavorito ? styles.favActive : ''}`}
      onClick={handleClick}
    >
      {esFavorito ? '❤️' : '🤍'}
    </button>
  )
}

export default FavoriteButton