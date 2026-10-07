import { useContext } from 'react'
import { FavoritesContext } from '../context/contexts'

export function useFavorites() {
  const context = useContext(FavoritesContext)
  if (context === undefined) {
    throw new Error('useFavorites debe usarse dentro de un <FavoritesProvider>')
  }
  return context
}
