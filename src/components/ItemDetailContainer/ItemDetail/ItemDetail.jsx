import ItemCount from '../ItemCount/ItemCount'
import ProductInfo from '../../ProductInfo/ProductInfo.jsx'
import FavoriteButton from '../../FavoriteButton/FavoriteButton.jsx'
import styles from './ItemDetail.module.css'

function ItemDetail({ producto }) {
  const { name, price, category, img, description, stock } = producto

  return (
    <section className={styles.detail}>
      <div className={styles.imageWrapper}>
        <img src={img} alt={name} className={styles.image} />
        <FavoriteButton />
      </div>

      <div>
        <ProductInfo category={category} name={name} price={price} description={description} variant="detail" />
        <ItemCount stock={stock} />
      </div>
    </section>
  )
}

export default ItemDetail