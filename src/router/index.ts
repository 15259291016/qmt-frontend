import { useAuthStore } from '@/stores/auth'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/LoginView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/register',
      name: 'Register', 
      component: () => import('@/views/RegisterView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/',
      name: 'Home',
      component: () => import('@/views/HomeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'Profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/subscribe',
      name: 'Subscribe',
      component: () => import('@/views/SubscribeView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/admin',
      name: 'Admin',
      component: () => import('@/views/AdminView.vue'),
      meta: { requiresAuth: true, requiresAdmin: true }
    },
    {
      path: '/permissions',
      name: 'Permissions',
      component: () => import('@/views/PermissionsView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/403',
      name: 'Forbidden',
      component: () => import('@/views/ForbiddenView.vue'),
      meta: { requiresAuth: false }
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'NotFound',
      component: () => import('@/views/NotFoundView.vue'),
      meta: { requiresAuth: false }
    }
  ]
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const token = localStorage.getItem('access_token')
  
  // 检查是否需要认证
  if (to.meta.requiresAuth) {
    if (!token) {
      // 没有token，跳转到登录页
      next('/login')
      return
    }
    
    // 有token但没有用户信息，获取用户信息
    if (!authStore.isLoggedIn) {
      try {
        await authStore.initUser()
      } catch (error) {
        // 获取用户信息失败，清除token并跳转登录
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        next('/login')
        return
      }
    }
    
    // 检查订阅状态
    if (!authStore.isSubscriptionValid) {
      // 订阅已过期，跳转到订阅页面
      next('/subscribe')
      return
    }
    
    // 检查管理员权限
    if (to.meta.requiresAdmin && !authStore.hasRole('admin')) {
      next('/403')
      return
    }
  }
  
  next()
})

export default router
