import { useFavorites } from '../../context/FavoritesContext'
import ItemList from '../../components/ItemListContainer/ItemList/ItemList.jsx'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
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
        <ItemList items={favorites} />
      )}
    </section>
  )
}

export default Favoritos