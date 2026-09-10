import ItemCount from '../ItemCount/ItemCount'
import styles from './ItemDetail.module.css'

function ItemDetail({ producto }) {
  const { name, price, category, img, description, stock } = producto

  return (
    <section className={styles.detail}>
      <div className={styles.imageWrapper}>
        <img src={img} alt={name} className={styles.image} />
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{category}</span>
        <h1 className={styles.title}>{name}</h1>
        <p className={styles.price}>${price.toLocaleString('es-AR')}</p>
        <p className={styles.description}>{description}</p>

        <ItemCount stock={stock} />
      </div>
    </section>
  )
}

export default ItemDetail