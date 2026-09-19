import { createContext, useContext, useState, useCallback } from 'react'

const FavoritesContext = createContext(undefined)

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

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites debe usarse dentro de un <FavoritesProvider>')
  }
  return context
}