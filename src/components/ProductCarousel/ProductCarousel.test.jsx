import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { getProducts } from '../../services/firebaseProducts.js'
import ProductCarousel from './ProductCarousel'

vi.mock('../../services/firebaseProducts.js', () => ({ getProducts: vi.fn() }))

describe('ProductCarousel', () => {
  it('si falla la carga, no se muestra y no rompe la página', async () => {
    getProducts.mockRejectedValue(new Error('sin conexión'))
    const { container } = render(<MemoryRouter><ProductCarousel title="Los elegidos" /></MemoryRouter>)
    // Espera a que se resuelva la promesa rechazada
    await new Promise((r) => setTimeout(r, 0))
    expect(container).toBeEmptyDOMElement()
  })

  it('muestra el título cuando hay productos', async () => {
    getProducts.mockResolvedValue([{ id: '1', name: 'Mate', price: 1000, img: '/a.jpg', category: 'Mates' }])
    render(<MemoryRouter><ProductCarousel title="Los elegidos" /></MemoryRouter>)
    expect(await screen.findByText('Los elegidos')).toBeInTheDocument()
  })
})
