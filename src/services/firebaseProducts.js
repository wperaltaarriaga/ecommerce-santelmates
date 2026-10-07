import { collection, getDocs, getDoc, doc, query, where, updateDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { slugify } from '../utils/slugify'

export async function getProducts(categoryId) {
  const productsRef = collection(db, 'products')
  const q = categoryId
    ? query(productsRef, where('categoryPath', 'array-contains', slugify(categoryId)))
    : productsRef
  const snapshot = await getDocs(q)
  return snapshot.docs.map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
}

export async function getProductById(id) {
  const productRef = doc(db, 'products', id)
  const snapshot = await getDoc(productRef)
  if (!snapshot.exists()) throw new Error('Producto no encontrado')
  return { id: snapshot.id, ...snapshot.data() }
}
// Solo un admin puede hacerlo (lo controlan las reglas de Firestore)
export async function updateProducto(id, cambios) {
  await updateDoc(doc(db, 'products', id), cambios)
}
