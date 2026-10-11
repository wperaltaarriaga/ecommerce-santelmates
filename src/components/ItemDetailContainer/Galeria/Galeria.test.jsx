import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Galeria from './Galeria'

const imagenes = ['/a.jpg', '/b.jpg', '/c.jpg']

function fotoGrande() {
  return screen.getByAltText(/Mate Imperial/)
}

describe('Galeria', () => {
  it('con una sola imagen no muestra flechas ni miniaturas', () => {
    render(<Galeria imagenes={['/a.jpg']} nombre="Mate Imperial" />)
    expect(fotoGrande()).toHaveAttribute('src', '/a.jpg')
    expect(screen.queryByRole('button', { name: 'Foto siguiente' })).not.toBeInTheDocument()
  })

  it('las flechas recorren las fotos y dan la vuelta', async () => {
    const user = userEvent.setup()
    render(<Galeria imagenes={imagenes} nombre="Mate Imperial" />)

    await user.click(screen.getByRole('button', { name: 'Foto siguiente' }))
    expect(fotoGrande()).toHaveAttribute('src', '/b.jpg')
    await user.click(screen.getByRole('button', { name: 'Foto anterior' }))
    await user.click(screen.getByRole('button', { name: 'Foto anterior' }))
    expect(fotoGrande()).toHaveAttribute('src', '/c.jpg')
  })

  it('tocar una miniatura cambia la foto grande', async () => {
    const user = userEvent.setup()
    render(<Galeria imagenes={imagenes} nombre="Mate Imperial" />)
    await user.click(screen.getByRole('button', { name: 'Ver foto 3' }))
    expect(fotoGrande()).toHaveAttribute('src', '/c.jpg')
    expect(screen.getByText('3 / 3')).toBeInTheDocument()
  })

  it('deslizar con el dedo hacia la izquierda pasa a la siguiente', () => {
    render(<Galeria imagenes={imagenes} nombre="Mate Imperial" />)
    const contenedor = fotoGrande().parentElement
    fireEvent.touchStart(contenedor, { touches: [{ clientX: 200 }] })
    fireEvent.touchEnd(contenedor, { changedTouches: [{ clientX: 100 }] })
    expect(fotoGrande()).toHaveAttribute('src', '/b.jpg')
  })
})
