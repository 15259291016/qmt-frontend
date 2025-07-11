<template>
  <div class="super-admin-container">
    <header class="header">
      <h1>超级管理员管理</h1>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </header>
    
    <main class="main">
      <!-- 权限检查 -->
      <div v-if="!isSuperAdmin" class="permission-warning">
        <h2>权限不足</h2>
        <p>只有超级管理员可以访问此页面</p>
        <router-link to="/" class="btn">返回首页</router-link>
      </div>
      
      <!-- 超级管理员管理界面 -->
      <div v-else>
        <!-- 当前用户信息 -->
        <div class="current-user-card">
          <h2>当前用户信息</h2>
          <div class="user-info">
            <p><strong>用户名:</strong> {{ authStore.user?.username }}</p>
            <p><strong>邮箱:</strong> {{ authStore.user?.email }}</p>
            <p><strong>角色:</strong> 
              <span v-if="authStore.user?.is_super_admin" class="badge super-admin">超级管理员</span>
              <span v-else-if="authStore.user?.is_admin" class="badge admin">管理员</span>
              <span v-else class="badge user">普通用户</span>
            </p>
          </div>
        </div>
        
        <!-- 超级管理员列表 -->
        <div class="super-admin-card">
          <h2>超级管理员列表</h2>
          <div class="actions">
            <button @click="refreshSuperAdmins" class="btn btn-primary">刷新列表</button>
          </div>
          
          <div v-if="loading" class="loading">
            加载中...
          </div>
          
          <div v-else-if="superAdmins.length === 0" class="empty-state">
            <p>暂无超级管理员</p>
          </div>
          
          <div v-else class="super-admin-list">
            <div v-for="admin in superAdmins" :key="admin.id" class="admin-item">
              <div class="admin-info">
                <h3>{{ admin.username }}</h3>
                <p><strong>邮箱:</strong> {{ admin.email }}</p>
                <p><strong>全名:</strong> {{ admin.full_name || '未设置' }}</p>
                <p><strong>状态:</strong> 
                  <span :class="['status', admin.is_active ? 'active' : 'inactive']">
                    {{ admin.is_active ? '激活' : '未激活' }}
                  </span>
                </p>
                <p><strong>创建时间:</strong> {{ formatDate(admin.created_at) }}</p>
                <p><strong>最后登录:</strong> {{ formatDate(admin.last_login) }}</p>
              </div>
              
              <div class="admin-actions">
                <button 
                  v-if="admin.id !== authStore.user?.id" 
                  @click="removeSuperAdmin(admin)" 
                  class="btn btn-danger"
                >
                  取消超级管理员权限
                </button>
                <span v-else class="self-note">当前用户</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 设置超级管理员 -->
        <div class="set-super-admin-card">
          <h2>设置超级管理员</h2>
          <div class="form-group">
            <label>选择用户:</label>
            <select v-model="selectedUserId" class="form-control">
              <option value="">请选择用户</option>
              <option v-for="user in availableUsers" :key="user.id" :value="user.id">
                {{ user.username }} ({{ user.email }})
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button 
              @click="setSuperAdmin" 
              :disabled="!selectedUserId || settingSuperAdmin"
              class="btn btn-primary"
            >
              {{ settingSuperAdmin ? '设置中...' : '设置为超级管理员' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { superAdminAPI } from '@/api/super-admin'
import { userAPI } from '@/api/user'
import type { SuperAdminUser, User } from '@/config/api'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref } from 'vue'

const authStore = useAuthStore()

// 响应式数据
const superAdmins = ref<SuperAdminUser[]>([])
const availableUsers = ref<User[]>([])
const selectedUserId = ref('')
const loading = ref(false)
const settingSuperAdmin = ref(false)

// 计算属性
const isSuperAdmin = computed(() => authStore.user?.is_super_admin)

// 方法
const formatDate = (dateString?: string) => {
  if (!dateString) return '未登录'
  return new Date(dateString).toLocaleString('zh-CN')
}

const refreshSuperAdmins = async () => {
  try {
    loading.value = true
    const response = await superAdminAPI.list()
    if (response.data.code === 200) {
      superAdmins.value = response.data.data.super_admins
    }
  } catch (error) {
    console.error('获取超级管理员列表失败:', error)
    alert('获取超级管理员列表失败')
  } finally {
    loading.value = false
  }
}

const loadAvailableUsers = async () => {
  try {
    const response = await userAPI.list({ limit: 100 })
    if (response.data.code === 200) {
      // 过滤掉已经是超级管理员的用户
      availableUsers.value = response.data.data.users.filter(
        (user: User) => !user.is_super_admin
      )
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

const setSuperAdmin = async () => {
  if (!selectedUserId.value) return
  
  try {
    settingSuperAdmin.value = true
    const response = await superAdminAPI.setSuperAdmin({ user_id: selectedUserId.value })
    
    if (response.data.code === 200) {
      alert('设置超级管理员成功')
      selectedUserId.value = ''
      await refreshSuperAdmins()
      await loadAvailableUsers()
    } else {
      alert(response.data.msg || '设置失败')
    }
  } catch (error) {
    console.error('设置超级管理员失败:', error)
    alert('设置超级管理员失败')
  } finally {
    settingSuperAdmin.value = false
  }
}

const removeSuperAdmin = async (admin: SuperAdminUser) => {
  if (!confirm(`确定要取消用户 ${admin.username} 的超级管理员权限吗？`)) {
    return
  }
  
  try {
    const response = await superAdminAPI.removeSuperAdmin(admin.id)
    
    if (response.data.code === 200) {
      alert('取消超级管理员权限成功')
      await refreshSuperAdmins()
      await loadAvailableUsers()
    } else {
      alert(response.data.msg || '操作失败')
    }
  } catch (error) {
    console.error('取消超级管理员权限失败:', error)
    alert('取消超级管理员权限失败')
  }
}

// 生命周期
onMounted(async () => {
  if (isSuperAdmin.value) {
    await Promise.all([
      refreshSuperAdmins(),
      loadAvailableUsers()
    ])
  }
})
</script>

<style scoped>
.super-admin-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.header {
  background-color: #343a40;
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.header h1 {
  margin: 0;
  font-size: 1.5rem;
}

.back-btn {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  background-color: #6c757d;
  transition: background-color 0.3s;
}

.back-btn:hover {
  background-color: #5a6268;
}

.main {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.permission-warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  margin-bottom: 2rem;
}

.permission-warning h2 {
  color: #856404;
  margin-bottom: 1rem;
}

.current-user-card,
.super-admin-card,
.set-super-admin-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.current-user-card h2,
.super-admin-card h2,
.set-super-admin-card h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.user-info p {
  margin-bottom: 0.5rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: bold;
}

.badge.super-admin {
  background-color: #dc3545;
  color: white;
}

.badge.admin {
  background-color: #fd7e14;
  color: white;
}

.badge.user {
  background-color: #6c757d;
  color: white;
}

.actions {
  margin-bottom: 1rem;
}

.loading,
.empty-state {
  text-align: center;
  padding: 2rem;
  color: #6c757d;
}

.super-admin-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-item {
  border: 1px solid #dee2e6;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.admin-info h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.admin-info p {
  margin-bottom: 0.5rem;
}

.status {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.status.active {
  background-color: #d4edda;
  color: #155724;
}

.status.inactive {
  background-color: #f8d7da;
  color: #721c24;
}

.admin-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.self-note {
  color: #6c757d;
  font-style: italic;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-control {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ced4da;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  margin-top: 1rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .header h1 {
    font-size: 1.25rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .current-user-card,
  .super-admin-card,
  .set-super-admin-card {
    padding: 1.5rem;
  }
  
  .admin-item {
    flex-direction: column;
    align-items: stretch;
  }
  
  .admin-actions {
    margin-top: 1rem;
  }
  
  .btn {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }
  
  .header h1 {
    font-size: 1.1rem;
  }
  
  .main {
    padding: 0.75rem;
  }
  
  .current-user-card,
  .super-admin-card,
  .set-super-admin-card {
    padding: 1rem;
  }
}
</style> 