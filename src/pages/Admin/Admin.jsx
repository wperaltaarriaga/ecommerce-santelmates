import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getProducts, updateProducto } from '../../services/firebaseProducts'
import { getTodasLasOrdenes } from '../../services/firebaseOrders'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import styles from './Admin.module.css'

function Cargando({ texto }) {
  return (
    <div className={styles.loading}>
      <span className={styles.spinner} />
      {texto}
    </div>
  )
}

// Fila editable de un producto: precio y stock
function FilaProducto({ producto }) {
  const [price, setPrice] = useState(producto.price)
  const [stock, setStock] = useState(producto.stock)
  const [guardado, setGuardado] = useState({ price: producto.price, stock: producto.stock })
  const [estado, setEstado] = useState(null) // null | 'guardando' | 'ok' | 'error'

  const huboCambios = Number(price) !== guardado.price || Number(stock) !== guardado.stock
  const esValido = Number(price) > 0 && Number.isInteger(Number(stock)) && Number(stock) >= 0

  const guardar = async () => {
    setEstado('guardando')
    try {
      const cambios = { price: Number(price), stock: Number(stock) }
      await updateProducto(producto.id, cambios)
      setGuardado(cambios)
      setEstado('ok')
    } catch {
      setEstado('error')
    }
  }

  return (
    <tr>
      <td className={styles.nombre}>
        {producto.name}
        <span className={styles.categoria}>{producto.category}</span>
      </td>
      <td>
        <label className={styles.srOnly} htmlFor={`precio-${producto.id}`}>Precio de {producto.name}</label>
        <input
          id={`precio-${producto.id}`}
          type="number"
          min="1"
          className={styles.input}
          value={price}
          onChange={(e) => { setPrice(e.target.value); setEstado(null) }}
        />
      </td>
      <td>
        <label className={styles.srOnly} htmlFor={`stock-${producto.id}`}>Stock de {producto.name}</label>
        <input
          id={`stock-${producto.id}`}
          type="number"
          min="0"
          step="1"
          className={`${styles.input} ${Number(stock) === 0 ? styles.sinStock : ''}`}
          value={stock}
          onChange={(e) => { setStock(e.target.value); setEstado(null) }}
        />
      </td>
      <td className={styles.acciones}>
        <button
          className={styles.saveButton}
          onClick={guardar}
          disabled={!huboCambios || !esValido || estado === 'guardando'}
        >
          {estado === 'guardando' ? 'Guardando...' : 'Guardar'}
        </button>
        {estado === 'ok' && <span className={styles.ok}>✓</span>}
        {estado === 'error' && <span className={styles.errorMini}>Error</span>}
      </td>
    </tr>
  )
}

function TabProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getProducts()
      .then((data) => setProductos(data.sort((a, b) => a.category.localeCompare(b.category))))
      .catch(() => setError('No pudimos cargar los productos.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Cargando texto="Cargando productos..." />
  if (error) return <p className={styles.error}>{error}</p>

  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Producto</th>
            <th>Precio</th>
            <th>Stock</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {productos.map((producto) => <FilaProducto key={producto.id} producto={producto} />)}
        </tbody>
      </table>
    </div>
  )
}

function TabOrdenes() {
  const [ordenes, setOrdenes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getTodasLasOrdenes()
      .then(setOrdenes)
      .catch(() => setError('No pudimos cargar las órdenes.'))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Cargando texto="Cargando órdenes..." />
  if (error) return <p className={styles.error}>{error}</p>
  if (ordenes.length === 0) return <p className={styles.vacio}>Todavía no hay órdenes.</p>

  const totalVendido = ordenes.reduce((acc, o) => acc + o.total, 0)

  return (
    <>
      <div className={styles.resumen}>
        <div className={styles.dato}>
          <span className={styles.datoValor}>{ordenes.length}</span>
          <span className={styles.datoLabel}>órdenes</span>
        </div>
        <div className={styles.dato}>
          <span className={styles.datoValor}>${totalVendido.toLocaleString('es-AR')}</span>
          <span className={styles.datoLabel}>vendido en total</span>
        </div>
      </div>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Productos</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {ordenes.map((orden) => (
              <tr key={orden.id}>
                <td>{orden.createdAt?.toLocaleDateString('es-AR') ?? '-'}</td>
                <td>
                  {orden.buyer.nombreApellido}
                  <span className={styles.categoria}>{orden.userEmail} · {orden.buyer.telefono}</span>
                  <span className={styles.categoria}>{orden.buyer.direccion}, {orden.buyer.ciudad}</span>
                </td>
                <td>
                  {orden.items.map((item) => (
                    <span key={item.id} className={styles.itemOrden}>{item.quantity} × {item.name}</span>
                  ))}
                </td>
                <td className={styles.totalCelda}>${orden.total.toLocaleString('es-AR')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}

function Admin() {
  const { user, isAdmin, loading } = useAuth()
  const [tab, setTab] = useState('ordenes')

  if (loading) return <Cargando texto="Verificando permisos..." />

  if (!user || !isAdmin) {
    return (
      <EmptyState
        emoji="🔒"
        title="No tenés acceso a esta sección"
        text="Esta página es solo para administradores de la tienda."
        ctaText="Volver al inicio"
        ctaTo="/"
      />
    )
  }

  return (
    <section className={styles.page}>
      <h1 className={styles.title}>Panel de administración</h1>

      <div className={styles.tabs} role="tablist">
        <button
          role="tab"
          aria-selected={tab === 'ordenes'}
          className={`${styles.tab} ${tab === 'ordenes' ? styles.tabActiva : ''}`}
          onClick={() => setTab('ordenes')}
        >
          Órdenes
        </button>
        <button
          role="tab"
          aria-selected={tab === 'productos'}
          className={`${styles.tab} ${tab === 'productos' ? styles.tabActiva : ''}`}
          onClick={() => setTab('productos')}
        >
          Productos
        </button>
      </div>

      {tab === 'ordenes' ? <TabOrdenes /> : <TabProductos />}
    </section>
  )
}

export default Admin
