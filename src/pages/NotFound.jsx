import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <section style={{ padding: '80px 40px', textAlign: 'center' }}>
      <h2>404 - Página no encontrada</h2>
      <p>La página que buscás no existe.</p>
      <Link to="/">Volver al inicio</Link>
    </section>
  )
}

export default NotFound