import styles from './ItemList.module.css'
import ProductCard from '../ProductCard/ProductCard'

function ItemList({ items }) {
  return (
    <div className={styles.grid}>
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  )
}

export default ItemList