import { Cotizacion } from '../models/Cotizacion'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const cotizacion = new Cotizacion(body)
    await cotizacion.save()
    return cotizacion
  } catch (error) {
    console.error('Error al crear cotización:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al crear la cotización'
    })
  }
}) 