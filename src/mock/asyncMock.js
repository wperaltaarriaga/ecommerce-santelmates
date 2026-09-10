const products = [
  {
    id: 1,
    name: "Mate Imperial",
    price: 15000,
    category: "Mates",
    img: "/mate1.jpg",
    stock: 8,
    description: "Mate de calabaza con virola de alpaca, ideal para el uso diario. Mantiene la temperatura del agua por más tiempo gracias a su cuerpo natural."
  },
  {
    id: 2,
    name: "Mate Camionero",
    price: 9500,
    category: "Mates",
    img: "https://placehold.co/400x400?text=Mate+Camionero",
    stock: 12,
    description: "Mate torpedo forrado en cuero genuino, resistente a golpes y de estilo clásico argentino."
  },
  {
    id: 3,
    name: "Bombilla de Alpaca",
    price: 6000,
    category: "Bombillas",
    img: "https://placehold.co/400x400?text=Bombilla",
    stock: 20,
    description: "Bombilla artesanal con filtro removible, fácil de limpiar y desarmar para un mantenimiento prolijo."
  },
  {
    id: 4,
    name: "Yerbera de Cuero",
    price: 11000,
    category: "Despolvilladores",
    img: "/despolvilador.jpg",
    stock: 5,
    description: "Yerbera de cuero genuino con tapa hermética, mantiene la yerba fresca y protegida de la humedad."
  },
  {
    id: 5,
    name: "Mate Torpedo",
    price: 13500,
    category: "Mates",
    img: "https://placehold.co/400x400?text=Mate+Torpedo",
    stock: 3,
    description: "Mate de madera torneada con detalles tallados a mano, pieza única de estilo rústico."
  },
  {
    id: 6,
    name: "Mate de Vidrio Templado",
    price: 12800,
    category: "Mates",
    img: "https://placehold.co/400x400?text=Mate+Vidrio",
    stock: 10,
    description: "Mate moderno de vidrio templado con base de madera, resistente a cambios de temperatura y fácil de higienizar."
  },
  {
    id: 7,
    name: "Mate Porongo Chico",
    price: 8200,
    category: "Mates",
    img: "https://placehold.co/400x400?text=Mate+Porongo",
    stock: 15,
    description: "Mate de calabaza pequeño, curado a mano, ideal para tomar solo o para llevar de viaje."
  },
  {
    id: 8,
    name: "Mate de Algarrobo",
    price: 17500,
    category: "Mates",
    img: "https://placehold.co/400x400?text=Mate+Algarrobo",
    stock: 6,
    description: "Mate tallado en madera de algarrobo macizo, pieza robusta con vetas naturales únicas en cada unidad."
  },
  {
    id: 9,
    name: "Bombilla de Acero Inoxidable",
    price: 4500,
    category: "Bombillas",
    img: "https://placehold.co/400x400?text=Bombilla+Acero",
    stock: 25,
    description: "Bombilla recta de acero inoxidable con filtro tipo cuchara, apta para lavavajillas."
  },
  {
    id: 10,
    name: "Bombilla Pico de Loro",
    price: 7200,
    category: "Bombillas",
    img: "https://placehold.co/400x400?text=Bombilla+Pico",
    stock: 14,
    description: "Bombilla clásica pico de loro en alpaca, con grabados artesanales en el cuerpo."
  },
  {
    id: 11,
    name: "Despolvillador de Yerba",
    price: 5300,
    category: "Despolvilladores",
    img: "https://placehold.co/400x400?text=Despolvillador",
    stock: 18,
    description: "Colador de malla fina para separar el polvillo de la yerba antes de cebar, mango ergonómico."
  },
  {
    id: 12,
    name: "Yerbera y Azucarera Set",
    price: 14200,
    category: "Despolvilladores",
    img: "https://placehold.co/400x400?text=Set+Yerbera",
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