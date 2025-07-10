import { useAuthStore } from '@/stores/auth'
import type { Directive } from 'vue'

// 仅页面级权限控制：如果无权限，整个页面隐藏
const permission: Directive = {
  mounted(el, binding) {
    const authStore = useAuthStore()
    const value = binding.value
    // 支持字符串或字符串数组
    let has = false
    if (typeof value === 'string') {
      has = authStore.hasPermission(value)
    } else if (Array.isArray(value)) {
      has = value.some((perm) => authStore.hasPermission(perm))
    }
    if (!has) {
      el.style.display = 'none'
    }
  }
}

export default permission 