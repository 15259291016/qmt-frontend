<template>
  <div class="register-container">
    <div class="register-form">
      <h2>用户注册</h2>
      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>用户名</label>
          <input 
            v-model="form.username" 
            type="text" 
            required 
            placeholder="请输入用户名"
          >
        </div>
        <div class="form-group">
          <label>邮箱</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="请输入邮箱"
          >
        </div>
        <div class="form-group">
          <label>密码</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="请输入密码"
          >
        </div>
        <div class="form-group">
          <label>确认密码</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            required 
            placeholder="请再次输入密码"
          >
        </div>
        <button type="submit" :disabled="authStore.loading">
          {{ authStore.loading ? '注册中...' : '注册' }}
        </button>
      </form>
      <div class="links">
        <router-link to="/login">已有账号？去登录</router-link>
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
  email: '',
  password: ''
})

const confirmPassword = ref('')

const handleRegister = async () => {
  if (form.password !== confirmPassword.value) {
    alert('两次输入的密码不一致')
    return
  }
  
  try {
    await authStore.register(form)
    alert('注册成功，请登录')
    router.push('/login')
  } catch (error: any) {
    alert(error.message || '注册失败')
  }
}
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
}

.register-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.register-form h2 {
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
  border-color: #28a745;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
}

button {
  width: 100%;
  padding: 0.75rem;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover:not(:disabled) {
  background-color: #218838;
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
  .register-container {
    padding: 0.5rem;
  }
  
  .register-form {
    padding: 1.5rem;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .register-form h2 {
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
  .register-form {
    padding: 1rem;
  }
  
  .register-form h2 {
    font-size: 1.25rem;
  }
}
</style> 