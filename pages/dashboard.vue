<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
    <!-- Navbar -->
    <nav class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <img src="/images/logo.jpg" alt="Feeling Party" class="h-8">
          </div>
          <div class="flex items-center">
            <button @click="handleLogout" 
                    class="text-gray-700 hover:text-red-600 transition-colors duration-300 flex items-center gap-2">
              <span>Cerrar sesión</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M3 3a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4a1 1 0 0 0-1-1H3zm11 4.414l-4.293 4.293a1 1 0 0 1-1.414-1.414L11.586 7H6a1 1 0 1 1 0-2h7a1 1 0 0 1 1 1v7a1 1 0 1 1-2 0V7.414z" clip-rule="evenodd"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <div class="px-4 py-6 sm:px-0">
        <h1 class="text-2xl font-semibold text-gray-900 mb-8">Panel de Control</h1>
        
        <!-- Grid de botones -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Crear Cotización -->
          <button @click="router.push('/cotizacion/crear')" 
                  class="dashboard-card group">
            <div class="card-icon bg-purple-100 text-purple-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/>
              </svg>
            </div>
            <h3 class="card-title">Crear Cotización</h3>
            <p class="card-description">Genera una nueva cotización para tus clientes</p>
          </button>

          <!-- Buscar Cotización -->
          <button @click="router.push('/cotizacion/buscar')"
                  class="dashboard-card group">
            <div class="card-icon bg-blue-100 text-blue-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
            <h3 class="card-title">Buscar y Editar Cotización</h3>
            <p class="card-description">Encuentra y gestiona cotizaciones existentes</p>
          </button>

          <!-- Eliminar Cotización -->
<button @click="router.push('/cotizacion/eliminar')"
                  class="dashboard-card group">
            <div class="card-icon bg-red-100 text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
              </svg>
            </div>
            <h3 class="card-title">Eliminar Cotización</h3>
            <p class="card-description">Elimina cotizaciones que ya no necesites</p>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import useAuth from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'

definePageMeta({
  middleware: ['auth']
})

const { logout } = useAuth()
const router = useRouter()

const handleLogout = async () => {
  try {
    await logout()
    toast.success('Sesión cerrada correctamente')
    router.push('/login')
  } catch (e) {
    console.error('Error al cerrar sesión:', e)
    toast.error('Error al cerrar sesión')
  }
}
</script>

<style scoped>
.dashboard-card {
  @apply p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300
         flex flex-col items-center text-center space-y-4 w-full
         border border-gray-100 hover:border-purple-200;
}

.card-icon {
  @apply p-4 rounded-full transition-transform duration-300
         group-hover:scale-110 group-hover:rotate-3;
}

.card-title {
  @apply text-lg font-semibold text-gray-900
         group-hover:text-purple-600 transition-colors duration-300;
}

.card-description {
  @apply text-sm text-gray-600 transition-colors duration-300
         group-hover:text-gray-900;
}
</style>
