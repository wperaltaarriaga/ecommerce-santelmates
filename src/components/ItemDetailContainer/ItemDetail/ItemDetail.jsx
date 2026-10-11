import ItemCount from '../ItemCount/ItemCount'
import ProductInfo from '../../ProductInfo/ProductInfo.jsx'
import FavoriteButton from '../../Favorite/FavoriteButton/FavoriteButton.jsx'
import Breadcrumbs from '../Breadcrumbs/Breadcrumbs.jsx'
import Galeria from '../Galeria/Galeria.jsx'
import { useCartActions, useCartData } from '../../../hooks/useCart'
import styles from './ItemDetail.module.css'

function ItemDetail({ producto }) {
  const { name, price, category, img, description, stock } = producto
  const { addItem } = useCartActions()
  const { cart } = useCartData()
  const enCarrito = cart.find((p) => p.id === producto.id)?.quantity || 0
  // Productos viejos solo tienen `img`; los nuevos pueden tener varias en `imgs`
  const imagenes = producto.imgs?.length ? producto.imgs : [img]

  const handleAdd = (cantidad) => {
    addItem(producto, cantidad)
  }

  return (
    <>
      <div className={styles.breadcrumbWrapper}>
        <Breadcrumbs category={category} name={name} />
      </div>

      <section className={styles.detail}>
        <Galeria key={producto.id} imagenes={imagenes} nombre={name}>
          <FavoriteButton item={producto} />
        </Galeria>

        <div className={styles.infoColumn}>
          <ProductInfo category={category} name={name} price={price} description={description} variant="detail" />
          <ItemCount key={enCarrito} stock={stock} enCarrito={enCarrito} onAdd={handleAdd} />
        </div>
      </section>
    </>
  )
}

export default ItemDetail