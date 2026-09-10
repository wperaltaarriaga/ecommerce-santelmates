import { useState } from "react"
import { Link } from 'react-router-dom'
import styles from './ProductCard.module.css'
import ItemCount from '../../ItemDetailContainer/ItemCount/ItemCount.jsx'

function ProductCard({ item }) {
  const { id, name, price, img, category } = item

  const [esFavorito, setEsFavorito] = useState(false)

  const toggleFavorite = () => {
    setEsFavorito(prev => !prev)
  }

  return (
    <article className={styles.article}>
      <Link to={`/detalle/${id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img src={img} alt={name} className={styles.image} />
        </div>
        <div className={styles.info}>
          <span className={styles.category}>{category}</span>
          <h3 className={styles.title}>{name}</h3>
          <p className={styles.price}>${price.toLocaleString('es-AR')}</p>
        </div>
      </Link>

      <button
        className={`${styles.favButton} ${esFavorito ? styles.favActive : ''}`}
        onClick={toggleFavorite}
      >
        {esFavorito ? '❤️' : '🤍'}
      </button>

      <ItemCount />
    </article>
  )
}

export default ProductCard