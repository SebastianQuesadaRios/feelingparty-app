import { Cotizacion } from '~/server/models/Cotizacion'

export default defineEventHandler(async (event) => {
  try {
    const { termino, tipo } = await readBody(event)
    let query = {}

    switch (tipo) {
      case 'numero':
        query = { numero: parseInt(termino) }
        break
      case 'nombre':
        query = { 'cliente.nombre': { $regex: termino, $options: 'i' } }
        break
        case 'fecha':
          // Convertir la fecha ingresada a formato UTC sin hora
          const fechaInicio = new Date(termino)
          fechaInicio.setUTCHours(0, 0, 0, 0) // Establecer la hora al inicio del día
        
          // Establecer el final del día (23:59:59.999)
          const fechaFin = new Date(fechaInicio)
          fechaFin.setUTCHours(23, 59, 59, 999)
        
          query = {
            fecha: {
              $gte: fechaInicio,
              $lt: fechaFin
            }
          }
          break
    }

    const cotizaciones = await Cotizacion.find(query)
      .sort({ fecha: -1 })
      .limit(50)

    return cotizaciones
  } catch (error) {
    console.error('Error al buscar cotizaciones:', error)
    throw createError({
      statusCode: 500,
      message: 'Error al buscar cotizaciones'
    })
  }
}) 