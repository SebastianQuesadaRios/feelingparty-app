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
        if (termino && typeof termino === 'string') {
          const fechaBusqueda = new Date(termino);
    
          // Establecer el inicio del día (00:00:00)
          const fechaInicio = new Date(fechaBusqueda.setHours(0, 0, 0, 0));
    
          // Establecer el final del día (23:59:59)
          const fechaFin = new Date(fechaBusqueda.setHours(23, 59, 59, 999));
  
           console.log('Fecha recibida:', termino);
            console.log('Fecha inicio:', fechaInicio);
            console.log('Fecha fin:', fechaFin);
  
            query = {
              fecha: {
               $gte: fechaInicio,
               $lte: fechaFin
                }
             };
        }
        break;
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
