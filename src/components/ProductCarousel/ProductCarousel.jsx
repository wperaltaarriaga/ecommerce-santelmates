import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './ProductCarousel.module.css'
import { getProducts } from '../../services/firebaseProducts.js'
import ProductInfo from '../ProductInfo/ProductInfo.jsx'

const MIN_REPEAT = 6 // cuántas veces se repite la tanda de productos como mínimo, antes de duplicarla para el loop

function ProductCarousel({ title = 'También te puede interesar', currentProductId }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getProducts()
      const relacionados = currentProductId ? data.filter((item) => item.id !== currentProductId) : data
      setItems(relacionados)
    }
    fetchItems()
  }, [currentProductId])

  if (items.length === 0) return null

  const base = Array.from({ length: MIN_REPEAT }, () => items).flat()
  const loopedItems = [...base, ...base]

  return (
    <section className={styles.carouselSection}>
      <h2 className={styles.heading}>{title}</h2>
      <div className={styles.track}>
        {loopedItems.map((item, index) => (
          <Link
            to={`/item/${item.id}`}
            className={styles.card}
            key={`${item.id}-${index}`}
          >
            <div className={styles.imageWrapper}>
              <img src={item.img} alt={item.name} className={styles.image} />
            </div>
            <ProductInfo
              category={item.category}
              name={item.name}
            />
          </Link>
        ))}
      </div>
    </section>
  )
}

export default ProductCarousel