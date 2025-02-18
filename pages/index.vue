<script setup>
const router = useRouter()
onMounted(() => {
  router.push('/login')
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center">
    <p class="text-gray-600">Redirigiendo...</p>
  </div>
</template> 