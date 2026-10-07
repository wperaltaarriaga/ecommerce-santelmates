import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getOrdenesDeUsuario } from '../../services/firebaseOrders'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import styles from './MisCompras.module.css'

function formatearFecha(fecha) {
  if (!fecha) return 'Fecha no disponible'
  return fecha.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })
}

function MisCompras() {
  const { user, loading: loadingSesion } = useAuth()
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) return
    const fetchOrdenes = async () => {
      try {
        setLoading(true)
        setError(null)
        setOrdenes(await getOrdenesDeUsuario(user.uid))
      } catch {
        setError('No pudimos cargar tus compras. Intentá de nuevo en unos segundos.')
      } finally {
        setLoading(false)
      }
    }
    fetchOrdenes()
  }, [user])

  if (loadingSesion || (user && loading)) {
    return (
      <div className={styles.loading}>
        <span className={styles.spinner} />
        Cargando tus compras...
      </div>
    )
  }

  if (!user) {
    return (
      <div className={styles.authBox}>
        <h2 className={styles.authTitle}>Iniciá sesión para ver tus compras</h2>
        <Link to="/login" state={{ from: '/mis-compras' }} className={styles.authLink}>
          Iniciar sesión
        </Link>
      </div>
    )
  }

  if (error) return <EmptyState emoji="⚠️" title="Algo salió mal" text={error} />

  if (ordenes.length === 0) {
    return (
      <EmptyState
        emoji="🧉"
        title="Todavía no hiciste ninguna compra"
        text="Cuando confirmes tu primer pedido, lo vas a ver acá."
        ctaText="Ver catálogo"
        ctaTo="/productos"
      />
    )
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Mis compras</h1>

      <div className={styles.list}>
        {ordenes.map((orden) => (
          <article key={orden.id} className={styles.card}>
            <header className={styles.cardHeader}>
              <div>
                <p className={styles.fecha}>{formatearFecha(orden.createdAt)}</p>
                <p className={styles.ordenId}>Orden {orden.id}</p>
              </div>
              <p className={styles.total}>${orden.total.toLocaleString('es-AR')}</p>
            </header>

            <ul className={styles.items}>
              {orden.items.map((item) => (
                <li key={item.id} className={styles.item}>
                  <span>{item.quantity} × {item.name}</span>
                  <span>${(item.price * item.quantity).toLocaleString('es-AR')}</span>
                </li>
              ))}
            </ul>

            <p className={styles.entrega}>
              Envío a {orden.buyer.direccion}, {orden.buyer.ciudad}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default MisCompras
