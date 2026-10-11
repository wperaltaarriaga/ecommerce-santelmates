import { render, screen } from '@testing-library/react'
import ProductInfo from './ProductInfo'

const descripcion = 'Primer párrafo del mate.\n\nSegundo párrafo,\ncon un salto simple.\n\n\nTercero.'

describe('ProductInfo', () => {
  it('en el detalle separa la descripción en párrafos por cada línea en blanco', () => {
    const { container } = render(<ProductInfo name="Mate" description={descripcion} variant="detail" />)
    const parrafos = container.querySelectorAll('p.parrafo')
    expect(parrafos).toHaveLength(3)
    expect(parrafos[0]).toHaveTextContent('Primer párrafo del mate.')
    expect(parrafos[2]).toHaveTextContent('Tercero.')
  })

  it('en la card va todo en un solo párrafo, sin saltos', () => {
    render(<ProductInfo name="Mate" description={descripcion} />)
    expect(screen.getByText('Primer párrafo del mate. Segundo párrafo, con un salto simple. Tercero.')).toBeInTheDocument()
  })
})
