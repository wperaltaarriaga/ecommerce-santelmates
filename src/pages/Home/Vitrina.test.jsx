import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useCartActions, useCartData } from '../../hooks/useCart'
import Vitrina from './Vitrina'

vi.mock('../../hooks/useCart', () => ({ useCartActions: vi.fn(), useCartData: vi.fn() }))

const productos = [
  { id: 'a', name: 'Mate A', price: 1000, stock: 3, img: '/a.jpg', category: 'Mates', description: 'Uno' },
  { id: 'b', name: 'Mate B', price: 2000, stock: 0, img: '/b.jpg', category: 'Mates', description: 'Dos' },
  { id: 'c', name: 'Mate C', price: 3000, stock: 5, img: '/c.jpg', category: 'Mates', description: 'Tres' }
]

function renderVitrina(cart = []) {
  const addItem = vi.fn()
  useCartActions.mockReturnValue({ addItem })
  useCartData.mockReturnValue({ cart })
  render(<MemoryRouter><Vitrina productos={productos} /></MemoryRouter>)
  return { addItem }
}

// El nombre de la destacada es un link; los de las apagadas, texto dentro de un botón
const destacada = () => screen.getByRole('article')

describe('Vitrina', () => {
  it('arranca con el primer producto destacado', () => {
    renderVitrina()
    expect(destacada()).toHaveTextContent('Mate A')
  })

  it('las flechas cambian la destacada y dan la vuelta', async () => {
    const user = userEvent.setup()
    renderVitrina()
    await user.click(screen.getByRole('button', { name: 'Producto anterior' }))
    expect(destacada()).toHaveTextContent('Mate C')
    await user.click(screen.getByRole('button', { name: 'Producto siguiente' }))
    expect(destacada()).toHaveTextContent('Mate A')
  })

  it('tocar una tarjeta apagada la vuelve destacada', async () => {
    const user = userEvent.setup()
    renderVitrina()
    await user.click(screen.getByRole('button', { name: 'Ver Mate C' }))
    expect(destacada()).toHaveTextContent('Mate C')
  })

  it('agrega 1 unidad al carrito', async () => {
    const user = userEvent.setup()
    const { addItem } = renderVitrina()
    await user.click(screen.getByRole('button', { name: 'Agregar al carrito' }))
    expect(addItem).toHaveBeenCalledWith(productos[0], 1)
  })

  it('sin stock, el botón queda deshabilitado', async () => {
    const user = userEvent.setup()
    renderVitrina()
    await user.click(screen.getByRole('button', { name: 'Producto siguiente' }))
    expect(screen.getByRole('button', { name: 'Sin stock' })).toBeDisabled()
  })

  it('si ya está todo el stock en el carrito, no deja agregar más', () => {
    renderVitrina([{ id: 'a', quantity: 3 }])
    expect(screen.getByRole('button', { name: 'Ya está todo en tu carrito' })).toBeDisabled()
  })
})
