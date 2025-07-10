<template>
  <div class="permissions-container">
    <header class="header">
      <h1>权限管理</h1>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </header>
    
    <main class="main">
      <div class="permissions-card">
        <h2>我的权限</h2>
        <div v-if="authStore.permissions.length > 0" class="permissions-list">
          <div v-for="permission in authStore.permissions" :key="permission.id" class="permission-item">
            <strong>{{ permission.name }}</strong>
            <span>{{ permission.description }}</span>
          </div>
        </div>
        <p v-else>暂无权限</p>
      </div>
      
      <div class="roles-card">
        <h2>我的角色</h2>
        <div v-if="authStore.roles.length > 0" class="roles-list">
          <div v-for="role in authStore.roles" :key="role.id" class="role-item">
            <strong>{{ role.name }}</strong>
            <span>{{ role.description }}</span>
          </div>
        </div>
        <p v-else>暂无角色</p>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
</script>

<style scoped>
.permissions-container {
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
  max-width: 800px;
  margin: 0 auto;
}

.permissions-card,
.roles-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.permissions-card h2,
.roles-card h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.permission-item,
.role-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  background-color: #f8f9fa;
}

.permission-item strong,
.role-item strong {
  color: #007bff;
  font-weight: bold;
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
  
  .back-btn {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
  }
  
  .main {
    padding: 1rem;
  }
  
  .permissions-card,
  .roles-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .permissions-card h2,
  .roles-card h2 {
    font-size: 1.1rem;
  }
  
  .permission-item,
  .role-item {
    padding: 0.75rem;
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .permission-item strong,
  .role-item strong {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  .header {
    padding: 0.75rem;
  }
  
  .header h1 {
    font-size: 1.1rem;
  }
  
  .back-btn {
    width: 100%;
    text-align: center;
    padding: 0.75rem;
  }
  
  .main {
    padding: 0.75rem;
  }
  
  .permissions-card,
  .roles-card {
    padding: 1rem;
  }
  
  .permission-item,
  .role-item {
    padding: 0.5rem;
  }
}
</style> 