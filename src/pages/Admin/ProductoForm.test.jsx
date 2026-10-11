import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductoForm from './ProductoForm'

describe('ProductoForm', () => {
  it('no guarda si faltan datos y marca los errores', async () => {
    const user = userEvent.setup()
    const onGuardar = vi.fn()
    render(<ProductoForm onGuardar={onGuardar} onCancelar={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(screen.getByText('Ingresá un nombre.')).toBeInTheDocument()
    expect(screen.getByText('Elegí una categoría.')).toBeInTheDocument()
    expect(screen.getByText('El precio tiene que ser mayor a 0.')).toBeInTheDocument()
    expect(onGuardar).not.toHaveBeenCalled()
  })

  it('crea un producto con los números convertidos', async () => {
    const user = userEvent.setup()
    const onGuardar = vi.fn().mockResolvedValue()
    render(<ProductoForm onGuardar={onGuardar} onCancelar={vi.fn()} />)

    await user.type(screen.getByLabelText('Nombre'), '  Termo Stanley  ')
    await user.selectOptions(screen.getByLabelText('Categoría'), 'Termos')
    await user.type(screen.getByLabelText('Precio ($)'), '45000')
    await user.type(screen.getByLabelText('Stock'), '4')
    await user.type(screen.getByLabelText('Imagen 1'), '/imagenes/termo.jpg')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))

    expect(onGuardar).toHaveBeenCalledWith({
      name: 'Termo Stanley',
      category: 'Termos',
      price: 45000,
      stock: 4,
      img: '/imagenes/termo.jpg',
      imgs: ['/imagenes/termo.jpg'],
      description: ''
    })
  })

  it('en modo edición arranca con los datos del producto', () => {
    const producto = { id: 'p1', name: 'Mate Chico', category: 'Mates Cuero', price: 8200, stock: 3, img: '/imagenes/mateChico.jpg', description: 'Lindo' }
    render(<ProductoForm producto={producto} onGuardar={vi.fn()} onCancelar={vi.fn()} />)

    expect(screen.getByText('Editar: Mate Chico')).toBeInTheDocument()
    expect(screen.getByLabelText('Precio ($)')).toHaveValue(8200)
    expect(screen.getByLabelText('Categoría')).toHaveValue('Mates Cuero')
  })

  it('varias imágenes: la marcada como principal queda primera y es img', async () => {
    const user = userEvent.setup()
    const onGuardar = vi.fn().mockResolvedValue()
    const producto = { id: 'p1', name: 'Mate', category: 'Mates Cuero', price: 9000, stock: 2, img: '/a.jpg', description: '' }
    render(<ProductoForm producto={producto} onGuardar={onGuardar} onCancelar={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: '+ Agregar imagen' }))
    await user.type(screen.getByLabelText('Imagen 2'), '/b.jpg')
    await user.click(screen.getByRole('button', { name: '+ Agregar imagen' }))
    await user.type(screen.getByLabelText('Imagen 3'), '/c.jpg')
    await user.click(screen.getByRole('button', { name: 'Hacer principal la imagen 3' }))
    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))

    expect(onGuardar).toHaveBeenCalledWith(expect.objectContaining({
      img: '/c.jpg',
      imgs: ['/c.jpg', '/a.jpg', '/b.jpg']
    }))
  })

  it('ignora los campos de imagen vacíos y rechaza links de página de ibb.co', async () => {
    const user = userEvent.setup()
    const onGuardar = vi.fn()
    const producto = { id: 'p1', name: 'Mate', category: 'Mates Cuero', price: 9000, stock: 2, img: 'https://ibb.co/ksgjQyFc', description: '' }
    render(<ProductoForm producto={producto} onGuardar={onGuardar} onCancelar={vi.fn()} />)

    await user.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    expect(screen.getByText(/Los links de ibb.co son la página/)).toBeInTheDocument()
    expect(onGuardar).not.toHaveBeenCalled()
  })

  it('el stock con decimales no es válido', async () => {
    const user = userEvent.setup()
    const onGuardar = vi.fn()
    render(<ProductoForm onGuardar={onGuardar} onCancelar={vi.fn()} />)
    await user.type(screen.getByLabelText('Stock'), '2.5')
    await user.click(screen.getByRole('button', { name: 'Crear producto' }))
    expect(screen.getByText('El stock tiene que ser un número entero, 0 o más.')).toBeInTheDocument()
  })
})
