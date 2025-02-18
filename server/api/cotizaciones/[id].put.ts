import { Cotizacion } from '~/server/models/Cotizacion'

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    const body = await readBody(event)

    const cotizacion = await Cotizacion.findByIdAndUpdate(
      id,
      { 
        $set: {
          'cliente.nombre': body.cliente.nombre,
          'cliente.empresa': body.cliente.empresa,
          'cliente.direccion': body.cliente.direccion,
          items: body.items,
          total: body.total,
          subtotal: body.total
        }
      },
      { new: true }
    )

    if (!cotizacion) {
      throw createError({
        statusCode: 404,
        message: 'Cotización no encontrada'
      })
    }

    return cotizacion
  } catch (error) {
    console.error('Error al actualizar cotización:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al actualizar la cotización'
    })
  }
}) 