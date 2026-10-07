import { useState } from 'react'
import { categorias } from '../../data/categorias'
import styles from './Admin.module.css'

// Todas las categorías y subcategorías en una sola lista, para el <select>
const OPCIONES_CATEGORIA = categorias.flatMap((c) => [
  { valor: c.nombre, etiqueta: c.nombre },
  ...c.subcategorias.map((sub) => ({ valor: sub, etiqueta: `${c.nombre} › ${sub}` }))
])

const PRODUCTO_VACIO = { name: '', category: '', price: '', stock: '', img: '', description: '' }

// Mismos límites que las reglas de Firestore, así el error se ve acá y no como un "permission-denied"
function validarProducto(datos) {
  const errores = {}
  if (!datos.name.trim()) errores.name = 'Ingresá un nombre.'
  else if (datos.name.trim().length > 100) errores.name = 'Máximo 100 caracteres.'
  if (!datos.category) errores.category = 'Elegí una categoría.'
  if (!(Number(datos.price) > 0)) errores.price = 'El precio tiene que ser mayor a 0.'
  if (datos.stock === '' || !Number.isInteger(Number(datos.stock)) || Number(datos.stock) < 0) {
    errores.stock = 'El stock tiene que ser un número entero, 0 o más.'
  }
  if (!datos.img.trim()) errores.img = 'Indicá la imagen.'
  else if (datos.img.trim().length > 300) errores.img = 'Máximo 300 caracteres.'
  if (datos.description.length > 1000) errores.description = 'Máximo 1000 caracteres.'
  return errores
}

// Formulario para crear o editar un producto.
// imagenesConocidas: rutas de imágenes ya usadas, para sugerirlas al escribir.
function ProductoForm({ producto, imagenesConocidas = [], onGuardar, onCancelar }) {
  const esNuevo = !producto
  const [datos, setDatos] = useState(() =>
    producto
      ? {
          name: producto.name,
          category: producto.category,
          price: String(producto.price),
          stock: String(producto.stock),
          img: producto.img,
          description: producto.description ?? ''
        }
      : PRODUCTO_VACIO
  )
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (campo) => (event) => {
    setDatos((prev) => ({ ...prev, [campo]: event.target.value }))
    setErrores((prev) => ({ ...prev, [campo]: undefined }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    const nuevosErrores = validarProducto(datos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }
    setGuardando(true)
    try {
      await onGuardar({
        name: datos.name.trim(),
        category: datos.category,
        price: Number(datos.price),
        stock: Number(datos.stock),
        img: datos.img.trim(),
        description: datos.description.trim()
      })
    } catch {
      setError('No pudimos guardar el producto. Revisá tu conexión y que tu usuario sea admin.')
      setGuardando(false)
    }
  }

  const campo = (id, etiqueta, input, nombreError) => (
    <div className={styles.formField}>
      <label htmlFor={id} className={styles.formLabel}>{etiqueta}</label>
      {input}
      {errores[nombreError] && <p className={styles.fieldError}>{errores[nombreError]}</p>}
    </div>
  )

  return (
    <form className={styles.productForm} onSubmit={handleSubmit} noValidate>
      <h2 className={styles.formTitle}>{esNuevo ? 'Nuevo producto' : `Editar: ${producto.name}`}</h2>

      <div className={styles.formGrid}>
        <div className={styles.formColumn}>
          {campo('prod-name', 'Nombre',
            <input id="prod-name" className={styles.formInput} value={datos.name} onChange={handleChange('name')} />, 'name')}

          {campo('prod-category', 'Categoría',
            <select id="prod-category" className={styles.formInput} value={datos.category} onChange={handleChange('category')}>
              <option value="">Elegí una categoría</option>
              {OPCIONES_CATEGORIA.map((op) => <option key={op.valor} value={op.valor}>{op.etiqueta}</option>)}
            </select>, 'category')}

          <div className={styles.formRow}>
            {campo('prod-price', 'Precio ($)',
              <input id="prod-price" type="number" min="1" className={styles.formInput} value={datos.price} onChange={handleChange('price')} />, 'price')}
            {campo('prod-stock', 'Stock',
              <input id="prod-stock" type="number" min="0" step="1" className={styles.formInput} value={datos.stock} onChange={handleChange('stock')} />, 'stock')}
          </div>

          {campo('prod-img', 'Imagen',
            <>
              <input
                id="prod-img"
                className={styles.formInput}
                value={datos.img}
                onChange={handleChange('img')}
                placeholder="/imagenes/mateGrande.jpg o https://..."
                list="imagenes-conocidas"
              />
              <datalist id="imagenes-conocidas">
                {imagenesConocidas.map((ruta) => <option key={ruta} value={ruta} />)}
              </datalist>
              <p className={styles.formHint}>
                Ruta de una imagen de la carpeta <code>public/</code> o una URL completa.
              </p>
            </>, 'img')}
        </div>

        <div className={styles.formColumn}>
          <div className={styles.imgPreview}>
            {datos.img.trim()
              ? <img src={datos.img.trim()} alt="Vista previa" />
              : <span>Vista previa de la imagen</span>}
          </div>
        </div>
      </div>

      {campo('prod-description', 'Descripción',
        <textarea id="prod-description" rows={4} className={styles.formInput} value={datos.description} onChange={handleChange('description')} />, 'description')}

      {error && <p className={styles.error} role="alert">{error}</p>}

      <div className={styles.formActions}>
        <button type="button" className={styles.secondaryButton} onClick={onCancelar} disabled={guardando}>
          Cancelar
        </button>
        <button type="submit" className={styles.saveButton} disabled={guardando}>
          {guardando ? 'Guardando...' : esNuevo ? 'Crear producto' : 'Guardar cambios'}
        </button>
      </div>
    </form>
  )
}

export default ProductoForm
