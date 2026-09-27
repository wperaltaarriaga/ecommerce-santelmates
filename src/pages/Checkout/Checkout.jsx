import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'
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
  const { user } = useAuth()
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

      const docRef = await addDoc(collection(db, 'orders'), order)
      setOrderId(docRef.id)
      clear()
    } catch (err) {
      setError('No pudimos generar tu orden. Intentá de nuevo.')
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
        </p>
        <button className={styles.successButton} onClick={() => navigate('/')}>
          Volver al inicio
        </button>
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

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Finalizar Compra</h1>

      <div className={styles.layout}>
        <form onSubmit={handlePurchase} noValidate className={styles.formColumn}>
          <div className={styles.field}>
            <label className={styles.label}>Nombre y apellido</label>
            <input
              type="text"
              disabled={isProcessing}
              value={datosComprador.nombreApellido}
              onChange={handleChange('nombreApellido')}
              className={styles.input}
            />
            {erroresCampos.nombreApellido && <p className={styles.fieldError}>{erroresCampos.nombreApellido}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Teléfono</label>
            <input
              type="tel"
              disabled={isProcessing}
              value={datosComprador.telefono}
              onChange={handleChange('telefono')}
              className={styles.input}
            />
            {erroresCampos.telefono && <p className={styles.fieldError}>{erroresCampos.telefono}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Dirección</label>
            <input
              type="text"
              disabled={isProcessing}
              value={datosComprador.direccion}
              onChange={handleChange('direccion')}
              className={styles.input}
            />
            {erroresCampos.direccion && <p className={styles.fieldError}>{erroresCampos.direccion}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Ciudad</label>
            <input
              type="text"
              disabled={isProcessing}
              value={datosComprador.ciudad}
              onChange={handleChange('ciudad')}
              className={styles.input}
            />
            {erroresCampos.ciudad && <p className={styles.fieldError}>{erroresCampos.ciudad}</p>}
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Información adicional (opcional)</label>
            <textarea
              disabled={isProcessing}
              value={datosComprador.infoAdicional}
              onChange={handleChange('infoAdicional')}
              className={styles.textarea}
              rows={3}
              placeholder="Referencias para la entrega, horario preferido, etc."
            />
          </div>

          {error && <p className={styles.error}>{error}</p>}

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
                <img src={item.img} alt={item.name} className={styles.cartThumb} />
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