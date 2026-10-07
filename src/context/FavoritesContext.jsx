import { useState, useCallback, useEffect } from 'react'
import { FavoritesContext } from './contexts'

const STORAGE_KEY = 'santelmates-favoritos'

// Lee los favoritos guardados. Si no hay nada o el navegador bloquea el storage, arranca vacío.
function leerFavoritosGuardados() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(leerFavoritosGuardados)

  // Cada vez que cambian, se guardan para que sobrevivan a una recarga
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // modo incógnito o storage lleno: los favoritos siguen funcionando en memoria
    }
  }, [favorites])

  const toggleFavorite = useCallback((item) => {
    setFavorites((prev) => {
      const existe = prev.find((p) => p.id === item.id)
      if (existe) return prev.filter((p) => p.id !== item.id)
      return [...prev, item]
    })
  }, [])

  const isFavorite = (id) => favorites.some((p) => p.id === id)

  const value = { favorites, toggleFavorite, isFavorite, totalFavorites: favorites.length }

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  )
}
