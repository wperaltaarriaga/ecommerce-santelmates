export function getProductById(productId) {
    return new Promise((resolve, reject) => {
      fetch(`${import.meta.env.VITE_API_URL_BASE}/products/${productId}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Producto no encontrado')
          }
          return response.json()
        })
        .then((data) => {
          // La Fake Store API puede devolver "null" en el body (con status
          // 200) cuando el id no existe, en vez de un 404 real. Por eso
          // verificamos también que data no sea null antes de resolver.
          if (!data) {
            reject(new Error('Producto no encontrado'))
          } else {
            // Mapeamos los campos de la API (title/price/image/category/
            // description) a los nombres que usan nuestros componentes.
            const productoMapeado = {
              id: data.id,
              nombre: data.title,
              precio: data.price,
              categoria: data.category,
              imagen: data.image,
              descripcion: data.description,
              stock: 10, // la Fake Store API no provee stock; usamos un valor fijo simulado
            }
            resolve(productoMapeado)
          }
        })
        .catch((error) => reject(error))
    })
  }