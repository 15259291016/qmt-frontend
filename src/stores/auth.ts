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
      
      // 保存token到localStorage
      localStorage.setItem(API_CONFIG.AUTH.TOKEN_KEY, access_token)
      localStorage.setItem(API_CONFIG.AUTH.REFRESH_TOKEN_KEY, refresh_token)
      
      // 保存用户信息到store
      user.value = userData
      
      // 确保token已写入，等待一下再返回
      await new Promise(resolve => setTimeout(resolve, 100))
      
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
    } catch (error: any) {
      // 如果是401错误，说明token无效，自动登出
      if (error.response?.status === 401 || error.message?.includes('令牌无效')) {
        console.warn('Token无效，自动登出')
        await logout()
        throw new Error('登录已失效，请重新登录')
      }
      throw error
    }
  }

  const getUserPermissions = async (userId: string) => {
    try {
      const response = await permissionAPI.getUserPermissions(userId)
      permissions.value = response.data
      return response.data
    } catch (error) {
      console.warn('获取用户权限失败:', error)
      // 权限获取失败不影响登录流程
      return []
    }
  }

  const getUserRoles = async (userId: string) => {
    try {
      const response = await permissionAPI.getUserRoles(userId)
      roles.value = response.data
      return response.data
    } catch (error) {
      console.warn('获取用户角色失败:', error)
      // 角色获取失败不影响登录流程
      return []
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
    if (!token) {
      throw new Error('未找到登录令牌')
    }

    try {
      // 先获取用户基本信息
      await getProfile()
      
      // 如果获取用户信息成功，再获取权限和角色（可选）
      const currentUser = user.value
      if (currentUser?.id) {
        // 并行获取权限和角色，不阻塞登录流程
        Promise.all([
          getUserPermissions(currentUser.id),
          getUserRoles(currentUser.id)
        ]).catch(error => {
          console.warn('获取用户权限或角色失败:', error)
        })
      }
    } catch (error: any) {
      console.error('初始化用户信息失败:', error)
      // 清除无效token
      await logout()
      throw error
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