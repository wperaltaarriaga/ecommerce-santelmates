import { categorias } from '../data/categorias'
import { slugify } from './slugify'

export function categoryPathFor(category) {
  for (const cat of categorias) {
    if (cat.nombre === category) return [slugify(cat.nombre)]
    if (cat.subcategorias.includes(category)) return [slugify(cat.nombre), slugify(category)]
  }
  return [slugify(category)]
}