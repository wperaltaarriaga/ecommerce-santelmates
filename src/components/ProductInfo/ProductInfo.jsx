import styles from './ProductInfo.module.css'

function ProductInfo({ category, name, price, description, variant = 'card' }) {
  const Heading = variant === 'detail' ? 'h1' : 'h3'

  return (
    <div className={`${styles.info} ${variant === 'detail' ? styles.detail : ''}`}>
      <span className={styles.category}>{category}</span>
      <Heading className={styles.title}>{name}</Heading>
      {price !== undefined && (
        <p className={styles.price}>${price.toLocaleString('es-AR')}</p>
      )}
      {description !== undefined && (
        <p className={styles.description}>{description}</p>
      )}
    </div>
  )
}

export default ProductInfo