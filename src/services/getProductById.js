import { getProducts } from '../mock/asyncMock'

export function getProductById(productId) {
  return new Promise((resolve, reject) => {
    getProducts().then((products) => {
      const producto = products.find((p) => p.id === Number(productId))
      producto ? resolve(producto) : reject(new Error('Producto no encontrado'))
    })
  })
}