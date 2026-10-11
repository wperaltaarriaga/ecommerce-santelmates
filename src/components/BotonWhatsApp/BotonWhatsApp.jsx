import { useLocation } from 'react-router-dom'
import { contacto, linkWhatsApp } from '../../data/contacto'
import styles from './BotonWhatsApp.module.css'

// Botón flotante para consultar por WhatsApp. Si no hay número cargado en data/contacto.js, no se muestra.
function BotonWhatsApp() {
  const { pathname } = useLocation()

  if (!contacto.whatsapp) return null

  // En el detalle de un producto, el mensaje ya menciona el producto.
  // El nombre se toma del título de la pestaña ("Mate Imperial | Santelmates"), que pone useTituloPagina.
  const armarMensaje = () => {
    if (pathname.startsWith('/item/')) {
      const producto = document.title.split(' | ')[0]
      return `¡Hola! Quería consultar por: ${producto} (${window.location.href})`
    }
    return '¡Hola! Tengo una consulta sobre los mates.'
  }

  return (
    <a
      href={linkWhatsApp(armarMensaje())}
      // el href se recalcula al tocarlo, por si cambió el producto
      onClick={(e) => { e.currentTarget.href = linkWhatsApp(armarMensaje()) }}
      className={styles.boton}
      target="_blank"
      rel="noreferrer"
      aria-label="Consultar por WhatsApp"
      title="Consultar por WhatsApp"
    >
      <svg viewBox="0 0 32 32" aria-hidden="true">
        <path
          fill="currentColor"
          d="M16 3C8.8 3 3 8.7 3 15.8c0 2.5.7 4.9 2 7L3 29l6.4-2c2 1.1 4.3 1.7 6.6 1.7 7.2 0 13-5.7 13-12.8S23.2 3 16 3zm0 23.4c-2.1 0-4.1-.6-5.9-1.6l-.4-.3-3.8 1.2 1.2-3.7-.3-.4c-1.2-1.8-1.8-3.9-1.8-6 0-5.9 4.9-10.7 11-10.7s11 4.8 11 10.7-4.9 10.8-11 10.8zm6-8c-.3-.2-2-1-2.3-1.1-.3-.1-.5-.2-.8.2-.2.3-.9 1.1-1.1 1.3-.2.2-.4.3-.7.1-.3-.2-1.4-.5-2.7-1.6-1-.9-1.7-2-1.9-2.3-.2-.3 0-.5.1-.7l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.5 0-.6l-1.1-2.5c-.3-.7-.6-.6-.8-.6h-.7c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.7s1.2 3.2 1.4 3.4c.2.2 2.4 3.6 5.7 5 .8.3 1.4.5 1.9.7.8.3 1.5.2 2.1.1.6-.1 2-.8 2.3-1.6.3-.8.3-1.5.2-1.6-.1-.1-.3-.2-.6-.4z"
        />
      </svg>
    </a>
  )
}

export default BotonWhatsApp
