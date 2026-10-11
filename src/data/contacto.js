// Datos de contacto de la tienda: se usan en el footer y en el botón flotante de WhatsApp.
// Lo que quede vacío ('') no se muestra en ningún lado.
export const contacto = {
  // Solo números, con código de país y sin el 0 ni el 15. Ej: '5491123456789'
  whatsapp: '',
  email: '',
  // Usuario de Instagram, sin @
  instagram: 'santelmates'
}

// Link de WhatsApp con un mensaje ya escrito
export function linkWhatsApp(mensaje) {
  return `https://wa.me/${contacto.whatsapp}?text=${encodeURIComponent(mensaje)}`
}
