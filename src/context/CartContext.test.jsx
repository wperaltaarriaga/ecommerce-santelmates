import { renderHook, act } from '@testing-library/react'
import { CartProvider } from './CartContext'
import { useCart } from '../hooks/useCart'

const mate = { id: 'mate-1', name: 'Mate Grande', price: 55000 }
const bombilla = { id: 'bomb-1', name: 'Bombilla', price: 6000 }

function renderCart() {
  return renderHook(() => useCart(), { wrapper: CartProvider })
}

describe('CartContext', () => {
  beforeEach(() => localStorage.clear())

  it('guarda el carrito en localStorage y lo recupera al recargar', () => {
    const { result, unmount } = renderCart()
    act(() => result.current.addItem(mate, 2))
    unmount()

    // Simula una recarga: un Provider nuevo lee lo guardado
    const { result: recargado } = renderCart()
    expect(recargado.current.cart).toEqual([{ ...mate, quantity: 2 }])
  })

  it('si lo guardado está roto, arranca con el carrito vacío', () => {
    localStorage.setItem('santelmates-cart', '{esto no es json')
    const { result } = renderCart()
    expect(result.current.cart).toEqual([])
  })

  it('arranca con el carrito vacío', () => {
    const { result } = renderCart()
    expect(result.current.cart).toEqual([])
    expect(result.current.totalItems).toBe(0)
    expect(result.current.totalPrice).toBe(0)
  })

  it('addItem agrega un producto nuevo con su cantidad', () => {
    const { result } = renderCart()
    act(() => result.current.addItem(mate, 2))
    expect(result.current.cart).toEqual([{ ...mate, quantity: 2 }])
    expect(result.current.isInCart('mate-1')).toBe(true)
  })

  it('addItem suma cantidades si el producto ya está (no lo duplica)', () => {
    const { result } = renderCart()
    act(() => result.current.addItem(mate, 1))
    act(() => result.current.addItem(mate, 3))
    expect(result.current.cart).toHaveLength(1)
    expect(result.current.cart[0].quantity).toBe(4)
  })

  it('calcula totalItems y totalPrice', () => {
    const { result } = renderCart()
    act(() => {
      result.current.addItem(mate, 2)
      result.current.addItem(bombilla, 3)
    })
    expect(result.current.totalItems).toBe(5)
    expect(result.current.totalPrice).toBe(55000 * 2 + 6000 * 3)
  })

  it('updateQuantity cambia la cantidad y elimina si llega a 0', () => {
    const { result } = renderCart()
    act(() => result.current.addItem(mate, 2))
    act(() => result.current.updateQuantity('mate-1', 5))
    expect(result.current.cart[0].quantity).toBe(5)
    act(() => result.current.updateQuantity('mate-1', 0))
    expect(result.current.cart).toEqual([])
  })

  it('removeItem y clear', () => {
    const { result } = renderCart()
    act(() => {
      result.current.addItem(mate, 1)
      result.current.addItem(bombilla, 1)
    })
    act(() => result.current.removeItem('mate-1'))
    expect(result.current.isInCart('mate-1')).toBe(false)
    act(() => result.current.clear())
    expect(result.current.cart).toEqual([])
  })

  it('nunca supera el stock del producto', () => {
    const { result } = renderCart()
    const yerbera = { id: 'yer-1', name: 'Yerbera', price: 11000, stock: 5 }
    act(() => result.current.addItem(yerbera, 4))
    act(() => result.current.addItem(yerbera, 4))
    expect(result.current.cart[0].quantity).toBe(5)
    act(() => result.current.updateQuantity('yer-1', 9))
    expect(result.current.cart[0].quantity).toBe(5)
  })

  it('muestra un toast al agregar', () => {
    const { result } = renderCart()
    act(() => result.current.addItem(mate, 1))
    expect(result.current.toast).toBe('Mate Grande agregado al carrito')
  })

  it('tira error si se usa fuera del <CartProvider>', () => {
    vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useCart())).toThrow('useCartData debe usarse dentro de un <CartProvider>')
  })
})
