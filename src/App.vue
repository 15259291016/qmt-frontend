<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <RouterView />
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 16px;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  line-height: 1.6;
  color: #333;
  background-color: #f8f9fa;
}

#app {
  min-height: 100vh;
}

/* 全局响应式设计 */
@media (max-width: 768px) {
  html {
    font-size: 14px;
  }
  
  body {
    font-size: 0.9rem;
  }
}

@media (max-width: 480px) {
  html {
    font-size: 13px;
  }
  
  body {
    font-size: 0.85rem;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  button, .btn, .nav-link {
    min-height: 44px;
    min-width: 44px;
  }
  
  input, select, textarea {
    font-size: 16px !important; /* 防止iOS缩放 */
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: #f1f1f1;
}

::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 选择文本样式 */
::selection {
  background-color: #007bff;
  color: white;
}

/* 焦点样式 */
:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}

/* 按钮和链接的焦点样式 */
button:focus,
a:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #007bff;
  outline-offset: 2px;
}
</style>
