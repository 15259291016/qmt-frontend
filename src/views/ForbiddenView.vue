<template>
  <div class="forbidden-container">
    <div class="forbidden-content">
      <h1>403</h1>
      <h2>访问被拒绝</h2>
      <p>抱歉，您没有权限访问此页面</p>
      <div class="actions">
        <router-link to="/" class="btn">返回首页</router-link>
        <router-link to="/login" class="btn btn-secondary">重新登录</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.forbidden-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f8f9fa;
  padding: 1rem;
}

.forbidden-content {
  text-align: center;
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
}

.forbidden-content h1 {
  font-size: 4rem;
  color: #dc3545;
  margin: 0;
}

.forbidden-content h2 {
  color: #333;
  margin: 1rem 0;
}

.forbidden-content p {
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
  .forbidden-container {
    padding: 0.5rem;
  }
  
  .forbidden-content {
    padding: 2rem;
    border-radius: 0;
    box-shadow: none;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .forbidden-content h1 {
    font-size: 3rem;
  }
  
  .forbidden-content h2 {
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
  .forbidden-content {
    padding: 1.5rem;
  }
  
  .forbidden-content h1 {
    font-size: 2.5rem;
  }
  
  .forbidden-content h2 {
    font-size: 1.1rem;
  }
}
</style> 