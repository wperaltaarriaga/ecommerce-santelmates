import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartActions, useCartData } from '../../hooks/useCart'
import styles from './Vitrina.module.css'

const VISIBLES = 4 // tarjetas a la vista en la compu (en el celular se ve solo la destacada)
const DISTANCIA_SWIPE = 40

// Carrusel con una tarjeta destacada (verde, más grande, con botón de compra)
// y las demás apagadas a los costados. Inspirado en las vitrinas de producto tipo "showcase".
function Vitrina({ productos }) {
  const [activo, setActivo] = useState(0)
  const inicioToque = useRef(null)
  const { addItem } = useCartActions()
  const { cart } = useCartData()

  const total = productos.length
  if (total === 0) return null

  const indice = (i) => ((i % total) + total) % total
  const mover = (paso) => setActivo((prev) => indice(prev + paso))

  // La destacada va en el segundo lugar: una a la izquierda y el resto a la derecha
  const cantidad = Math.min(VISIBLES, total)
  const desde = total > 1 ? activo - 1 : activo
  const visibles = Array.from({ length: cantidad }, (_, k) => indice(desde + k))

  const handleTouchStart = (e) => { inicioToque.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (inicioToque.current === null) return
    const distancia = e.changedTouches[0].clientX - inicioToque.current
    if (distancia > DISTANCIA_SWIPE) mover(-1)
    else if (distancia < -DISTANCIA_SWIPE) mover(1)
    inicioToque.current = null
  }

  return (
    <div className={styles.vitrina} onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className={styles.fila} style={{ '--columnas': cantidad }}>
        {visibles.map((i) => {
          const producto = productos[i]
          return i === activo ? (
            <TarjetaDestacada
              key={producto.id}
              producto={producto}
              enCarrito={cart.find((p) => p.id === producto.id)?.quantity ?? 0}
              onAgregar={() => addItem(producto, 1)}
              onAnterior={total > 1 ? () => mover(-1) : null}
              onSiguiente={total > 1 ? () => mover(1) : null}
            />
          ) : (
            <button
              key={producto.id}
              className={styles.tarjeta}
              onClick={() => setActivo(i)}
              aria-label={`Ver ${producto.name}`}
            >
              <div className={styles.foto}>
                <img src={producto.img} alt="" loading="lazy" decoding="async" />
              </div>
              <span className={styles.nombre}>{producto.name}</span>
              <span className={styles.precio}>${producto.price.toLocaleString('es-AR')}</span>
            </button>
          )
        })}
      </div>

      {total > 1 && (
        <div className={styles.puntos} aria-hidden="true">
          {productos.map((p, i) => (
            <span key={p.id} className={`${styles.punto} ${i === activo ? styles.puntoActivo : ''}`} />
          ))}
        </div>
      )}
    </div>
  )
}

function TarjetaDestacada({ producto, enCarrito, onAgregar, onAnterior, onSiguiente }) {
  const sinStock = producto.stock === 0
  const llegoAlMaximo = enCarrito >= producto.stock

  let textoBoton = 'Agregar al carrito'
  if (sinStock) textoBoton = 'Sin stock'
  else if (llegoAlMaximo) textoBoton = 'Ya está todo en tu carrito'

  return (
    <article className={styles.destacada} aria-live="polite">
      <div className={styles.fotoDestacada}>
        <Link to={`/item/${producto.id}`} tabIndex={-1}>
          <img src={producto.img} alt={producto.name} decoding="async" />
        </Link>
        {onAnterior && (
          <button className={`${styles.flecha} ${styles.anterior}`} onClick={onAnterior} aria-label="Producto anterior">‹</button>
        )}
        {onSiguiente && (
          <button className={`${styles.flecha} ${styles.siguiente}`} onClick={onSiguiente} aria-label="Producto siguiente">›</button>
        )}
      </div>

      <span className={styles.categoria}>{producto.category}</span>
      <Link to={`/item/${producto.id}`} className={styles.nombreDestacado}>{producto.name}</Link>
      <p className={styles.descripcion}>{(producto.description ?? '').replace(/\s+/g, ' ')}</p>

      <div className={styles.datos}>
        <span>Precio</span>
        <strong>${producto.price.toLocaleString('es-AR')}</strong>
      </div>
      <div className={styles.datos}>
        <span>Stock</span>
        <strong>{sinStock ? 'Agotado' : `${producto.stock} disponibles`}</strong>
      </div>

      <button className={styles.botonAgregar} onClick={onAgregar} disabled={sinStock || llegoAlMaximo}>
        {textoBoton}
      </button>
      <Link to={`/item/${producto.id}`} className={styles.verDetalle}>Ver detalle</Link>
    </article>
  )
}

export default Vitrina
