import { ref, onMounted } from 'vue'
import { 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User,
  type Auth
} from 'firebase/auth'

export default function useAuth() {
  const { $auth } = useNuxtApp()
  const auth = $auth as Auth
  const user = ref<User | null>(null)
  const loading = ref(true)
  const error = ref<string | null>(null)

  // Inicializar el estado de autenticación
  if (process.client) {
    onMounted(() => {
      const unsubscribe = onAuthStateChanged(auth, (newUser) => {
        user.value = newUser
        loading.value = false
      })

      // Limpiar el listener cuando el componente se desmonte
      return () => unsubscribe()
    })
  }

  // Iniciar sesión
  const login = async (email: string, password: string) => {
    try {
      loading.value = true
      error.value = null
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  // Cerrar sesión
  const logout = async () => {
    try {
      loading.value = true
      await signOut(auth)
    } catch (e: any) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    user,
    loading,
    error,
    login,
    logout
  }
} 