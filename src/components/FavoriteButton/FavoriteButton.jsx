import { useState } from 'react'
import styles from './FavoriteButton.module.css'

function FavoriteButton() {
  const [esFavorito, setEsFavorito] = useState(false)

  const toggleFavorite = () => {
    setEsFavorito(prev => !prev)
  }

  return (
    <button
      className={`${styles.favButton} ${esFavorito ? styles.favActive : ''}`}
      onClick={toggleFavorite}
    >
      {esFavorito ? '❤️' : '🤍'}
    </button>
  )
}

export default FavoriteButton