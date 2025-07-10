<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1>404</h1>
      <h2>页面未找到</h2>
      <p>抱歉，您访问的页面不存在</p>
      <div class="actions">
        <router-link to="/" class="btn">返回首页</router-link>
        <button @click="goBack" class="btn btn-secondary">返回上页</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.go(-1)
}
</script>

<style scoped>
.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.not-found-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.not-found-content h1 {
  font-size: 4rem;
  color: #6c757d;
  margin: 0;
}

.not-found-content h2 {
  color: #333;
  margin: 1rem 0;
}

.not-found-content p {
  color: #666;
  margin-bottom: 2rem;
  line-height: 1.6;
}

.actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
  border: none;
  cursor: pointer;
  font-size: 1rem;
}

.btn:first-child {
  background-color: #007bff;
  color: white;
}

.btn:first-child:hover {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}

/* 手机端适配 */
@media (max-width: 768px) {
  .not-found-container {
    padding: 0.5rem;
  }
  
  .not-found-content {
    padding: 2rem;
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .not-found-content h1 {
    font-size: 3rem;
  }
  
  .not-found-content h2 {
    font-size: 1.25rem;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .btn {
    width: 100%;
    padding: 1rem;
    font-size: 16px;
  }
}

@media (max-width: 480px) {
  .not-found-content {
    padding: 1.5rem;
  }
  
  .not-found-content h1 {
    font-size: 2.5rem;
  }
  
  .not-found-content h2 {
    font-size: 1.1rem;
  }
}
</style> 