<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-8">Buscar Cotizaciones</h1>

      <!-- Formulario de búsqueda -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Buscar por
            </label>
            <select v-model="tipoBusqueda" 
                    class="input-primary">
              <option value="numero">Número de cotización</option>
              <option value="nombre">Nombre del cliente</option>
              <option value="fecha">Fecha</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ labelBusqueda }}
            </label>
            <input v-if="tipoBusqueda !== 'fecha'"
                   v-model="terminoBusqueda"
                   :type="tipoBusqueda === 'numero' ? 'number' : 'text'"
                   class="input-primary"
                   :placeholder="placeholderBusqueda">
            <input v-else
                   v-model="terminoBusqueda"
                   type="date"
                   class="input-primary">
          </div>

          <div class="flex items-end">
            <button @click="buscar"
                    class="btn-primary w-full"
                    :disabled="!terminoBusqueda">
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div v-if="cotizaciones.length > 0" class="bg-white rounded-xl shadow-sm divide-y">
        <div v-for="cotizacion in cotizaciones" 
             :key="cotizacion._id"
             class="p-4 hover:bg-gray-50 cursor-pointer"
             @click="previsualizarCotizacion(cotizacion)">
          <div class="flex justify-between items-start">
            <div>
              <p class="font-medium text-gray-900">
                Cotización N° {{ formatNumero(cotizacion.numero) }}
              </p>
              <p class="text-sm text-gray-600">
                {{ cotizacion.cliente.nombre }}
                <span v-if="cotizacion.cliente.empresa">
                  - {{ cotizacion.cliente.empresa }}
                </span>
              </p>
            </div>
            <div class="text-right">
              <p class="text-sm text-gray-600">
                {{ formatDate(cotizacion.fecha) }}
              </p>
              <p class="font-medium text-gray-900">
                ${{ formatPrice(cotizacion.total) }}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="buscado" 
           class="bg-white rounded-xl shadow-sm p-8 text-center">
        <p class="text-gray-600">No se encontraron resultados</p>
      </div>
    </div>

    <!-- Modal de previsualización -->
    <div v-if="cotizacionSeleccionada" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Cotización</h2>
          <div class="flex gap-4">
            <button @click="descargarPDF" 
                    class="btn-primary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
              </svg>
              Descargar PDF
            </button>
            <button @click="editarCotizacion" 
                    class="btn-secondary flex items-center gap-2">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
              </svg>
              Editar
            </button>
            <button @click="cotizacionSeleccionada = null" 
                    class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                      d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        <div class="p-6">
          <div class="cotizacion-preview">
            <CotizacionPreview :cotizacion="cotizacionSeleccionada" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import type { Cotizacion } from '~/types/cotizacion'

const router = useRouter()
const tipoBusqueda = ref('numero')
const terminoBusqueda = ref('')
const cotizaciones = ref<Cotizacion[]>([])
const buscado = ref(false)
const cotizacionSeleccionada = ref<Cotizacion | null>(null)

const labelBusqueda = computed(() => {
  switch (tipoBusqueda.value) {
    case 'numero': return 'Número'
    case 'nombre': return 'Nombre del cliente'
    case 'fecha': return 'Fecha'
    default: return ''
  }
})

const placeholderBusqueda = computed(() => {
  switch (tipoBusqueda.value) {
    case 'numero': return 'Ej: 1001'
    case 'nombre': return 'Nombre del cliente'
    default: return ''
  }
})

const buscar = async () => {
  try {
    if (!terminoBusqueda.value) return

    const response = await $fetch<Cotizacion[]>('/api/cotizaciones/buscar', {
      method: 'POST',
      body: {
        termino: terminoBusqueda.value,
        tipo: tipoBusqueda.value
      }
    })

    cotizaciones.value = response
    buscado.value = true
  } catch (error) {
    console.error('Error al buscar:', error)
    toast.error('Error al buscar cotizaciones')
  }
}

const previsualizarCotizacion = (cotizacion: Cotizacion) => {
  cotizacionSeleccionada.value = cotizacion
}

const descargarPDF = async () => {
  if (!cotizacionSeleccionada.value) return
  
  try {
    await generarPDF(cotizacionSeleccionada.value)
    toast.success('PDF descargado correctamente')
  } catch (error) {
    toast.error('Error al generar el PDF')
  }
}

const editarCotizacion = () => {
  if (!cotizacionSeleccionada.value?._id) return
  router.push(`/cotizacion/editar/${cotizacionSeleccionada.value._id}`)
}

const formatNumero = (numero?: number) => {
  if (!numero) return 'PENDIENTE'
  return numero.toString().padStart(4, '0')
}

const formatDate = (date?: Date) => {
  if (!date) return ''
  return new Date(date).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const formatPrice = (price: number) => {
  return price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script> 