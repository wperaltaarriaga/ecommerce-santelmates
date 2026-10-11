import { useState } from 'react'
import { categorias } from '../../data/categorias'
import styles from './Admin.module.css'

// Todas las categorías y subcategorías en una sola lista, para el <select>
const OPCIONES_CATEGORIA = categorias.flatMap((c) => [
  { valor: c.nombre, etiqueta: c.nombre },
  ...c.subcategorias.map((sub) => ({ valor: sub, etiqueta: `${c.nombre} › ${sub}` }))
])

const PRODUCTO_VACIO = { name: '', category: '', price: '', stock: '', imagenes: [''], description: '' }
export const MAX_IMAGENES = 8

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
  const imagenes = datos.imagenes.map((i) => i.trim()).filter(Boolean)
  if (imagenes.length === 0) errores.imagenes = 'Agregá al menos una imagen.'
  else if (imagenes.some((i) => i.length > 300)) errores.imagenes = 'Cada link puede tener hasta 300 caracteres.'
  else if (imagenes.some((i) => /^https?:\/\/ibb\.co\//.test(i))) {
    errores.imagenes = 'Los links de ibb.co son la página, no la foto. Usá el "enlace directo" (empieza con https://i.ibb.co/).'
  }
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
          // Productos viejos solo tienen `img`; los nuevos guardan todas en `imgs` (la principal primero)
          imagenes: producto.imgs?.length ? [...producto.imgs] : [producto.img],
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

  // ----- Lista de imágenes -----
  const actualizarImagenes = (cambiar) => {
    setDatos((prev) => ({ ...prev, imagenes: cambiar([...prev.imagenes]) }))
    setErrores((prev) => ({ ...prev, imagenes: undefined }))
  }
  const cambiarImagen = (i, valor) => actualizarImagenes((lista) => { lista[i] = valor; return lista })
  const agregarImagen = () => actualizarImagenes((lista) => [...lista, ''])
  const quitarImagen = (i) => actualizarImagenes((lista) => (lista.length > 1 ? lista.filter((_, j) => j !== i) : ['']))
  // La principal es siempre la primera de la lista
  const hacerPrincipal = (i) => actualizarImagenes((lista) => [lista[i], ...lista.filter((_, j) => j !== i)])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    const nuevosErrores = validarProducto(datos)
    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores)
      return
    }
    setGuardando(true)
    const imagenes = datos.imagenes.map((i) => i.trim()).filter(Boolean)
    try {
      await onGuardar({
        name: datos.name.trim(),
        category: datos.category,
        price: Number(datos.price),
        stock: Number(datos.stock),
        img: imagenes[0], // la principal: la usan la card, el carrito y el checkout
        imgs: imagenes,
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

          <fieldset className={styles.imagenesFieldset}>
            <legend className={styles.formLabel}>Imágenes</legend>
            {datos.imagenes.map((url, i) => (
              <div key={i} className={styles.imagenFila}>
                <div className={styles.imagenThumb}>
                  {url.trim() ? <img src={url.trim()} alt="" /> : <span>{i + 1}</span>}
                </div>
                <label htmlFor={`prod-img-${i}`} className={styles.srOnly}>Imagen {i + 1}</label>
                <input
                  id={`prod-img-${i}`}
                  className={styles.formInput}
                  value={url}
                  onChange={(e) => cambiarImagen(i, e.target.value)}
                  placeholder="https://i.ibb.co/... o /imagenes/..."
                  list="imagenes-conocidas"
                />
                {i === 0 ? (
                  <span className={styles.principalBadge} title="Imagen principal">★</span>
                ) : (
                  <button type="button" className={styles.iconButton} onClick={() => hacerPrincipal(i)} title="Hacer principal" aria-label={`Hacer principal la imagen ${i + 1}`}>
                    ☆
                  </button>
                )}
                <button type="button" className={styles.iconButton} onClick={() => quitarImagen(i)} title="Quitar" aria-label={`Quitar imagen ${i + 1}`}>
                  ✕
                </button>
              </div>
            ))}
            <datalist id="imagenes-conocidas">
              {imagenesConocidas.map((ruta) => <option key={ruta} value={ruta} />)}
            </datalist>
            {datos.imagenes.length < MAX_IMAGENES && (
              <button type="button" className={styles.addImageButton} onClick={agregarImagen}>
                + Agregar imagen
              </button>
            )}
            <p className={styles.formHint}>
              La ★ es la principal (la que se ve en el catálogo). Hasta {MAX_IMAGENES} imágenes: link directo
              (ej. <code>https://i.ibb.co/...</code>) o ruta de <code>public/</code>.
            </p>
            {errores.imagenes && <p className={styles.fieldError}>{errores.imagenes}</p>}
          </fieldset>
        </div>

        <div className={styles.formColumn}>
          <div className={styles.imgPreview}>
            {datos.imagenes[0]?.trim()
              ? <img src={datos.imagenes[0].trim()} alt="Vista previa de la imagen principal" />
              : <span>Vista previa de la imagen principal</span>}
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
