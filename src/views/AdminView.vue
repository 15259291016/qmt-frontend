<template>
  <div class="admin-container">
    <header class="header">
      <h1>管理员面板</h1>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </header>
    
    <main class="main">
      <div class="admin-card">
        <h2>系统信息</h2>
        <p>欢迎管理员 {{ authStore.user?.username }}</p>
        <p>您拥有管理员权限，可以访问所有功能</p>
      </div>
      
      <div class="admin-card">
        <h2>用户管理</h2>
        <p>这里可以管理用户信息、权限分配等</p>
        <button @click="handleUserManagement">用户管理</button>
      </div>
      
      <div class="admin-card">
        <h2>系统设置</h2>
        <p>这里可以配置系统参数、权限设置等</p>
        <button @click="handleSystemSettings">系统设置</button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const handleUserManagement = () => {
  alert('用户管理功能开发中...')
}

const handleSystemSettings = () => {
  alert('系统设置功能开发中...')
}
</script>

<style scoped>
.admin-container {
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

.admin-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.admin-card h2 {
  color: #333;
  border-bottom: 2px solid #007bff;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.admin-card p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

.admin-card button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.admin-card button:hover {
  background-color: #0056b3;
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
  
  .admin-card {
    padding: 1.5rem;
    margin-bottom: 1rem;
  }
  
  .admin-card h2 {
    font-size: 1.1rem;
  }
  
  .admin-card button {
    width: 100%;
    padding: 0.75rem;
    font-size: 16px;
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
  
  .admin-card {
    padding: 1rem;
  }
}
</style> 