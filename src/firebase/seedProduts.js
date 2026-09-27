import { addDoc, collection } from 'firebase/firestore'
import { db } from './config'
import { categoryPathFor } from '../utils/categoryPath'

const products = [
  // --- Mates Parsecs ---
  { name: 'Mate Grande', price: 55000, category: 'Mates Parsecs', img: '/imagenes/mateGrande.jpg', stock: 8, description: 'Mate de calabaza con virola de alpaca, ideal para el uso diario. Mantiene la temperatura del agua por más tiempo gracias a su cuerpo natural.' },
  { name: 'Mate Grande', price: 12800, category: 'Mates Parsecs', img: '/imagenes/mateGrande.jpg', stock: 10, description: 'Mate moderno de vidrio templado con base de madera, resistente a cambios de temperatura y fácil de higienizar.' },
  { name: 'Mate Chico', price: 8200, category: 'Mates Parsecs', img: '/imagenes/mateChico.jpg', stock: 15, description: 'Mate de calabaza pequeño, curado a mano, ideal para tomar solo o para llevar de viaje.' },
  { name: 'Mate Camionero', price: 16000, category: 'Mates Parsecs', img: '/imagenes/mateGrande.jpg', stock: 9, description: 'Mate de asta forrado en cuero, cuerpo ancho y base firme, pensado para largas jornadas en ruta.' },
  { name: 'Mate Torpedo Grabado', price: 18500, category: 'Mates Parsecs', img: '/imagenes/mateGrande.jpg', stock: 7, description: 'Mate torpedo en alpaca con grabados artesanales en todo el cuerpo, pieza de estilo tradicional.' },

  // --- Mates Cuero ---
  { name: 'Mate Mediano', price: 9500, category: 'Mates Cuero', img: '/imagenes/mateMed.jpg', stock: 12, description: 'Mate torpedo forrado en cuero genuino, resistente a golpes y de estilo clásico argentino.' },
  { name: 'Mate Chico', price: 13500, category: 'Mates Cuero', img: '/imagenes/mateChico.jpg', stock: 3, description: 'Mate de madera torneada con detalles tallados a mano, pieza única de estilo rústico.' },
  { name: 'Mate Mediano', price: 17500, category: 'Mates Cuero', img: '/imagenes/mateMed.jpg', stock: 6, description: 'Mate tallado en madera de algarrobo macizo, pieza robusta con vetas naturales únicas en cada unidad.' },
  { name: 'Mate Imperial', price: 21000, category: 'Mates Cuero', img: '/imagenes/mateMed.jpg', stock: 4, description: 'Mate de calabaza forrado completamente en cuero repujado, con costuras a mano y terminación premium.' },

  // --- Bombillas (sin subcategoría) ---
  { name: 'Bombilla', price: 6000, category: 'Bombillas', img: '/imagenes/bombilla.jpg', stock: 20, description: 'Bombilla artesanal con filtro removible, fácil de limpiar y desarmar para un mantenimiento prolijo.' },
  { name: 'Bombilla de Acero Inoxidable', price: 4500, category: 'Bombillas', img: '/imagenes/bombilla.jpg', stock: 25, description: 'Bombilla recta de acero inoxidable con filtro tipo cuchara, apta para lavavajillas.' },
  { name: 'Bombilla Pico de Loro', price: 7200, category: 'Bombillas', img: '/imagenes/bombilla.jpg', stock: 14, description: 'Bombilla clásica pico de loro en alpaca, con grabados artesanales en el cuerpo.' },
  { name: 'Bombilla de Alpaca Lisa', price: 8900, category: 'Bombillas', img: '/imagenes/bombilla.jpg', stock: 11, description: 'Bombilla lisa de alpaca maciza, diseño minimalista y muy resistente al uso diario.' },

  // --- Accesorios > Yerberas ---
  { name: 'Yerbera de Cuero', price: 11000, category: 'Yerberas', img: '/imagenes/despol1.jpg', stock: 5, description: 'Yerbera de cuero genuino con tapa hermética, mantiene la yerba fresca y protegida de la humedad.' },
  { name: 'Yerbera y Azucarera Set', price: 14200, category: 'Yerberas', img: '/imagenes/bombilla.jpg', stock: 7, description: 'Set combinado de yerbera y azucarera en cuero repujado, ideal para tener todo a mano en la mesa.' },
  { name: 'Yerbera Redonda de Lata', price: 9800, category: 'Yerberas', img: '/imagenes/despol1.jpg', stock: 13, description: 'Yerbera redonda de lata pintada a mano, con motivos criollos y tapa a presión.' },

  // --- Accesorios > Despolvilladores ---
  { name: 'Despolvillador de Yerba', price: 5300, category: 'Despolvilladores', img: '/imagenes/despol2.png', stock: 18, description: 'Colador de malla fina para separar el polvillo de la yerba antes de cebar, mango ergonómico.' },
  { name: 'Despolvillador Doble Malla', price: 6100, category: 'Despolvilladores', img: '/imagenes/despol2.png', stock: 16, description: 'Despolvillador de doble malla para un filtrado más fino, con mango de madera antideslizante.' }
]

export async function seedProducts() {
  for (const { category, ...data } of products) {
    const docRef = await addDoc(collection(db, 'products'), {
      ...data,
      category,
      categoryPath: categoryPathFor(category)
    })
    console.log(`Producto cargado con id ${docRef.id}`)
  }
  console.log('Carga inicial completa ✅')
}