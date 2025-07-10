<template>
  <div class="profile-container">
    <header class="header">
      <h1>个人中心</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">返回首页</router-link>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </nav>
    </header>
    
    <main class="main">
      <div class="profile-content">
        <!-- 用户基本信息 -->
        <div class="user-info-card">
          <h2>基本信息</h2>
          <div class="info-grid">
            <div class="info-item">
              <label>用户名：</label>
              <span>{{ authStore.user?.username || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>邮箱：</label>
              <span>{{ authStore.user?.email || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>用户ID：</label>
              <span>{{ authStore.user?.id || '未设置' }}</span>
            </div>
            <div class="info-item">
              <label>注册时间：</label>
              <span>{{ formatDate(authStore.user?.created_at) }}</span>
            </div>
            <div class="info-item">
              <label>更新时间：</label>
              <span>{{ formatDate(authStore.user?.updated_at) }}</span>
            </div>
          </div>
        </div>

        <!-- 订阅信息 -->
        <div class="subscription-card">
          <h2>订阅信息</h2>
          <div class="subscription-content">
            <div class="subscription-status">
              <span class="status-label">当前状态：</span>
              <span :class="['status-value', subscriptionStatusClass]">
                {{ subscriptionStatus }}
              </span>
            </div>
            <div class="subscription-expire">
              <span class="expire-label">到期时间：</span>
              <span class="expire-value">
                {{ formatDate(authStore.user?.subscription_expire_at) }}
              </span>
            </div>
            <div class="subscription-actions">
              <router-link to="/subscribe" class="subscribe-btn">
                {{ authStore.isSubscriptionValid ? '续费订阅' : '立即订阅' }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- 权限信息 -->
        <div class="permissions-card">
          <h2>权限信息</h2>
          <div class="permissions-content">
            <div class="roles-section">
              <h3>用户角色</h3>
              <div class="roles-list">
                <div v-if="authStore.roles.length > 0" class="role-items">
                  <span v-for="role in authStore.roles" :key="role.id" class="role-tag">
                    {{ role.name }}
                  </span>
                </div>
                <p v-else class="no-data">暂无角色</p>
              </div>
            </div>
            
            <div class="permissions-section">
              <h3>用户权限</h3>
              <div class="permissions-list">
                <div v-if="authStore.permissions.length > 0" class="permission-items">
                  <div v-for="permission in authStore.permissions" :key="permission.id" class="permission-item">
                    <span class="permission-name">{{ permission.name }}</span>
                    <span class="permission-desc">{{ permission.description }}</span>
                  </div>
                </div>
                <p v-else class="no-data">暂无权限</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 账户操作 -->
        <div class="actions-card">
          <h2>账户操作</h2>
          <div class="action-buttons">
            <button @click="refreshUserInfo" :disabled="loading" class="refresh-btn">
              {{ loading ? '刷新中...' : '刷新信息' }}
            </button>
            <router-link to="/permissions" class="permissions-btn">
              权限管理
            </router-link>
            <button @click="handleLogout" class="logout-action-btn">
              退出登录
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)

// 计算属性
const subscriptionStatus = computed(() => {
  if (authStore.isSubscriptionValid) {
    return '有效'
  } else {
    return '已过期'
  }
})

const subscriptionStatusClass = computed(() => {
  return authStore.isSubscriptionValid ? 'status-valid' : 'status-expired'
})

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未设置'
  try {
    return new Date(dateString).toLocaleString('zh-CN')
  } catch {
    return '无效日期'
  }
}

// 刷新用户信息
const refreshUserInfo = async () => {
  loading.value = true
  try {
    await authStore.getProfile()
    if (authStore.user?.id) {
      await Promise.all([
        authStore.getUserPermissions(authStore.user.id),
        authStore.getUserRoles(authStore.user.id)
      ])
    }
    alert('信息刷新成功')
  } catch (error: any) {
    alert('刷新失败：' + (error.message || '未知错误'))
  } finally {
    loading.value = false
  }
}

// 退出登录
const handleLogout = async () => {
  if (confirm('确定要退出登录吗？')) {
    await authStore.logout()
    router.push('/login')
  }
}
</script>

<style scoped>
.profile-container {
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

.nav {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.logout-btn {
  background-color: #dc3545;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background-color: #c82333;
}

.main {
  padding: 2rem;
}

.profile-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  gap: 2rem;
}

.user-info-card,
.subscription-card,
.permissions-card,
.actions-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.user-info-card h2,
.subscription-card h2,
.permissions-card h2,
.actions-card h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.info-item label {
  font-weight: 600;
  color: #555;
}

.subscription-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.subscription-status {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.status-label,
.expire-label {
  font-weight: 600;
  color: #555;
}

.status-value.status-valid {
  color: #28a745;
  font-weight: 600;
}

.status-value.status-expired {
  color: #dc3545;
  font-weight: 600;
}

.subscribe-btn {
  background-color: #007bff;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  display: inline-block;
  transition: background-color 0.3s;
  text-align: center;
  max-width: 200px;
}

.subscribe-btn:hover {
  background-color: #0056b3;
}

.permissions-content {
  display: grid;
  gap: 2rem;
}

.roles-section h3,
.permissions-section h3 {
  margin-bottom: 1rem;
  color: #555;
}

.role-items {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.role-tag {
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
}

.permission-items {
  display: grid;
  gap: 0.75rem;
}

.permission-item {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.permission-name {
  font-weight: 600;
  color: #333;
  display: block;
  margin-bottom: 0.25rem;
}

.permission-desc {
  color: #666;
  font-size: 0.875rem;
}

.no-data {
  color: #6c757d;
  font-style: italic;
  text-align: center;
  padding: 2rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.refresh-btn,
.logout-action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 1rem;
}

.refresh-btn {
  background-color: #28a745;
  color: white;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #218838;
}

.refresh-btn:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.permissions-btn {
  background-color: #17a2b8;
  color: white;
  text-decoration: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  transition: background-color 0.3s;
  display: inline-block;
  text-align: center;
}

.permissions-btn:hover {
  background-color: #138496;
}

.logout-action-btn {
  background-color: #dc3545;
  color: white;
}

.logout-action-btn:hover {
  background-color: #c82333;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .header {
    padding: 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .info-item {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .action-buttons {
    flex-direction: column;
  }
  
  .subscription-content {
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .user-info-card,
  .subscription-card,
  .permissions-card,
  .actions-card {
    padding: 1rem;
  }
  
  .header h1 {
    font-size: 1.25rem;
  }
}
</style> 