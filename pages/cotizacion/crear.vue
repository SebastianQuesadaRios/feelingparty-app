<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-6">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-semibold text-gray-900">Crear Cotización</h1>
        <div class="flex gap-4">
          <button @click="previsualizar = true" 
                  class="btn-secondary">
            Previsualizar
          </button>
          <button @click="handleGuardar" 
                  class="btn-primary">
            Guardar Cotización
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

    <!-- Modal de descarga -->
    <div v-if="mostrarDialogoDescarga" 
         class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-xl p-6 max-w-md w-full text-center">
        <div class="mb-4">
          <svg class="mx-auto h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">¡Cotización guardada!</h3>
        <p class="text-gray-600 mb-6">¿Deseas descargar la cotización en PDF?</p>
        <div class="flex justify-center gap-4">
          <button @click="handleDescargarPDF" 
                  class="btn-primary flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar PDF
          </button>
          <button @click="finalizarCreacion" 
                  class="btn-secondary">
            No, gracias
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
import useCotizaciones from '~/composables/useCotizaciones'
import type { Item } from '~/types/cotizacion'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'

const router = useRouter()
const { cotizacionActual, guardarCotizacion } = useCotizaciones()
const previsualizar = ref(false)
const mostrarDialogoDescarga = ref(false)

const cotizacion = ref({
  ...cotizacionActual.value,
  fecha: new Date()
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

const formatPrice = (price: number) => {
  return price.toLocaleString('es-ES', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
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
    const cotizacionGuardada = await guardarCotizacion(cotizacion.value)
    
    // Actualizar la cotización con el número asignado
    cotizacion.value = cotizacionGuardada

    toast.success('¡Cotización creada exitosamente!', {
      autoClose: 3000,
      theme: 'colored'
    })

    // Mostrar diálogo de descarga
    mostrarDialogoDescarga.value = true
  } catch (error) {
    toast.error('Error al guardar la cotización')
  }
}

const handleDescargarPDF = async () => {
  try {
    // Mostrar previsualización temporalmente para generar PDF
    previsualizar.value = true
    await nextTick()
    await generarPDF(cotizacion.value)
    previsualizar.value = false
    finalizarCreacion()
  } catch (error) {
    toast.error('Error al generar el PDF')
  }
}

const finalizarCreacion = () => {
  mostrarDialogoDescarga.value = false
  router.push('/dashboard')
}

const generarPDF = async (cotizacion) => {
  try {
    // Asegurarnos que la previsualización esté visible
    previsualizar.value = true
    await nextTick()

    // Capturar el contenido de la previsualización
    const element = document.querySelector('.cotizacion-preview')
    if (!element) return

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`Cotizacion-${cotizacion.numero}.pdf`)

    // Ocultar la previsualización
    previsualizar.value = false
  } catch (error) {
    console.error('Error al generar PDF:', error)
    toast.error('Error al generar el PDF')
  }
}
</script> 