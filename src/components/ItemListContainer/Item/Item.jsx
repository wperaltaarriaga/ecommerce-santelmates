import { Link } from 'react-router-dom'
import styles from './Item.module.css'
import ProductInfo from '../../ProductInfo/ProductInfo.jsx'
import FavoriteButton from '../../Favorite/FavoriteButton/FavoriteButton.jsx'

function Item({ item }) {
  const { id, name, price, img, category, description } = item

  return (
    <article className={styles.article}>
      <Link to={`/item/${id}`} className={styles.link}>
        <div className={styles.imageWrapper}>
          <img src={img} alt={name} className={styles.image} />
        </div>

        <ProductInfo category={category} name={name} price={price} description={description} />

        <span className={styles.detailButton}>Ver detalle</span>
      </Link>

      <FavoriteButton item={item} />
    </article>
  )
}

export default Item