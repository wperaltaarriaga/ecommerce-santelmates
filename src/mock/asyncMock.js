const products = [
  {
    id: 1,
    name: "Mate Grande",
    price: 55000,
    category: "Mates",
    img: "/imagenes/mateGrande.jpg",
    stock: 8,
    description: "Mate de calabaza con virola de alpaca, ideal para el uso diario. Mantiene la temperatura del agua por más tiempo gracias a su cuerpo natural."
  },
  {
    id: 2,
    name: "Mate Mediano",
    price: 9500,
    category: "Mates",
    img: "/imagenes/mateMed.jpg",
    stock: 12,
    description: "Mate torpedo forrado en cuero genuino, resistente a golpes y de estilo clásico argentino."
  },
  {
    id: 3,
    name: "Bombilla",
    price: 6000,
    category: "Bombillas",
    img: "/imagenes/bombilla.jpg",
    stock: 20,
    description: "Bombilla artesanal con filtro removible, fácil de limpiar y desarmar para un mantenimiento prolijo."
  },
  {
    id: 4,
    name: "Yerbera de Cuero",
    price: 11000,
    category: "Despolvilladores",
    img: "/imagenes/despol1.jpg",
    stock: 5,
    description: "Yerbera de cuero genuino con tapa hermética, mantiene la yerba fresca y protegida de la humedad."
  },
  {
    id: 5,
    name: "Mate Chico",
    price: 13500,
    category: "Mates",
    img: "/imagenes/mateChico.jpg",
    stock: 3,
    description: "Mate de madera torneada con detalles tallados a mano, pieza única de estilo rústico."
  },
  {
    id: 6,
    name: "Mate Grande",
    price: 12800,
    category: "Mates",
    img: "/imagenes/mateGrande.jpg",
    stock: 10,
    description: "Mate moderno de vidrio templado con base de madera, resistente a cambios de temperatura y fácil de higienizar."
  },
  {
    id: 7,
    name: "Mate Chico",
    price: 8200,
    category: "Mates",
    img: "/imagenes/mateChico.jpg",
    stock: 15,
    description: "Mate de calabaza pequeño, curado a mano, ideal para tomar solo o para llevar de viaje."
  },
  {
    id: 8,
    name: "Mate Mediano",
    price: 17500,
    category: "Mates",
    img: "/imagenes/mateMed.jpg",
    stock: 6,
    description: "Mate tallado en madera de algarrobo macizo, pieza robusta con vetas naturales únicas en cada unidad."
  },
  {
    id: 9,
    name: "Bombilla de Acero Inoxidable",
    price: 4500,
    category: "Bombillas",
    img: "/imagenes/bombilla.jpg",
    stock: 25,
    description: "Bombilla recta de acero inoxidable con filtro tipo cuchara, apta para lavavajillas."
  },
  {
    id: 10,
    name: "Bombilla Pico de Loro",
    price: 7200,
    category: "Bombillas",
    img: "/imagenes/bombilla.jpg",
    stock: 14,
    description: "Bombilla clásica pico de loro en alpaca, con grabados artesanales en el cuerpo."
  },
  {
    id: 11,
    name: "Despolvillador de Yerba",
    price: 5300,
    category: "Despolvilladores",
    img: "/imagenes/despol2.png",
    stock: 18,
    description: "Colador de malla fina para separar el polvillo de la yerba antes de cebar, mango ergonómico."
  },
  {
    id: 12,
    name: "Yerbera y Azucarera Set",
    price: 14200,
    category: "Despolvilladores",
    img: "/imagenes/bombilla.jpg",
    stock: 7,
    description: "Set combinado de yerbera y azucarera en cuero repujado, ideal para tener todo a mano en la mesa."
  }
]

export function getProducts() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products)
    }, 2000)
  })
}