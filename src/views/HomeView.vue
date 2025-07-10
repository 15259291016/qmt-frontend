<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const subscriptionStatus = computed(() => {
  if (authStore.isSubscriptionValid) {
    return '有效'
  } else {
    return '已过期'
  }
})

const formatDate = (dateString?: string) => {
  if (!dateString) return '未设置'
  return new Date(dateString).toLocaleString('zh-CN')
}

const handleLogout = async () => {
  await authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="home-container">
    <header class="header">
      <h1>QMT管理系统</h1>
      <nav class="nav">
        <router-link to="/" class="nav-link">首页</router-link>
        <router-link to="/profile" class="nav-link">个人中心</router-link>
        <router-link to="/permissions" class="nav-link">权限管理</router-link>
        <router-link v-if="authStore.hasRole('admin')" to="/admin" class="nav-link">管理员</router-link>
        <button @click="handleLogout" class="logout-btn">退出登录</button>
      </nav>
    </header>
    
    <main class="main">
      <div class="welcome-section">
        <h2>欢迎回来，{{ authStore.user?.username }}！</h2>
        <p>您的订阅状态：{{ subscriptionStatus }}</p>
      </div>
      
      <div class="dashboard">
        <div class="card">
          <h3>用户信息</h3>
          <p><strong>用户名：</strong>{{ authStore.user?.username }}</p>
          <p><strong>邮箱：</strong>{{ authStore.user?.email }}</p>
          <p><strong>订阅到期：</strong>{{ formatDate(authStore.user?.subscription_expire_at) }}</p>
        </div>
        
        <div class="card">
          <h3>角色信息</h3>
          <div v-if="authStore.roles.length > 0">
            <p v-for="role in authStore.roles" :key="role.id">
              <strong>{{ role.name }}：</strong>{{ role.description }}
            </p>
          </div>
          <p v-else>暂无角色</p>
        </div>
        
        <div class="card">
          <h3>权限信息</h3>
          <div v-if="authStore.permissions.length > 0">
            <p v-for="permission in authStore.permissions" :key="permission.id">
              <strong>{{ permission.name }}：</strong>{{ permission.description }}
            </p>
          </div>
          <p v-else>暂无权限</p>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.home-container {
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
  white-space: nowrap;
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

.welcome-section {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.welcome-section h2 {
  margin-top: 0;
  color: #333;
}

.dashboard {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.card {
  background-color: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-top: 0;
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
}

.card p {
  margin: 0.5rem 0;
  line-height: 1.6;
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
  
  .nav {
    width: 100%;
    justify-content: center;
    gap: 0.5rem;
  }
  
  .nav-link {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .logout-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .welcome-section {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .welcome-section h2 {
    font-size: 1.25rem;
  }
  
  .dashboard {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .card {
    padding: 1rem;
  }
  
  .card h3 {
    font-size: 1.1rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }
  
  .header h1 {
    font-size: 1.1rem;
  }
  
  .nav {
    flex-direction: column;
    width: 100%;
  }
  
  .nav-link {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }
  
  .logout-btn {
    width: 100%;
    padding: 0.75rem;
  }
  
  .main {
    padding: 0.75rem;
  }
  
  .welcome-section {
    padding: 1rem;
  }
  
  .card {
    padding: 0.75rem;
  }
}
</style>
