import { useState } from "react"
import styles from './ProductCard.module.css'
import ItemCount from '../ItemCount/ItemCount'

function ProductCard({ item }) {
  const { nombre, precio, imagen, categoria } = item

  const [esFavorito, setEsFavorito] = useState(false)

  const toggleFavorite = () => {
    setEsFavorito(prev => !prev)
  }

  return (
    <article className={styles.article}>
      <div className={styles.imageWrapper}>
        <img src={imagen} alt={nombre} className={styles.image} />
        <button
          className={`${styles.favButton} ${esFavorito ? styles.favActive : ''}`}
          onClick={toggleFavorite}
        >
          {esFavorito ? '❤️' : '🤍'}
        </button>
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{categoria}</span>
        <h3 className={styles.title}>{nombre}</h3>
        <p className={styles.price}>${precio.toLocaleString('es-AR')}</p>

        <ItemCount />
      </div>
    </article>
  )
}

export default ProductCard