import { useContext } from 'react'
import { CartDataContext, CartActionsContext } from '../context/contexts'

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
