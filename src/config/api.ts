// API配置文件
export const API_CONFIG = {
  // API基础URL
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8888',
  
  // 请求超时时间
  TIMEOUT: 10000,
  
  // 认证相关
  AUTH: {
    TOKEN_KEY: 'access_token',
    REFRESH_TOKEN_KEY: 'refresh_token',
    TOKEN_HEADER: 'Authorization',
    TOKEN_PREFIX: 'Bearer'
  }
}

// API端点
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    PROFILE: '/api/auth/profile'
  },
  
  // 用户相关
  USER: {
    SUBSCRIBE: '/api/user/subscribe'
  },
  
  // 权限相关
  PERMISSION: {
    ROLES: '/api/roles',
    PERMISSIONS: '/api/permissions',
    USER_ROLES: (userId: string) => `/api/users/${userId}/roles`,
    USER_PERMISSIONS: (userId: string) => `/api/users/${userId}/permissions`
  },
  
  // 超级管理员相关
  SUPER_ADMIN: {
    LIST: '/api/super-admin',
    SET: '/api/super-admin',
    REMOVE: (userId: string) => `/api/super-admin/${userId}`
  },
  
  // 业务相关
  BUSINESS: {
    DATA: '/api/data',
    SYSTEM: '/api/system',
    USERS: '/api/users',
    ADMIN: '/api/admin',
    MIXED_PERMISSIONS: '/api/mixed-permissions'
  }
}

// 响应状态码
export const STATUS_CODES = {
  SUCCESS: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500
} as const

// 错误消息
export const ERROR_MESSAGES = {
  UNAUTHORIZED: '未授权访问',
  FORBIDDEN: '权限不足',
  NOT_FOUND: '资源不存在',
  INTERNAL_ERROR: '服务器内部错误',
  VALIDATION_ERROR: '数据验证失败',
  TOKEN_EXPIRED: '令牌已过期',
  INVALID_TOKEN: '无效的令牌',
  SUBSCRIPTION_EXPIRED: '订阅已过期',
  INSUFFICIENT_PERMISSIONS: '权限不足'
} as const

// API响应类型
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

// 用户信息类型
export interface User {
  id: string
  username: string
  email: string
  full_name?: string
  is_active?: boolean
  is_admin?: boolean
  is_super_admin?: boolean
  subscription_expire_at?: string
  created_at?: string
  updated_at?: string
  last_login?: string
}

// 角色类型
export interface Role {
  id: string
  name: string
  description: string
  created_at?: string
  updated_at?: string
}

// 权限类型
export interface Permission {
  id: string
  name: string
  description: string
  created_at?: string
  updated_at?: string
}

// 订阅信息类型
export interface Subscription {
  expire_at: string
  months: number
}

// 登录请求类型
export interface LoginRequest {
  username: string
  password: string
}

// 注册请求类型
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

// 订阅请求类型
export interface SubscribeRequest {
  months: number
}

// 超级管理员相关类型
export interface SuperAdminUser {
  id: string
  username: string
  email: string
  full_name?: string
  is_active: boolean
  is_admin: boolean
  is_super_admin: boolean
  created_at: string
  last_login?: string
}

// 超级管理员操作请求类型
export interface SetSuperAdminRequest {
  user_id: string
} 