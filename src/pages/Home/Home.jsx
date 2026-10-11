import { Link } from 'react-router-dom'
import styles from './Home.module.css'
import ProductCarousel from '../../components/ProductCarousel/ProductCarousel.jsx'
import Vitrina from './Vitrina.jsx'
import useProducts from '../../hooks/useProducts'
import { useTituloPagina } from '../../hooks/useTituloPagina'
import { slugify } from '../../utils/slugify'

const CANTIDAD_DESTACADOS = 6
// Categoría que tiene su propia sección en el Home
const CATEGORIA_DESTACADA = 'Mates Parsecs'

// Íconos dibujados a mano en SVG (heredan el color del texto)
const ICONOS = {
  mano: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 26V12a3 3 0 0 1 6 0v11" />
      <path d="M23 22V9a3 3 0 0 1 6 0v13" />
      <path d="M29 22V12a3 3 0 0 1 6 0v14" />
      <path d="M17 24l-3.5-4a3 3 0 0 0-4.6 3.8L16 34c2.5 4 5.5 6 10 6h1c5 0 8-4 8-9v-5" />
    </svg>
  ),
  unica: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M24 6l3.5 10.5L38 20l-10.5 3.5L24 34l-3.5-10.5L10 20l10.5-3.5z" />
      <path d="M37 32l1.5 4.5L43 38l-4.5 1.5L37 44l-1.5-4.5L31 38l4.5-1.5z" />
    </svg>
  ),
  regalo: (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="8" y="18" width="32" height="8" rx="1.5" />
      <path d="M11 26v14h26V26M24 18v22" />
      <path d="M24 18c-3-6-10-7-10-2.5S20 18 24 18zM24 18c3-6 10-7 10-2.5S28 18 24 18z" />
    </svg>
  )
}

const BENEFICIOS = [
  { icono: 'mano', titulo: 'Hechos a mano', texto: 'Cada mate se trabaja de forma artesanal, con materiales nobles y terminaciones cuidadas.' },
  { icono: 'unica', titulo: 'Piezas únicas', texto: 'Los colores y detalles varían en cada pieza. No hay dos iguales.' },
  { icono: 'regalo', titulo: 'Para regalar', texto: 'Armá el set completo con mate, bombilla y yerbera, o sorprendé a alguien especial.' }
]

// Primero los que tienen stock, así la vidriera no arranca con "Sin stock"
const conStockPrimero = (a, b) => (b.stock > 0) - (a.stock > 0)

function SeccionProductos({ titulo, linkTexto, linkA, productos, loading, error }) {
  return (
    <section className={styles.productos}>
      <div className={styles.productosHeader}>
        <h2 className={styles.seccionTitulo}>{titulo}</h2>
        <Link to={linkA} className={styles.verTodos}>{linkTexto}</Link>
      </div>

      {loading ? (
        <div className={styles.grilla}>
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className={styles.cardSkeleton} />)}
        </div>
      ) : error ? (
        <p className={styles.error}>No pudimos cargar los productos. {error}</p>
      ) : (
        <Vitrina productos={productos} />
      )}
    </section>
  )
}

function Home() {
  useTituloPagina(null)
  const { products, loading, error } = useProducts()

  const parsecs = products
    .filter((p) => p.category === CATEGORIA_DESTACADA)
    .sort(conStockPrimero)
    .slice(0, CANTIDAD_DESTACADOS)

  // El resto del catálogo, sin repetir los que ya están en la sección de Parsecs
  const destacados = products
    .filter((p) => p.category !== CATEGORIA_DESTACADA)
    .sort(conStockPrimero)
    .slice(0, CANTIDAD_DESTACADOS)

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContenido}>
          <h1 className={styles.heroTitulo}>
            Mates artesanales para tu ritual de todos los días
          </h1>
          <Link to="/productos" className={styles.heroBoton}>
            Elegí tu mate
          </Link>
        </div>
      </section>

      <section className={styles.beneficios}>
        {BENEFICIOS.map((b) => (
          <div key={b.titulo} className={styles.beneficio}>
            <span className={styles.beneficioIcono} aria-hidden="true">{ICONOS[b.icono]}</span>
            <h2 className={styles.beneficioTitulo}>{b.titulo}</h2>
            <p className={styles.beneficioTexto}>{b.texto}</p>
          </div>
        ))}
      </section>

      {/* Si falla la carga, el error se muestra una sola vez (en la sección de abajo) */}
      {(loading || parsecs.length > 0) && (
        <SeccionProductos
          titulo={CATEGORIA_DESTACADA}
          linkTexto="Ver colección"
          linkA={`/category/${slugify(CATEGORIA_DESTACADA)}`}
          productos={parsecs}
          loading={loading}
        />
      )}

      <SeccionProductos
        titulo="otros productos"
        linkTexto="Ver todos"
        linkA="/productos"
        productos={destacados}
        loading={loading}
        error={error}
      />

      <ProductCarousel title="Los elegidos de este mes" />
    </div>
  )
}

export default Home
