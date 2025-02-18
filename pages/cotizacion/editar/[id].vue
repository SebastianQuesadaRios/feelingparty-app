<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">
          Editar Cotización N° {{ formatNumero(cotizacion.numero) }}
        </h1>
        <div class="flex gap-4">
          <button @click="previsualizar = true" 
                  class="btn-secondary">
            Previsualizar
          </button>
          <button @click="handleGuardar" 
                  class="btn-primary">
            Guardar Cambios
          </button>
        </div>
      </div>

      <!-- Formulario -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <!-- Información del cliente -->
        <div class="mb-8">
          <h2 class="text-lg font-medium text-gray-900 mb-4">Información del Cliente</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-700">Nombre</label>
              <input v-model="cotizacion.cliente.nombre" 
                     type="text" 
                     class="input-primary mt-1" 
                     required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Empresa</label>
              <input v-model="cotizacion.cliente.empresa" 
                     type="text" 
                     class="input-primary mt-1">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Dirección</label>
              <input v-model="cotizacion.cliente.direccion" 
                     type="text" 
                     class="input-primary mt-1">
            </div>
          </div>
        </div>

        <!-- Items -->
        <div class="mb-8">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-medium text-gray-900">Items</h2>
            <button @click="agregarItem" 
                    class="btn-secondary btn-sm">
              Agregar Item
            </button>
          </div>
          
          <div v-for="(item, index) in cotizacion.items" 
               :key="index" 
               class="flex gap-4 items-start mb-4">
            <div class="flex-grow">
              <input v-model="item.descripcion" 
                     type="text" 
                     class="input-primary w-full" 
                     placeholder="Descripción"
                     required>
            </div>
            <div class="w-32">
              <input v-model.number="item.precio" 
                     type="number" 
                     class="input-primary w-full" 
                     placeholder="Precio"
                     min="0"
                     required>
            </div>
            <button @click="eliminarItem(index)" 
                    class="text-red-600 hover:text-red-800">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <!-- Total -->
        <div class="flex justify-end">
          <div class="w-64">
            <div class="flex justify-between py-2 font-medium">
              <span>Total:</span>
              <span>${{ formatPrice(total) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de previsualización -->
    <div v-if="previsualizar" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div class="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 class="text-lg font-medium text-gray-900">Previsualización</h2>
          <button @click="previsualizar = false" 
                  class="text-gray-500 hover:text-gray-700">
            <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div class="p-6">
          <div class="cotizacion-preview">
            <CotizacionPreview :cotizacion="cotizacion" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import type { Cotizacion } from '~/types/cotizacion'

const route = useRoute()
const router = useRouter()
const previsualizar = ref(false)
const cotizacion = ref<Cotizacion>({
  cliente: {
    nombre: '',
    empresa: '',
    direccion: ''
  },
  items: [],
  subtotal: 0,
  total: 0
})

onMounted(async () => {
  try {
    const id = route.params.id
    const response = await $fetch<Cotizacion>(`/api/cotizaciones/${id}`)
    cotizacion.value = response
  } catch (error) {
    toast.error('Error al cargar la cotización')
    router.push('/dashboard')
  }
})

const total = computed(() => {
  return cotizacion.value.items.reduce((sum, item) => sum + item.precio, 0)
})

const agregarItem = () => {
  cotizacion.value.items.push({
    descripcion: '',
    precio: 0
  })
}

const eliminarItem = (index: number) => {
  cotizacion.value.items.splice(index, 1)
}

const handleGuardar = async () => {
  try {
    if (!cotizacion.value.cliente.nombre) {
      toast.error('El nombre del cliente es requerido')
      return
    }
    if (cotizacion.value.items.length === 0) {
      toast.error('Debe agregar al menos un item')
      return
    }
    if (cotizacion.value.items.some(item => !item.descripcion || item.precio <= 0)) {
      toast.error('Todos los items deben tener descripción y precio válido')
      return
    }

    cotizacion.value.total = total.value
    await $fetch(`/api/cotizaciones/${route.params.id}`, {
      method: 'PUT',
      body: cotizacion.value
    })

    toast.success('¡Cotización actualizada exitosamente!', {
      autoClose: 3000,
      theme: 'colored'
    })

    router.push('/dashboard')
  } catch (error) {
    toast.error('Error al actualizar la cotización')
  }
}

const formatNumero = (numero?: number) => {
  if (!numero) return 'PENDIENTE'
  return numero.toString().padStart(4, '0')
}

const formatPrice = (price: number) => {
  return price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}
</script> 