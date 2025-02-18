export interface Cliente {
  nombre: string
  empresa?: string
  direccion?: string
}

export interface Item {
  descripcion: string
  precio: number
}

export interface Cotizacion {
  numero?: number
  fecha?: Date
  cliente: Cliente
  items: Item[]
  subtotal: number
  total: number
  _id?: string
}
