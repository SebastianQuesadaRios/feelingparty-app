import mongoose from 'mongoose'

const cotizacionSchema = new mongoose.Schema({
  numero: {
    type: Number,
    unique: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  cliente: {
    nombre: {
      type: String,
      required: true
    },
    empresa: String,
    direccion: String
  },
  items: [{
    descripcion: {
      type: String,
      required: true
    },
    precio: {
      type: Number,
      required: true
    }
  }],
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  }
}, {
  timestamps: true
})

// Middleware para auto-incrementar el número de cotización
cotizacionSchema.pre('save', async function(next) {
  if (!this.numero) {
    const lastCotizacion = await this.constructor.findOne({}, {}, { sort: { 'numero': -1 } })
    this.numero = lastCotizacion ? lastCotizacion.numero + 1 : 1
  }
  next()
})

export const Cotizacion = mongoose.model('Cotizacion', cotizacionSchema) 