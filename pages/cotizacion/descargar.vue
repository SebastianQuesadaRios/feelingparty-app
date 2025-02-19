<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-8">Descargar Cotizaciones</h1>

      <!-- Formulario de búsqueda -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Buscar por
            </label>
            <select v-model="tipoBusqueda" class="input-primary">
              <option value="numero">Número de cotización</option>
              <option value="nombre">Nombre del cliente</option>
              <option value="fecha">Fecha</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ labelBusqueda }}
            </label>
            <input v-if="tipoBusqueda !== 'fecha'" v-model="terminoBusqueda"
                   :type="tipoBusqueda === 'numero' ? 'number' : 'text'" class="input-primary"
                   :placeholder="placeholderBusqueda">
            <input v-else v-model="terminoBusqueda" type="date" class="input-primary">
          </div>

          <div class="flex items-end">
            <button @click="buscar" class="btn-primary w-full" :disabled="!terminoBusqueda">
              Buscar
            </button>
          </div>
        </div>
      </div>

      <!-- Resultados -->
      <div v-if="cotizaciones.length > 0" class="bg-white rounded-xl shadow-sm divide-y">
        <div v-for="cotizacion in cotizaciones" :key="cotizacion._id"
             class="p-4 hover:bg-gray-50 cursor-pointer" @click="previsualizarCotizacion(cotizacion)">
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

      <div v-else-if="buscado" class="bg-white rounded-xl shadow-sm p-8 text-center">
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
            <button @click="descargarPDF(cotizacionSeleccionada)" class="btn-danger">Descargar</button>
            <button @click="cotizacionSeleccionada = null" class="text-gray-500 hover:text-gray-700">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M6 18L18 6M6 6l12 12" />
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
import useCotizaciones from '~/composables/useCotizaciones'
import CotizacionPreview from '~/components/CotizacionPreview.vue'

const { generarPDF } = useCotizaciones()
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

    let body: any = { termino: terminoBusqueda.value, tipo: tipoBusqueda.value }

    if (tipoBusqueda.value === 'fecha') {
      const fechaSeleccionada = new Date(terminoBusqueda.value)
      const inicioDia = new Date(fechaSeleccionada.setHours(0, 0, 0, 0)).toISOString()
      const finDia = new Date(fechaSeleccionada.setHours(23, 59, 59, 999)).toISOString()

      body = { inicioDia, finDia, tipo: tipoBusqueda.value }
    }

    const response = await $fetch<Cotizacion[]>('/api/cotizaciones/buscar', {
      method: 'POST',
      body
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

const descargarPDF = async (cotizacion: Cotizacion) => {
  console.log('Descargando PDF para la cotización:', cotizacion)
  try {
    await generarPDF(cotizacion)
    toast.success('PDF descargado correctamente')
  } catch (error) {
    toast.error('Error al generar el PDF')
  }
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

<style scoped>
.btn-danger {
  @apply bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700;
}

.btn-secondary {
  @apply bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400;
}

.input-primary {
  @apply shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md
}
</style>
