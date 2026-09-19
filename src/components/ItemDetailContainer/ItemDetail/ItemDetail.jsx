import ItemCount from '../ItemCount/ItemCount'
import ProductInfo from '../../ProductInfo/ProductInfo.jsx'
import FavoriteButton from '../../Favorite/FavoriteButton/FavoriteButton.jsx'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx'
import { useCartActions } from '../../../context/CartContext'
import styles from './ItemDetail.module.css'

function ItemDetail({ producto }) {
  const { name, price, category, img, description, stock } = producto
  const { addItem } = useCartActions()

  const handleAdd = (cantidad) => {
    addItem(producto, cantidad)
  }

  return (
    <>
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumbs category={category} name={name} />
      </div>

      <section className={styles.detail}>
        <div className={styles.imageWrapper}>
          <img src={img} alt={name} className={styles.image} />
          <FavoriteButton item={producto} />
        </div>

        <div className={styles.infoColumn}>
          <ProductInfo category={category} name={name} price={price} description={description} variant="detail" />
          <ItemCount stock={stock} onAdd={handleAdd} />
        </div>
      </section>
    </>
  )
}

export default ItemDetail