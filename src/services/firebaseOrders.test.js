import { runTransaction } from 'firebase/firestore'
import { crearOrden, SinStockError } from './firebaseOrders'

// Firestore simulado: cada producto tiene un stock en memoria
const stockEnBase = {}

vi.mock('../firebase/config', () => ({ db: {} }))
vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => 'orders'),
  doc: vi.fn((_db, coleccion, id) => (coleccion === 'orders' || !id ? { id: 'ORDEN-NUEVA' } : { id })),
  runTransaction: vi.fn(),
  getDocs: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
  where: vi.fn()
}))

function crearTransaccionFalsa() {
  const transaction = {
    get: vi.fn(async (ref) => ({
      exists: () => ref.id in stockEnBase,
      data: () => ({ stock: stockEnBase[ref.id] })
    })),
    set: vi.fn(),
    update: vi.fn()
  }
  runTransaction.mockImplementation(async (_db, fn) => fn(transaction))
  return transaction
}

const orden = {
  userId: 'user-123',
  items: [
    { id: 'mate-1', name: 'Mate Grande', price: 55000, quantity: 2 },
    { id: 'bomb-1', name: 'Bombilla', price: 6000, quantity: 1 }
  ],
  total: 116000
}

describe('crearOrden', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    stockEnBase['mate-1'] = 5
    stockEnBase['bomb-1'] = 3
  })

  it('crea la orden y descuenta el stock de cada producto', async () => {
    const transaction = crearTransaccionFalsa()
    const id = await crearOrden(orden)

    expect(id).toBe('ORDEN-NUEVA')
    expect(transaction.set).toHaveBeenCalledWith({ id: 'ORDEN-NUEVA' }, orden)
    expect(transaction.update).toHaveBeenCalledWith({ id: 'mate-1' }, { stock: 3, lastOrderId: 'ORDEN-NUEVA' })
    expect(transaction.update).toHaveBeenCalledWith({ id: 'bomb-1' }, { stock: 2, lastOrderId: 'ORDEN-NUEVA' })
  })

  it('si un producto no tiene stock suficiente, no escribe nada', async () => {
    stockEnBase['bomb-1'] = 0
    const transaction = crearTransaccionFalsa()

    await expect(crearOrden(orden)).rejects.toBeInstanceOf(SinStockError)
    expect(transaction.set).not.toHaveBeenCalled()
    expect(transaction.update).not.toHaveBeenCalled()
  })

  it('si el producto ya no existe, falla con SinStockError', async () => {
    delete stockEnBase['mate-1']
    crearTransaccionFalsa()
    await expect(crearOrden(orden)).rejects.toThrow('Mate Grande')
  })
})
