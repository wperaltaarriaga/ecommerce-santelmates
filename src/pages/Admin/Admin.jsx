import { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth'
import { getProducts, updateProducto, crearProducto, eliminarProducto } from '../../services/firebaseProducts'
import { getTodasLasOrdenes } from '../../services/firebaseOrders'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import ProductoForm from './ProductoForm.jsx'
import styles from './Admin.module.css'
import { useTituloPagina } from '../../hooks/useTituloPagina'

function Cargando({ texto }) {
  return (
    <div className={styles.loading}>
      <span className={styles.spinner} />
      {texto}
    </div>
  )
}

// Fila de un producto: precio y stock se editan ahí mismo; el resto, con "Editar"
function FilaProducto({ producto, onActualizado, onEditar, onEliminar }) {
  const [price, setPrice] = useState(producto.price)
  const [stock, setStock] = useState(producto.stock)
  const [estado, setEstado] = useState(null) // null | 'guardando' | 'ok' | 'error'

  const huboCambios = Number(price) !== producto.price || Number(stock) !== producto.stock
  const esValido = Number(price) > 0 && Number.isInteger(Number(stock)) && Number(stock) >= 0

  const guardar = async () => {
    setEstado('guardando')
    try {
      const cambios = { price: Number(price), stock: Number(stock) }
      await updateProducto(producto.id, cambios)
      onActualizado({ ...producto, ...cambios })
      setEstado('ok')
    } catch {
      setEstado('error')
    }
  }

  return (
    <tr>
      <td className={styles.nombre}>
        <div className={styles.productoCelda}>
          <img src={producto.img} alt="" className={styles.miniatura} loading="lazy" />
          <div>
            {producto.name}
            <span className={styles.categoria}>{producto.category}</span>
          </div>
        </div>
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
        <button className={styles.linkButton} onClick={() => onEditar(producto)}>Editar</button>
        <button className={`${styles.linkButton} ${styles.dangerLink}`} onClick={() => onEliminar(producto)}>
          Eliminar
        </button>
      </td>
    </tr>
  )
}

const porCategoriaYNombre = (a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name)

function TabProductos() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [mensaje, setMensaje] = useState(null)
  // null = sin formulario; 'nuevo' = crear; un producto = editar ese
  const [formulario, setFormulario] = useState(null)

  useEffect(() => {
    getProducts()
      .then((data) => setProductos(data.sort(porCategoriaYNombre)))
      .catch(() => setError('No pudimos cargar los productos.'))
      .finally(() => setLoading(false))
  }, [])

  const reemplazarEnLista = (actualizado) => {
    setProductos((prev) => prev.map((p) => (p.id === actualizado.id ? actualizado : p)).sort(porCategoriaYNombre))
  }

  const guardarFormulario = async (datos) => {
    if (formulario === 'nuevo') {
      const id = await crearProducto(datos)
      setProductos((prev) => [...prev, { id, ...datos }].sort(porCategoriaYNombre))
      setMensaje(`"${datos.name}" se creó correctamente.`)
    } else {
      await updateProducto(formulario.id, datos)
      reemplazarEnLista({ ...formulario, ...datos })
      setMensaje(`"${datos.name}" se actualizó correctamente.`)
    }
    setFormulario(null)
  }

  const eliminar = async (producto) => {
    const confirmado = window.confirm(
      `¿Eliminar "${producto.name}"? Deja de verse en la tienda. Las órdenes que ya lo incluyen no se modifican.`
    )
    if (!confirmado) return
    try {
      await eliminarProducto(producto.id)
      setProductos((prev) => prev.filter((p) => p.id !== producto.id))
      setMensaje(`"${producto.name}" se eliminó.`)
    } catch {
      setMensaje(`No pudimos eliminar "${producto.name}". Intentá de nuevo.`)
    }
  }

  const abrirFormulario = (valor) => {
    setMensaje(null)
    setFormulario(valor)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (loading) return <Cargando texto="Cargando productos..." />
  if (error) return <p className={styles.error}>{error}</p>

  const imagenesConocidas = [...new Set(productos.map((p) => p.img))].sort()

  return (
    <>
      {formulario ? (
        <ProductoForm
          key={formulario === 'nuevo' ? 'nuevo' : formulario.id}
          producto={formulario === 'nuevo' ? null : formulario}
          imagenesConocidas={imagenesConocidas}
          onGuardar={guardarFormulario}
          onCancelar={() => setFormulario(null)}
        />
      ) : (
        <div className={styles.toolbar}>
          <p className={styles.contador}>{productos.length} productos</p>
          <button className={styles.saveButton} onClick={() => abrirFormulario('nuevo')}>
            + Nuevo producto
          </button>
        </div>
      )}

      {mensaje && <p className={styles.mensaje} role="status">{mensaje}</p>}

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
            {productos.map((producto) => (
              <FilaProducto
                // la key cambia si el producto se edita desde el formulario, así la fila se reinicia con los valores nuevos
                key={`${producto.id}-${producto.price}-${producto.stock}`}
                producto={producto}
                onActualizado={reemplazarEnLista}
                onEditar={abrirFormulario}
                onEliminar={eliminar}
              />
            ))}
          </tbody>
        </table>
      </div>
    </>
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
  useTituloPagina('Admin')
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
