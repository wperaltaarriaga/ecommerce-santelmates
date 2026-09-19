import { useParams } from 'react-router-dom'
import ItemDetail from './ItemDetail/ItemDetail.jsx'
import { SkeletonDetail } from '../Skeletons/Skeletons.jsx'
import useProductDetail from '../../hooks/useProductDetail'
import styles from './ItemDetailContainer.module.css'
import ProductCarousel from '../ProductCarousel/ProductCarousel.jsx'

function ItemDetailContainer() {
  const { id } = useParams()
  const { producto, loading, error } = useProductDetail(id)

  if (loading) return <SkeletonDetail />
  if (error) return <p className={styles.errorText}>⚠️ {error}</p>

  return (
    <div>
      <ItemDetail producto={producto} />
      <ProductCarousel currentProductId={id} category={producto.category} />
    </div>
  )
}

export default ItemDetailContainer