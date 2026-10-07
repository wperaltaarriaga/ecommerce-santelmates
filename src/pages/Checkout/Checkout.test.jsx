import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useCart } from '../../hooks/useCart'
import { crearOrden, SinStockError } from '../../services/firebaseOrders'
import Checkout from './Checkout'

// Se mockea Firebase para no escribir en la base real
vi.mock('firebase/firestore', () => ({ serverTimestamp: vi.fn(() => 'TIMESTAMP') }))
vi.mock('../../services/firebaseOrders', () => {
  class SinStockError extends Error {}
  return { crearOrden: vi.fn(), SinStockError }
})
vi.mock('../../hooks/useAuth', () => ({ useAuth: vi.fn() }))
vi.mock('../../hooks/useCart', () => ({ useCart: vi.fn() }))

const usuario = { uid: 'user-123', email: 'wanda@santelmates.com' }
const carrito = [{ id: 'mate-1', name: 'Mate Grande', price: 55000, quantity: 2, img: '/m.jpg' }]

function renderCheckout({ cart = carrito, user = usuario, loading = false } = {}) {
  const clear = vi.fn()
  useAuth.mockReturnValue({ user, loading })
  useCart.mockReturnValue({ cart, totalPrice: 110000, clear })
  render(<MemoryRouter><Checkout /></MemoryRouter>)
  return { clear }
}

async function completarFormulario(user) {
  await user.type(screen.getByLabelText('Nombre y apellido'), 'Wanda Peralta')
  await user.type(screen.getByLabelText('Teléfono'), '1122334455')
  await user.type(screen.getByLabelText('Dirección'), 'Av. Siempreviva 742')
  await user.type(screen.getByLabelText('Ciudad'), 'Buenos Aires')
}

describe('Checkout', () => {
  beforeEach(() => vi.clearAllMocks())

  it('muestra un loader mientras se valida la sesión', () => {
    renderCheckout({ user: null, loading: true })
    expect(screen.getByText('Verificando tu sesión...')).toBeInTheDocument()
  })

  it('muestra el EmptyState si el carrito está vacío', () => {
    renderCheckout({ cart: [] })
    expect(screen.getByText('Todavía no elegiste nada')).toBeInTheDocument()
  })

  it('sin sesión pide iniciar sesión en lugar del formulario', () => {
    renderCheckout({ user: null })
    expect(screen.getByText('Iniciá sesión para continuar')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Iniciar sesión' })).toHaveAttribute('href', '/login')
    expect(screen.queryByRole('button', { name: 'Confirmar compra' })).not.toBeInTheDocument()
  })

  it('no crea la orden si faltan datos obligatorios', async () => {
    const user = userEvent.setup()
    renderCheckout()
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))
    expect(screen.getByText('Revisá los datos marcados antes de continuar.')).toBeInTheDocument()
    expect(screen.getByText('Ingresá tu nombre y apellido.')).toBeInTheDocument()
    expect(crearOrden).not.toHaveBeenCalled()
  })

  it('crea la orden, muestra el ID y vacía el carrito', async () => {
    const user = userEvent.setup()
    crearOrden.mockResolvedValue('ORDEN-1')
    const { clear } = renderCheckout()

    await completarFormulario(user)
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))

    expect(crearOrden).toHaveBeenCalledWith(expect.objectContaining({
      userId: 'user-123',
      userEmail: 'wanda@santelmates.com',
      items: [{ id: 'mate-1', name: 'Mate Grande', price: 55000, quantity: 2 }],
      total: 110000
    }))
    expect(await screen.findByText('ORDEN-1')).toBeInTheDocument()
    expect(clear).toHaveBeenCalled()
  })

  it('si Firestore falla, muestra error y NO vacía el carrito', async () => {
    const user = userEvent.setup()
    crearOrden.mockRejectedValue(new Error('permission-denied'))
    const { clear } = renderCheckout()

    await completarFormulario(user)
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))

    expect(await screen.findByText('No pudimos generar tu orden. Intentá de nuevo.')).toBeInTheDocument()
    expect(clear).not.toHaveBeenCalled()
  })

  it('si no queda stock, muestra qué producto falta y NO vacía el carrito', async () => {
    const user = userEvent.setup()
    crearOrden.mockRejectedValue(new SinStockError('No queda stock suficiente de "Mate Grande".'))
    const { clear } = renderCheckout()

    await completarFormulario(user)
    await user.click(screen.getByRole('button', { name: 'Confirmar compra' }))

    expect(await screen.findByText('No queda stock suficiente de "Mate Grande".')).toBeInTheDocument()
    expect(clear).not.toHaveBeenCalled()
  })
})
