import styles from './ProductInfo.module.css'

// Separa la descripción en párrafos: una línea en blanco (dos Enter) marca un párrafo nuevo
function separarEnParrafos(texto) {
  return texto
    .split(/\n\s*\n/)
    .map((parrafo) => parrafo.trim())
    .filter(Boolean)
}

function ProductInfo({ category, name, price, description, variant = 'card' }) {
  const esDetalle = variant === 'detail'
  const Heading = esDetalle ? 'h1' : 'h3'

  return (
    <div className={`${styles.info} ${esDetalle ? styles.detail : ''}`}>
      <span className={styles.category}>{category}</span>
      <Heading className={styles.title}>{name}</Heading>
      {price !== undefined && (
        <p className={styles.price}>${price.toLocaleString('es-AR')}</p>
      )}
      {description !== undefined && (
        esDetalle ? (
          <div className={styles.description}>
            {separarEnParrafos(description).map((parrafo, i) => (
              <p key={i} className={styles.parrafo}>{parrafo}</p>
            ))}
          </div>
        ) : (
          // En las cards va todo seguido (los saltos se vuelven espacios) y se corta a 2 líneas
          <p className={styles.description}>{description.replace(/\s+/g, ' ')}</p>
        )
      )}
    </div>
  )
}

export default ProductInfo
