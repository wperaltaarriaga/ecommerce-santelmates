import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from './ProductCarousel.module.css'
import { getProducts } from '../../mock/asyncMock'
import ProductInfo from '../ProductInfo/ProductInfo.jsx'

function ProductCarousel({ title = 'También te puede interesar' }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    const fetchItems = async () => {
      const data = await getProducts()
      setItems(data)
    }
    fetchItems()
  }, [])

  if (items.length === 0) return null

  const loopedItems = [...items, ...items]

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