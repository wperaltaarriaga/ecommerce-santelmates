import { collection, doc, getDocs, orderBy, query, runTransaction, where } from 'firebase/firestore'
import { db } from '../firebase/config'

export class SinStockError extends Error {
  constructor(nombreProducto) {
    super(`No queda stock suficiente de "${nombreProducto}". Ajustá la cantidad en el carrito.`)
    this.name = 'SinStockError'
  }
}

// Crea la orden y descuenta el stock en una sola transacción:
// o se hace todo, o no se hace nada (nunca queda una orden sin descontar stock, ni al revés).
export async function crearOrden(order) {
  const orderRef = doc(collection(db, 'orders'))

  await runTransaction(db, async (transaction) => {
    const productRefs = order.items.map((item) => doc(db, 'products', item.id))

    // 1) Primero todas las lecturas (Firestore lo exige en las transacciones)
    const snapshots = await Promise.all(productRefs.map((ref) => transaction.get(ref)))

    snapshots.forEach((snap, i) => {
      const item = order.items[i]
      if (!snap.exists() || snap.data().stock < item.quantity) throw new SinStockError(item.name)
    })

    // 2) Después las escrituras: la orden y el stock nuevo de cada producto
    transaction.set(orderRef, order)
    snapshots.forEach((snap, i) => {
      transaction.update(productRefs[i], {
        stock: snap.data().stock - order.items[i].quantity,
        lastOrderId: orderRef.id
      })
    })
  })

  return orderRef.id
}

function mapearOrden(docSnap) {
  const data = docSnap.data()
  return { id: docSnap.id, ...data, createdAt: data.createdAt?.toDate() ?? null }
}

// Órdenes de un usuario, de la más nueva a la más vieja.
// Se ordena en el cliente para no necesitar un índice compuesto en Firestore.
export async function getOrdenesDeUsuario(userId) {
  const q = query(collection(db, 'orders'), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapearOrden).sort((a, b) => (b.createdAt ?? 0) - (a.createdAt ?? 0))
}

// Todas las órdenes (solo para admin; las reglas lo controlan)
export async function getTodasLasOrdenes() {
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(mapearOrden)
}
