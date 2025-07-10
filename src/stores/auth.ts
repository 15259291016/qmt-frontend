import { authAPI } from '@/api/auth'
import { permissionAPI } from '@/api/permission'
import { userAPI } from '@/api/user'
import type { LoginRequest, Permission, RegisterRequest, Role, SubscribeRequest, User } from '@/config/api'
import { API_CONFIG } from '@/config/api'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const permissions = ref<Permission[]>([])
  const roles = ref<Role[]>([])
  const subscription = ref<{ expire_at: string } | null>(null)
  const loading = ref(false)

  // 计算属性
  const isLoggedIn = computed(() => !!user.value)
  const hasPermission = computed(() => (permission: string) => {
    return permissions.value.some(p => p.name === permission)
  })
  const hasRole = computed(() => (role: string) => {
    return roles.value.some(r => r.name === role)
  })
  const isSubscriptionValid = computed(() => {
    if (!user.value?.subscription_expire_at) return false
    return new Date(user.value.subscription_expire_at) > new Date()
  })

  // 动作
  const login = async (credentials: LoginRequest) => {
    loading.value = true
    try {
      const response = await authAPI.login(credentials)
      const { access_token, refresh_token, user: userData } = response.data
      
      // 保存token
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, access_token)
      localStorage.setItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY, refresh_token)
      
      // 保存用户信息
      user.value = userData
      
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const register = async (userData: RegisterRequest) => {
    loading.value = true
    try {
      const response = await authAPI.register(userData)
      return response
    } catch (error) {
      throw error
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    try {
      await authAPI.logout()
    } catch (error) {
      console.error('登出失败:', error)
    } finally {
      // 清除本地数据
      localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
      localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY)
      user.value = null
      permissions.value = []
      roles.value = []
      subscription.value = null
    }
  }

  const getProfile = async () => {
    try {
      const response = await authAPI.getProfile()
      user.value = response.data
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getUserPermissions = async (userId: string) => {
    try {
      const response = await permissionAPI.getUserPermissions(userId)
      permissions.value = response.data
      return response.data
    } catch (error) {
      throw error
    }
  }

  const getUserRoles = async (userId: string) => {
    try {
      const response = await permissionAPI.getUserRoles(userId)
      roles.value = response.data
      return response.data
    } catch (error) {
      throw error
    }
  }

  const subscribe = async (data: SubscribeRequest) => {
    try {
      const response = await userAPI.subscribe(data)
      subscription.value = response.data
      // 更新用户信息中的订阅到期时间
      if (user.value) {
        user.value.subscription_expire_at = response.data.expire_at
      }
      return response.data
    } catch (error) {
      throw error
    }
  }

  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken()
      const { access_token, refresh_token } = response.data
      
      // 更新token
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, access_token)
      localStorage.setItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY, refresh_token)
      
      return response.data
    } catch (error) {
      throw error
    }
  }

  // 初始化用户信息
  const initUser = async () => {
    const token = localStorage.getItem(API_CONFIG.AUTH.TOKEN_KEY)
    if (token && !user.value) {
      try {
        await getProfile()
        const currentUser = user.value
        if (currentUser?.id) {
          await getUserPermissions(currentUser.id)
          await getUserRoles(currentUser.id)
        }
      } catch (error) {
        console.error('初始化用户信息失败:', error)
        // 清除无效token
        localStorage.removeItem(API_CONFIG.AUTH.TOKEN_KEY)
        localStorage.removeItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY)
      }
    }
  }

  return {
    // 状态
    user,
    permissions,
    roles,
    subscription,
    loading,
    
    // 计算属性
    isLoggedIn,
    hasPermission,
    hasRole,
    isSubscriptionValid,
    
    // 动作
    login,
    register,
    logout,
    getProfile,
    getUserPermissions,
    getUserRoles,
    subscribe,
    refreshToken,
    initUser
  }
}) 