import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { firebaseConfig } from '~/config/firebase'

export default defineNuxtPlugin(() => {
  const app = initializeApp(firebaseConfig)
  const auth = getAuth(app)

  return {
    provide: {
      firebase: app,
      auth: auth
    }
  }
}) 