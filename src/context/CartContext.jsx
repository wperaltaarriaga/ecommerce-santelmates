import { createContext, useContext, useState, useCallback, useEffect } from 'react'

const CartDataContext = createContext(undefined)
const CartActionsContext = createContext(undefined)

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2500)
    return () => clearTimeout(timer)
  }, [toast])

  const addItem = useCallback((item, quantity) => {
    setCart((prev) => {
      const existe = prev.find((p) => p.id === item.id)
      if (existe) {
        return prev.map((p) =>
          p.id === item.id ? { ...p, quantity: p.quantity + quantity } : p
        )
      }
      return [...prev, { ...item, quantity }]
    })
    setToast(`${item.name} agregado al carrito`)
  }, [])

  const removeItem = useCallback((itemId) => {
    setCart((prev) => prev.filter((p) => p.id !== itemId))
  }, [])

  const clear = useCallback(() => {
    setCart([])
  }, [])

  const updateQuantity = useCallback((itemId, quantity) => {
    setCart((prev) => {
      if (quantity <= 0) return prev.filter((p) => p.id !== itemId)
      return prev.map((p) => (p.id === itemId ? { ...p, quantity } : p))
    })
  }, [])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  const isInCart = (id) => cart.some((p) => p.id === id)
  const totalItems = cart.reduce((acc, p) => acc + p.quantity, 0)
  const totalPrice = cart.reduce((acc, p) => acc + p.price * p.quantity, 0)

  const dataValue = { cart, totalItems, totalPrice, isCartOpen, toast }
  const actionsValue = { addItem, removeItem, clear, isInCart, updateQuantity, openCart, closeCart }

  return (
    <CartActionsContext.Provider value={actionsValue}>
      <CartDataContext.Provider value={dataValue}>
        {children}
      </CartDataContext.Provider>
    </CartActionsContext.Provider>
  )
}

export function useCartData() {
  const context = useContext(CartDataContext)
  if (context === undefined) throw new Error('useCartData debe usarse dentro de un <CartProvider>')
  return context
}

export function useCartActions() {
  const context = useContext(CartActionsContext)
  if (context === undefined) throw new Error('useCartActions debe usarse dentro de un <CartProvider>')
  return context
}

export function useCart() {
  return { ...useCartData(), ...useCartActions() }
}