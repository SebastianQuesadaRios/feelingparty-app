import mongoose from 'mongoose'

export default defineNitroPlugin(async () => {
  const config = useRuntimeConfig()
  
  try {
    await mongoose.connect(config.mongodbUri)
    console.log('Conectado a MongoDB')
  } catch (e) {
    console.error('Error al conectar con MongoDB:', e)
  }
}) 