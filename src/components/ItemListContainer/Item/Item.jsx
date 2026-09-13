import { Link } from 'react-router-dom'
import styles from './Item.module.css'
import ProductInfo from '../../ProductInfo/ProductInfo.jsx'
import FavoriteButton from '../../FavoriteButton/FavoriteButton.jsx'

function Item({ item }) {
  const { id, name, price, img, category, description } = item

  return (
    <article className={styles.article}>
      <div className={styles.imageWrapper}>
        <img src={img} alt={name} className={styles.image} />
        <FavoriteButton />
      </div>

      <ProductInfo category={category} name={name} price={price} description={description} />

      <Link to={`/item/${id}`} className={styles.detailButton}>
        Ver detalle
      </Link>
    </article>
  )
}

export default Item