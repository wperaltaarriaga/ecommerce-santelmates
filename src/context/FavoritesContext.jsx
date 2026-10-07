import { useState, useCallback } from 'react'
import { FavoritesContext } from './contexts'

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState([])

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
