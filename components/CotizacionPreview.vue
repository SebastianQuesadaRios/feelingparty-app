<template>
  <div class="bg-white p-8 rounded-lg shadow-lg max-w-4xl mx-auto">
    <!-- Encabezado -->
    <div class="flex justify-between items-start mb-8">
      <div>
        <img src="/images/logo.jpg" alt="Feeling Party" class="h-16 mb-4">
        <div class="text-gray-600">
          <p>Feeling Party</p>
          <p>Decoración y Eventos</p>
        </div>
      </div>
      <div class="text-right">
        <h1 class="text-2xl font-bold text-purple-600 mb-2">COTIZACIÓN</h1>
        <p class="text-gray-600">N° {{ formatNumero(cotizacion.numero) }}</p>
        <p class="text-gray-600">{{ formatDate(cotizacion.fecha) }}</p>
      </div>
    </div>

    <!-- Información del cliente -->
    <div class="mb-8 p-4 bg-gray-50 rounded-lg">
      <h2 class="font-semibold text-gray-700 mb-2">Cliente</h2>
      <p class="text-gray-600">{{ cotizacion.cliente.nombre }}</p>
      <p v-if="cotizacion.cliente.empresa" class="text-gray-600">{{ cotizacion.cliente.empresa }}</p>
      <p v-if="cotizacion.cliente.direccion" class="text-gray-600">{{ cotizacion.cliente.direccion }}</p>
    </div>

    <!-- Items -->
    <div class="mb-8">
      <table class="w-full">
        <thead>
          <tr class="border-b-2 border-gray-200">
            <th class="text-left py-2 text-gray-600">Descripción</th>
            <th class="text-right py-2 text-gray-600">Precio</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in cotizacion.items" :key="index" class="border-b border-gray-100">
            <td class="py-3 text-gray-700">{{ item.descripcion }}</td>
            <td class="py-3 text-right text-gray-700">${{ formatPrice(item.precio) }}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Totales -->
    <div class="flex justify-end mb-12">
      <div class="w-64">
        <div class="flex justify-between py-2">
          <span class="font-semibold text-gray-600">Total:</span>
          <span class="text-gray-700">${{ formatPrice(cotizacion.total) }}</span>
        </div>
      </div>
    </div>

    <!-- Términos y Condiciones -->
    <div class="border-t border-gray-200 pt-6 mb-8">
      <h3 class="text-lg font-semibold text-gray-900 mb-4">Nota Importante:</h3>
      <div class="space-y-4 text-gray-600 text-sm">
        <p>
          Para iniciar el proceso de elaboración/diseño, se requiere un anticipo 
          del 70% del valor total de la cotización. El pago del 30% de saldo 
          debe ser efectuado un día antes de la entrega del producto o la 
          finalización del servicio.
        </p>
        <p>
          Los pagos pueden realizarse a través de la cuenta Bancolombia de 
          ahorros # 716-258152-01
        </p>
        <p>Quedamos atentos a cualquier pregunta.</p>
        <div class="pt-4">
          <p>Atentamente,</p>
          <p class="font-medium text-gray-900">Maria del Rosario Rios Guerrero</p>
        </div>
      </div>
    </div>

    <!-- Redes Sociales -->
    <div class="border-t pt-6">
      <div class="flex justify-center items-center gap-8 text-gray-600">
        <!-- Instagram -->
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
          </svg>
          <span class="font-medium">feelingparty</span>
        </div>

        <!-- WhatsApp -->
        <div class="flex items-center gap-2">
          <svg class="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="currentColor">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span class="font-medium">319 702 4263</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Cotizacion } from '~/types/cotizacion'

const props = defineProps<{
  cotizacion: Cotizacion
}>()

const formatNumero = (numero?: number) => {
  if (!numero) return 'PENDIENTE'
  return numero.toString().padStart(4, '0') // Formatea como 0001, 0002, etc.
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
.border-t {
  @apply border-gray-200;
}
</style> 