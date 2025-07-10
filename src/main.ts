import './assets/main.css'

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import permission from './directives/permission'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

app.directive('permission', permission)

// 初始化用户信息
const authStore = useAuthStore()
authStore.initUser()

app.mount('#app')
