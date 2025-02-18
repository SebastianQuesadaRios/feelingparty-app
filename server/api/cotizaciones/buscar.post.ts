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
        const fecha = new Date(termino)
        const fechaFin = new Date(fecha)
        fechaFin.setDate(fecha.getDate() + 1)
        query = {
          fecha: {
            $gte: fecha,
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