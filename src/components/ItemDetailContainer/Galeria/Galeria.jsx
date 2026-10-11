import { useRef, useState } from 'react'
import styles from './Galeria.module.css'

const DISTANCIA_SWIPE = 40 // px mínimos de deslizamiento para cambiar de foto

// Foto grande + miniaturas. Con una sola imagen se ve igual que antes (sin flechas ni miniaturas).
// children: lo que va encima de la foto grande (por ejemplo, el botón de favorito).
function Galeria({ imagenes, nombre, children }) {
  const [actual, setActual] = useState(0)
  const inicioToque = useRef(null)
  const hayVarias = imagenes.length > 1

  const irA = (indice) => {
    // Da la vuelta: después de la última vuelve a la primera
    setActual((indice + imagenes.length) % imagenes.length)
  }

  const handleTouchStart = (e) => {
    inicioToque.current = e.touches[0].clientX
  }

  const handleTouchEnd = (e) => {
    if (inicioToque.current === null) return
    const distancia = e.changedTouches[0].clientX - inicioToque.current
    if (distancia > DISTANCIA_SWIPE) irA(actual - 1)
    else if (distancia < -DISTANCIA_SWIPE) irA(actual + 1)
    inicioToque.current = null
  }

  return (
    <div className={styles.galeria}>
      <div
        className={styles.principal}
        onTouchStart={hayVarias ? handleTouchStart : undefined}
        onTouchEnd={hayVarias ? handleTouchEnd : undefined}
      >
        <img
          src={imagenes[actual]}
          alt={hayVarias ? `${nombre} (foto ${actual + 1} de ${imagenes.length})` : nombre}
          className={styles.imagen}
          fetchPriority={actual === 0 ? 'high' : undefined}
        />
        {children}

        {hayVarias && (
          <>
            <button className={`${styles.flecha} ${styles.anterior}`} onClick={() => irA(actual - 1)} aria-label="Foto anterior">
              ‹
            </button>
            <button className={`${styles.flecha} ${styles.siguiente}`} onClick={() => irA(actual + 1)} aria-label="Foto siguiente">
              ›
            </button>
            <span className={styles.contador}>{actual + 1} / {imagenes.length}</span>
          </>
        )}
      </div>

      {hayVarias && (
        <div className={styles.miniaturas}>
          {imagenes.map((src, i) => (
            <button
              key={src + i}
              className={`${styles.miniatura} ${i === actual ? styles.miniaturaActiva : ''}`}
              onClick={() => setActual(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === actual}
            >
              <img src={src} alt="" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default Galeria
