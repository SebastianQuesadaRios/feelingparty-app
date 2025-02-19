<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-8">Eliminar Cotizaciones</h1>

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
                   :type="tipoBusqueda === 'numero' ? 'number' : 'text'"
                   class="input-primary" :placeholder="placeholderBusqueda">
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
      <div v-if="resultados.length > 0" class="bg-white rounded-xl shadow-sm divide-y">
        <div v-for="cotizacion in resultados" :key="cotizacion._id" class="p-4 hover:bg-gray-50 cursor-pointer">
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
              <button @click.stop="confirmarEliminacion(cotizacion)" class="btn-danger">Eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="buscado" class="bg-white rounded-xl shadow-sm p-8 text-center">
        <p class="text-gray-600">No se encontraron resultados</p>
      </div>

      <!-- Modal de confirmación -->
      <div v-if="mostrarConfirmacion"
           class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div class="bg-white rounded-xl p-6 max-w-md w-full text-center">
          <h3 class="text-lg font-medium text-gray-900 mb-2">Confirmar Eliminación</h3>
          <p class="text-gray-600 mb-6">
            Por favor, introduce el número de cotización para confirmar la eliminación.
          </p>
          <input v-model="numeroConfirmacion" type="number" class="input-primary mb-4"
                 placeholder="Número de cotización">
          <div class="flex justify-center gap-4">
<button @click="eliminarCotizacion" class="btn-danger"
                    :disabled="Number(numeroConfirmacion) !== cotizacionAEliminar?.numero">
              Eliminar
            </button>
            <button @click="cancelarEliminacion" class="btn-secondary">Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { toast } from 'vue3-toastify'
import useCotizaciones from '~/composables/useCotizaciones'
import type { Cotizacion } from '~/types/cotizacion'

const { eliminarCotizacion: eliminarCotizacionById } = useCotizaciones()

const tipoBusqueda = ref('numero')
const terminoBusqueda = ref('')
const resultados = ref<Cotizacion[]>([])
const buscado = ref(false)

const mostrarConfirmacion = ref(false)
const cotizacionAEliminar = ref<Cotizacion | null>(null)
const numeroConfirmacion = ref('')

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
    if (!terminoBusqueda.value) return;

    let body: any = { termino: terminoBusqueda.value, tipo: tipoBusqueda.value };

    if (tipoBusqueda.value === 'fecha') {
      const fechaSeleccionada = new Date(terminoBusqueda.value);
      const inicioDia = new Date(fechaSeleccionada.setHours(0, 0, 0, 0)).toISOString();
      const finDia = new Date(fechaSeleccionada.setHours(23, 59, 59, 999)).toISOString();

      body = { inicioDia, finDia, tipo: tipoBusqueda.value };
    }

    const response = await $fetch<Cotizacion[]>('/api/cotizaciones/buscar', {
      method: 'POST',
      body
    });

    resultados.value = response;
    buscado.value = true;
  } catch (error) {
    console.error('Error al buscar:', error);
    toast.error('Error al buscar cotizaciones');
  }
};

const confirmarEliminacion = (cotizacion: Cotizacion) => {
  cotizacionAEliminar.value = cotizacion
  mostrarConfirmacion.value = true
}

const cancelarEliminacion = () => {
  mostrarConfirmacion.value = false
  cotizacionAEliminar.value = null
  numeroConfirmacion.value = ''
}

const eliminarCotizacion = async () => {
  if (!cotizacionAEliminar.value || !cotizacionAEliminar.value._id) return

  try {
    await eliminarCotizacionById(cotizacionAEliminar.value._id)
    toast.success('Cotización eliminada correctamente')
    mostrarConfirmacion.value = false
    buscar() // Recargar resultados
  } catch (error) {
    console.error('Error al eliminar la cotización:', error)
    toast.error('Error al eliminar la cotización')
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
