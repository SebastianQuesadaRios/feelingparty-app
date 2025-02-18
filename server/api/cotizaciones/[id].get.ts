import { Cotizacion } from '~/server/models/Cotizacion'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const cotizacion = await Cotizacion.findById(id)

    if (!cotizacion) {
      throw createError({
        statusCode: 404,
        message: 'Cotización no encontrada'
      })
    }

    return cotizacion
  } catch (error) {
    console.error('Error al obtener cotización:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al obtener la cotización'
    })
  }
}) 