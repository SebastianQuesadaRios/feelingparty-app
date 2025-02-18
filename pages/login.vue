<template>
  <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
    <FloatingBalloons />
    
    <div class="max-w-md w-full space-y-8 p-8 bg-white rounded-2xl shadow-xl relative z-10">
      <div class="text-center">
        <img src="/images/logo.jpg" alt="Feeling Party" class="h-20 mx-auto mb-4">
        <h2 class="text-3xl font-bold text-gray-900 mb-2">Bienvenido</h2>
        <p class="text-gray-600">Ingresa a tu cuenta para continuar</p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-700">Correo electrónico</label>
            <input 
              id="email" 
              v-model="email" 
              type="email" 
              required 
              class="input-primary"
              placeholder="tucorreo@ejemplo.com"
            >
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-700">Contraseña</label>
            <input 
              id="password" 
              v-model="password" 
              type="password" 
              required 
              class="input-primary"
              placeholder="••••••••"
            >
          </div>
        </div>

        <div>
          <button type="submit" class="btn-primary w-full">
            Iniciar sesión
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watchEffect } from 'vue'
import useAuth from '~/composables/useAuth'
import { useRouter } from 'vue-router'
import { toast } from 'vue3-toastify'
// El componente FloatingBalloons se importará automáticamente por Nuxt

const { login, error, user } = useAuth()
const email = ref('')
const password = ref('')
const router = useRouter()

// Si ya hay usuario, redirigir al dashboard
watchEffect(() => {
  if (user.value) {
    router.push('/dashboard')
  }
})

const handleLogin = async () => {
  try {
    await login(email.value, password.value)
    toast.success('¡Bienvenido!')
    router.push('/dashboard')
  } catch (e) {
    console.error('Error al iniciar sesión:', e)
    toast.error('Error al iniciar sesión')
  }
}
</script> 