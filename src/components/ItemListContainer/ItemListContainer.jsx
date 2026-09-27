import { useState } from 'react'
import { useParams } from 'react-router-dom'
import styles from './ItemListContainer.module.css'
import ItemList from './ItemList/ItemList.jsx'
import { SkeletonCard } from '../Skeletons/Skeletons.jsx'
import EmptyState from '../EmptyState/EmptyState.jsx'
import useProducts from '../../hooks/useProducts'

function ItemListContainer({ busqueda }) {
  const { categoryId } = useParams()
  const { products: items, loading, error } = useProducts(categoryId)
  const [orden, setOrden] = useState('default')

  let itemsFiltrados = items.filter((item) =>
    item.name.toLowerCase().includes((busqueda || '').toLowerCase())
  )

  if (orden === 'price-asc') itemsFiltrados = [...itemsFiltrados].sort((a, b) => a.price - b.price)
  else if (orden === 'price-desc') itemsFiltrados = [...itemsFiltrados].sort((a, b) => b.price - a.price)
  else if (orden === 'name-asc') itemsFiltrados = [...itemsFiltrados].sort((a, b) => a.name.localeCompare(b.name))

  return (
    <section className={styles.productsSection}>
      {!loading && items.length > 0 && (
        <div className={styles.toolbar}>
          <select className={styles.sortSelect} value={orden} onChange={(e) => setOrden(e.target.value)}>
            <option value="default">Ordenar por</option>
            <option value="price-asc">Menor precio</option>
            <option value="price-desc">Mayor precio</option>
            <option value="name-asc">Nombre (A-Z)</option>
          </select>
        </div>
      )}
      {loading ? (
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <EmptyState emoji="⚠️" title="No pudimos cargar el catálogo" text={error} />
      ) : items.length === 0 ? (
        <EmptyState
          emoji="✨"
          title="Ya casi está listo"
          text="Estamos sumando productos a esta categoría. Volvé pronto o mirá el resto del catálogo mientras tanto."
          ctaText="Ver catálogo completo"
          ctaTo="/productos"
        />
      ) : itemsFiltrados.length === 0 ? (
        <EmptyState emoji="🔍" title="No encontramos ese mate" text="Probá con otra categoría o buscá algo distinto." />
      ) : (
        <ItemList items={itemsFiltrados} />
      )}
    </section>
  )
}

export default ItemListContainer