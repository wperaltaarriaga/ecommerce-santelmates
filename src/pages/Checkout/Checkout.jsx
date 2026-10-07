import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { serverTimestamp } from 'firebase/firestore'
import { crearOrden, SinStockError } from '../../services/firebaseOrders'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import EmptyState from '../../components/EmptyState/EmptyState.jsx'
import styles from './Checkout.module.css'

const CAMPOS_INICIALES = {
  nombreApellido: '',
  telefono: '',
  direccion: '',
  ciudad: '',
  infoAdicional: ''
}

function validarDatosComprador(datos) {
  const errores = {}
  if (!datos.nombreApellido.trim()) errores.nombreApellido = 'Ingresá tu nombre y apellido.'
  if (!datos.telefono.trim()) errores.telefono = 'Ingresá un teléfono de contacto.'
  if (!datos.direccion.trim()) errores.direccion = 'Ingresá la dirección de entrega.'
  if (!datos.ciudad.trim()) errores.ciudad = 'Ingresá la ciudad.'
  return errores
}

export default function Checkout() {
  const [datosComprador, setDatosComprador] = useState(CAMPOS_INICIALES)
  const [erroresCampos, setErroresCampos] = useState({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState(null)
  const [orderId, setOrderId] = useState(null)
  const { user, loading } = useAuth()
  const { cart, totalPrice, clear } = useCart()
  const navigate = useNavigate()

  const handleChange = (campo) => (event) => {
    setDatosComprador((prev) => ({ ...prev, [campo]: event.target.value }))
    setErroresCampos((prev) => ({ ...prev, [campo]: undefined }))
  }

  const handlePurchase = async (event) => {
    event.preventDefault()
    setError(null)

    // Re-verificación antes de generar la orden: usuario, carrito y datos del formulario
    if (!user) {
      setError('Tenés que iniciar sesión para confirmar la compra.')
      return
    }

    if (cart.length === 0) {
      setError('Tu carrito está vacío.')
      return
    }

    const errores = validarDatosComprador(datosComprador)
    if (Object.keys(errores).length > 0) {
      setErroresCampos(errores)
      setError('Revisá los datos marcados antes de continuar.')
      return
    }

    setIsProcessing(true)

    try {
      const order = {
        userId: user.uid,
        userEmail: user.email,
        buyer: {
          nombreApellido: datosComprador.nombreApellido.trim(),
          telefono: datosComprador.telefono.trim(),
          direccion: datosComprador.direccion.trim(),
          ciudad: datosComprador.ciudad.trim(),
          infoAdicional: datosComprador.infoAdicional.trim()
        },
        items: cart.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        total: totalPrice,
        createdAt: serverTimestamp()
      }

      const nuevoId = await crearOrden(order)
      setOrderId(nuevoId)
      clear()
    } catch (err) {
      setError(err instanceof SinStockError ? err.message : 'No pudimos generar tu orden. Intentá de nuevo.')
    } finally {
      setIsProcessing(false)
    }
  }

  if (orderId) {
    return (
      <div className={styles.successContainer}>
        <h2 className={styles.successTitle}>¡Compra confirmada!</h2>
        <p className={styles.successText}>
          Tu número de orden es <strong>{orderId}</strong>. Guardalo como comprobante.
          También lo vas a encontrar en <Link to="/mis-compras">Mis compras</Link>.
        </p>
        <button className={styles.successButton} onClick={() => navigate('/')}>
          Volver al inicio
        </button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className={styles.loadingSession}>
        <span className={styles.spinner} />
        Verificando tu sesión...
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <EmptyState
        emoji="🛍️"
        title="Todavía no elegiste nada"
        text="Agregá algún mate, bombilla o accesorio al carrito antes de pasar a confirmar tu compra."
        ctaText="Ver catálogo"
        ctaTo="/productos"
      />
    )
  }

  // Sin sesión: se pide iniciar sesión. El carrito vive en el Context, así que no se pierde.
  if (!user) {
    return (
      <div className={styles.successContainer}>
        <h2 className={styles.successTitle}>Iniciá sesión para continuar</h2>
        <p className={styles.successText}>
          Tenés {cart.length} {cart.length === 1 ? 'producto' : 'productos'} en el carrito.
          Ingresá con tu cuenta para completar los datos de entrega y confirmar la compra.
        </p>
        <Link to="/login" state={{ from: '/checkout' }} className={styles.authLink}>
          Iniciar sesión
        </Link>
        <p className={styles.authSecondary}>
          ¿No tenés cuenta? <Link to="/register">Registrate</Link>
        </p>
      </div>
    )
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Finalizar Compra</h1>

      <div className={styles.layout}>
        <form onSubmit={handlePurchase} noValidate className={styles.formColumn}>
          <div className={styles.field}>
            <label htmlFor="checkout-nombreApellido" className={styles.label}>Nombre y apellido</label>
            <input
              id="checkout-nombreApellido"
              autoComplete="name"
              type="text"
              disabled={isProcessing}
              value={datosComprador.nombreApellido}
              onChange={handleChange('nombreApellido')}
              className={styles.input}
            />
            {erroresCampos.nombreApellido && <p className={styles.fieldError}>{erroresCampos.nombreApellido}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="checkout-telefono" className={styles.label}>Teléfono</label>
            <input
              id="checkout-telefono"
              autoComplete="tel"
              type="tel"
              disabled={isProcessing}
              value={datosComprador.telefono}
              onChange={handleChange('telefono')}
              className={styles.input}
            />
            {erroresCampos.telefono && <p className={styles.fieldError}>{erroresCampos.telefono}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="checkout-direccion" className={styles.label}>Dirección</label>
            <input
              id="checkout-direccion"
              autoComplete="street-address"
              type="text"
              disabled={isProcessing}
              value={datosComprador.direccion}
              onChange={handleChange('direccion')}
              className={styles.input}
            />
            {erroresCampos.direccion && <p className={styles.fieldError}>{erroresCampos.direccion}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="checkout-ciudad" className={styles.label}>Ciudad</label>
            <input
              id="checkout-ciudad"
              autoComplete="address-level2"
              type="text"
              disabled={isProcessing}
              value={datosComprador.ciudad}
              onChange={handleChange('ciudad')}
              className={styles.input}
            />
            {erroresCampos.ciudad && <p className={styles.fieldError}>{erroresCampos.ciudad}</p>}
          </div>

          <div className={styles.field}>
            <label htmlFor="checkout-infoAdicional" className={styles.label}>Información adicional (opcional)</label>
            <textarea
              id="checkout-infoAdicional"
              disabled={isProcessing}
              value={datosComprador.infoAdicional}
              onChange={handleChange('infoAdicional')}
              className={styles.textarea}
              rows={3}
              placeholder="Referencias para la entrega, horario preferido, etc."
            />
          </div>

          {error && <p className={styles.error} role="alert">{error}</p>}

          <button type="submit" disabled={isProcessing} className={styles.submitButton}>
            {isProcessing && <span className={styles.spinner} />}
            {isProcessing ? 'Procesando...' : 'Confirmar compra'}
          </button>

          <button type="button" className={styles.cancelButton} onClick={() => navigate(-1)}>
            Cancelar y volver atrás
          </button>
        </form>

        <aside className={styles.cartSummary}>
          <h2 className={styles.cartSummaryTitle}>En tu carrito</h2>
          <div className={styles.cartList}>
            {cart.map((item) => (
              <div className={styles.cartRow} key={item.id}>
                <img loading="lazy" decoding="async" src={item.img} alt={item.name} className={styles.cartThumb} />
                <div className={styles.cartInfo}>
                  <p className={styles.cartItemName}>{item.name}</p>
                  <p className={styles.cartItemQty}>Cantidad: {item.quantity}</p>
                </div>
                <p className={styles.cartItemSubtotal}>
                  ${(item.price * item.quantity).toLocaleString('es-AR')}
                </p>
              </div>
            ))}
          </div>
          <p className={styles.cartTotal}>
            Total: <strong>${totalPrice.toLocaleString('es-AR')}</strong>
          </p>
        </aside>
      </div>
    </div>
  )
}