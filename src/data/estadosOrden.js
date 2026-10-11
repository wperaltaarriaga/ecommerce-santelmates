// Estados posibles de una orden, en el orden en que avanzan.
// Tienen que coincidir con la lista de las reglas de Firestore.
export const ESTADOS_ORDEN = [
  { valor: 'pendiente', etiqueta: 'Pendiente' },
  { valor: 'enviada', etiqueta: 'Enviada' },
  { valor: 'entregada', etiqueta: 'Entregada' },
  { valor: 'cancelada', etiqueta: 'Cancelada' }
]

// Las órdenes creadas antes de que existieran los estados no tienen el campo: cuentan como pendientes
export function estadoDe(orden) {
  return orden.estado ?? 'pendiente'
}

export function etiquetaEstado(valor) {
  return ESTADOS_ORDEN.find((e) => e.valor === valor)?.etiqueta ?? valor
}
