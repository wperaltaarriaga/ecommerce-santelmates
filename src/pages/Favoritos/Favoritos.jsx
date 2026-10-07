import { useFavorites } from '../../hooks/useFavorites'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import FlipCard from '../../components/FlipCard/FlipCard.jsx'
import { Link } from 'react-router-dom'
import styles from './Favoritos.module.css'

function Favoritos() {
  const { favorites } = useFavorites()

  return (
    <section className={styles.section}>
      <h1 className={styles.title}>Tus favoritos</h1>
      {favorites.length === 0 ? (
        <EmptyState
          emoji="🤍"
          title="Todavía no tenés favoritos"
          text="Marcá los mates que más te gusten con el corazón para encontrarlos acá."
          ctaText="Ver catálogo"
          ctaTo="/productos"
        />
      ) : (
        <div className={styles.grid}>
          {favorites.map((item) => (
            <FlipCard
              key={item.id}
              width={240}
              height={320}
              radius={18}
              background="#2d2420"
              color="#f5f0ea"
              front={
                <img
                  loading="lazy"
                  decoding="async"
                  src={item.img}
                  alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              }
              back={
                <div className={styles.cardBack}>
                  <span className={styles.cardCategory}>{item.category}</span>
                  <h3 className={styles.cardName}>{item.name}</h3>
                  <p className={styles.cardPrice}>${item.price.toLocaleString('es-AR')}</p>
                  <Link to={`/item/${item.id}`} className={styles.cardLink}>
                    Ver detalle
                  </Link>
                </div>
              }
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Favoritos