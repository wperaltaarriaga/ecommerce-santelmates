import { collection, getDocs, getDoc, doc, query, where, updateDoc, addDoc, deleteDoc } from 'firebase/firestore'
import { db } from '../firebase/config'
import { slugify } from '../utils/slugify'
import { categoryPathFor } from '../utils/categoryPath'

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

// ----- Escrituras: solo un admin puede hacerlas (lo controlan las reglas de Firestore) -----

// Si cambia la categoría, se recalcula categoryPath para que el filtro por categoría siga andando
function conCategoryPath(datos) {
  return datos.category ? { ...datos, categoryPath: categoryPathFor(datos.category) } : datos
}

export async function crearProducto(datos) {
  const docRef = await addDoc(collection(db, 'products'), conCategoryPath(datos))
  return docRef.id
}

export async function updateProducto(id, cambios) {
  await updateDoc(doc(db, 'products', id), conCategoryPath(cambios))
}

export async function eliminarProducto(id) {
  await deleteDoc(doc(db, 'products', id))
}
