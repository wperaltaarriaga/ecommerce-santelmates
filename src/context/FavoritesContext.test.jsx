import { renderHook, act } from '@testing-library/react'
import { FavoritesProvider } from './FavoritesContext'
import { useFavorites } from '../hooks/useFavorites'

const mate = { id: 'mate-1', name: 'Mate Grande', price: 55000 }

function renderFavoritos() {
  return renderHook(() => useFavorites(), { wrapper: FavoritesProvider })
}

describe('FavoritesContext', () => {
  beforeEach(() => localStorage.clear())

  it('toggleFavorite agrega y quita', () => {
    const { result } = renderFavoritos()
    act(() => result.current.toggleFavorite(mate))
    expect(result.current.isFavorite('mate-1')).toBe(true)
    expect(result.current.totalFavorites).toBe(1)
    act(() => result.current.toggleFavorite(mate))
    expect(result.current.isFavorite('mate-1')).toBe(false)
  })

  it('se guardan y se recuperan al recargar', () => {
    const { result, unmount } = renderFavoritos()
    act(() => result.current.toggleFavorite(mate))
    unmount()

    const { result: recargado } = renderFavoritos()
    expect(recargado.current.favorites).toEqual([mate])
  })

  it('si lo guardado está roto, arranca vacío', () => {
    localStorage.setItem('santelmates-favoritos', 'no es json')
    const { result } = renderFavoritos()
    expect(result.current.favorites).toEqual([])
  })
})
