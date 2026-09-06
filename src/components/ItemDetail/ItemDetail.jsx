import ItemCount from '../ItemCount/ItemCount'
import styles from './ItemDetail.module.css'

function ItemDetail({ producto }) {
  const { nombre, precio, categoria, imagen, descripcion, stock } = producto

  return (
    <section className={styles.detail}>
      <div className={styles.imageWrapper}>
        <img src={imagen} alt={nombre} className={styles.image} />
      </div>

      <div className={styles.info}>
        <span className={styles.category}>{categoria}</span>
        <h1 className={styles.title}>{nombre}</h1>
        <p className={styles.price}>${precio.toLocaleString('es-AR')}</p>
        <p className={styles.description}>{descripcion}</p>

        <ItemCount stock={stock} />
      </div>
    </section>
  )
}

export default ItemDetail