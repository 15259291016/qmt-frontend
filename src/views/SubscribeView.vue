<template>
  <div class="subscribe-container">
    <div class="subscribe-form">
      <h2>订阅续费</h2>
      <div class="warning">
        <p>您的订阅已过期，请续费以继续使用服务</p>
      </div>
      
      <form @submit.prevent="handleSubscribe">
        <div class="form-group">
          <label>选择订阅时长</label>
          <select v-model="selectedMonths" required>
            <option value="1">1个月 - ¥29</option>
            <option value="3">3个月 - ¥79</option>
            <option value="6">6个月 - ¥149</option>
            <option value="12">12个月 - ¥269</option>
          </select>
        </div>
        
        <div class="price-info">
          <p>选择时长：{{ selectedMonths }}个月</p>
          <p>价格：¥{{ getPrice(selectedMonths) }}</p>
        </div>
        
        <button type="submit" :disabled="loading">
          {{ loading ? '处理中...' : '立即续费' }}
        </button>
      </form>
      
      <div class="links">
        <router-link to="/">返回首页</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const selectedMonths = ref(1)
const loading = ref(false)

const getPrice = (months: number) => {
  const prices: Record<number, number> = {
    1: 29,
    3: 79,
    6: 149,
    12: 269
  }
  return prices[months] || 29
}

const handleSubscribe = async () => {
  loading.value = true
  try {
    await authStore.subscribe({ months: selectedMonths.value })
    alert('订阅成功！')
    router.push('/')
  } catch (error: any) {
    alert(error.message || '订阅失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.subscribe-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f5f5;
  padding: 1rem;
}

.subscribe-form {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

.subscribe-form h2 {
  text-align: center;
  margin-bottom: 1.5rem;
  color: #333;
}

.warning {
  background-color: #fff3cd;
  border: 1px solid #ffeaa7;
  color: #856404;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.warning p {
  margin: 0;
  font-weight: 500;
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

.form-group select {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group select:focus {
  outline: none;
  border-color: #28a745;
  box-shadow: 0 0 0 2px rgba(40, 167, 69, 0.25);
}

.price-info {
  background-color: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.price-info p {
  margin: 0.5rem 0;
  font-weight: 500;
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
  .subscribe-container {
    padding: 0.5rem;
  }
  
  .subscribe-form {
    padding: 1.5rem;
    margin: 0;
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .subscribe-form h2 {
    font-size: 1.5rem;
    margin-bottom: 2rem;
  }
  
  .form-group select {
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
  .subscribe-form {
    padding: 1rem;
  }
  
  .subscribe-form h2 {
    font-size: 1.25rem;
  }
  
  .warning {
    padding: 0.75rem;
  }
  
  .price-info {
    padding: 0.75rem;
  }
}
</style> 