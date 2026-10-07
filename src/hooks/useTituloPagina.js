import { useEffect } from 'react'

const TITULO_POR_DEFECTO = 'Santelmates | Mates artesanales'

// Cambia el título de la pestaña del navegador según la página.
// null = título por defecto; undefined = no tocar el título (lo maneja otro componente).
export function useTituloPagina(titulo) {
  useEffect(() => {
    if (titulo === undefined) return
    document.title = titulo ? `${titulo} | Santelmates` : TITULO_POR_DEFECTO
  }, [titulo])
}
