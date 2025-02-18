import { defineEventHandler, getRouterParam, createError } from 'h3'
import { Cotizacion } from '~/server/models/Cotizacion'

export default defineEventHandler(async (event) => {
  if (event.node.req.method === 'DELETE') {
    try {
      const id = getRouterParam(event, 'id')
      if (!id) {
        throw createError({ statusCode: 400, message: 'ID de cotización requerido' })
      }
      const cotizacion = await Cotizacion.findByIdAndDelete(id)
      if (!cotizacion) {
        throw createError({ statusCode: 404, message: 'Cotización no encontrada' })
      }
      return { message: 'Cotización eliminada correctamente' }
    } catch (error) {
      console.error('Error al eliminar cotización:', error)
      throw createError({ statusCode: 500, message: 'Error al eliminar cotización' })
    }
  } else {
    throw createError({ statusCode: 405, message: 'Método no permitido' })
  }
})
