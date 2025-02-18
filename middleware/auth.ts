import useAuth from '~/composables/useAuth'

export default defineNuxtRouteMiddleware((to) => {
  // No aplicar el middleware en la página de login
  if (to.path === '/login') return

  const { user, loading } = useAuth()
  
  // Si está cargando, esperar
  if (loading.value) return
  
  // Si no hay usuario, redirigir al login
  if (!user.value) {
    return navigateTo('/login')
  }
}) 