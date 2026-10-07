import { useState, useCallback, useEffect } from 'react'
import { CartDataContext, CartActionsContext } from './contexts'

const STORAGE_KEY = 'santelmates-cart'

// Si el producto trae stock, la cantidad nunca lo supera
function limitarAlStock(item, quantity) {
  return item.stock !== undefined ? Math.min(quantity, item.stock) : quantity
}

// Lee el carrito guardado. Si no hay nada o el navegador bloquea el storage, arranca vacío.
function leerCarritoGuardado() {
  try {
    const guardado = localStorage.getItem(STORAGE_KEY)
    return guardado ? JSON.parse(guardado) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }) {
  const [cart, setCart] = useState(leerCarritoGuardado)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [toast, setToast] = useState(null)

  // Cada vez que cambia el carrito, se guarda para que sobreviva a una recarga
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart))
    } catch {
      // modo incógnito o storage lleno: el carrito sigue funcionando en memoria
    }
  }, [cart])

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
          p.id === item.id ? { ...p, quantity: limitarAlStock(p, p.quantity + quantity) } : p
        )
      }
      return [...prev, { ...item, quantity: limitarAlStock(item, quantity) }]
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
      return prev.map((p) => (p.id === itemId ? { ...p, quantity: limitarAlStock(p, quantity) } : p))
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
