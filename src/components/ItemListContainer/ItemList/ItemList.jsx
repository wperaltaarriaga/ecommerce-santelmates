import styles from './ItemList.module.css'
import Item from '../Item/Item'

function ItemList({ items }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <Item key={item.id} item={item} />
      ))}
    </div>
  )
}

export default ItemList