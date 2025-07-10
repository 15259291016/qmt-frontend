<template>
  <div class="login-container">
    <div class="login-form">
      <h2>用户登录</h2>
      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>用户名/邮箱</label>
          <input 
            v-model="form.username" 
            type="text" 
            required 
            placeholder="请输入用户名或邮箱"
            :disabled="authStore.loading"
          >
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="请输入密码"
            :disabled="authStore.loading"
          >
        </div>
        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? '登录中...' : '登录' }}
        </button>
      </form>
      <div class="links">
        <router-link to="/register">注册账号</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  username: '',
  password: ''
})

const handleLogin = async () => {
  try {
    // 登录
    await authStore.login(form)
    
    // 登录成功后初始化用户信息
    await authStore.initUser()
    
    // 跳转到首页
    router.push('/')
  } catch (error: any) {
    // 更友好的错误提示
    let errorMessage = '登录失败'
    
    if (error.message) {
      if (error.message.includes('用户名或密码错误')) {
        errorMessage = '用户名或密码错误，请检查后重试'
      } else if (error.message.includes('登录已失效')) {
        errorMessage = '登录已失效，请重新登录'
      } else if (error.message.includes('网络')) {
        errorMessage = '网络连接失败，请检查网络后重试'
      } else {
        errorMessage = error.message
      }
    }
    
    alert(errorMessage)
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
}

.login-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.login-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.25);
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #0056b3;
}

button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.links {
  margin-top: 1rem;
  text-align: center;
}

.links a {
  color: #007bff;
  text-decoration: none;
  font-weight: 500;
}

.links a:hover {
  text-decoration: underline;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .login-container {
    padding: 0.5rem;
  }
  
  .login-form {
    padding: 1.5rem;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .login-form h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .form-group input {
    padding: 1rem;
    font-size: 16px; /* 防止iOS缩放 */
  }
  
  button {
    padding: 1rem;
    font-size: 16px;
    margin-top: 1rem;
  }
}

@media (max-width: 480px) {
  .login-form {
    padding: 1rem;
  }
  
  .login-form h2 {
    font-size: 1.25rem;
  }
}
</style> 