import { render, screen } from '@testing-library/react'
import EstadoOrden from './EstadoOrden'

describe('EstadoOrden', () => {
  it('una orden sin estado (creada antes de que existieran) se muestra como Pendiente', () => {
    render(<EstadoOrden orden={{ id: '1' }} />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
  })

  it('muestra la etiqueta del estado guardado', () => {
    render(<EstadoOrden orden={{ id: '1', estado: 'enviada' }} />)
    expect(screen.getByText('Enviada')).toBeInTheDocument()
  })
})
