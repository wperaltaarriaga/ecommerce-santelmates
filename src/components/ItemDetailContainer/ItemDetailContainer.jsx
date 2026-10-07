import { useParams } from 'react-router-dom'
import ItemDetail from './ItemDetail/ItemDetail.jsx'
import { SkeletonDetail } from '../Skeletons/Skeletons.jsx'
import useProductDetail from '../../hooks/useProductDetail'
import EmptyState from '../EmptyState/EmptyState.jsx'
import ProductCarousel from '../ProductCarousel/ProductCarousel.jsx'

function ItemDetailContainer() {
  const { id } = useParams()
  const { producto, loading, error } = useProductDetail(id)

  if (loading) return <SkeletonDetail />
  if (error) {
    const noExiste = error === 'Producto no encontrado'
    return (
      <EmptyState
        emoji={noExiste ? '🔎' : '⚠️'}
        title={noExiste ? 'Este producto no existe' : 'No pudimos cargar el producto'}
        text={noExiste ? 'Puede que el enlace esté mal escrito o que el producto ya no esté disponible.' : error}
        ctaText="Ver catálogo"
        ctaTo="/productos"
      />
    )
  }

  return (
    <div>
      <ItemDetail producto={producto} />
      <ProductCarousel currentProductId={id} category={producto.category} />
    </div>
  )
}

export default ItemDetailContainer