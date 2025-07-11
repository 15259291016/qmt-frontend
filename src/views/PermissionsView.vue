<template>
  <div class="permissions-container">
    <header class="header">
      <h1>权限管理</h1>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </header>
    <main class="main">
      <div class="tabs">
        <button :class="{active: tab==='my'}" @click="tab='my'">我的权限</button>
        <button :class="{active: tab==='user'}" @click="tab='user'">用户管理</button>
        <button :class="{active: tab==='role'}" @click="tab='role'">角色管理</button>
        <button :class="{active: tab==='perm'}" @click="tab='perm'">权限管理</button>
        <button :class="{active: tab==='assign'}" @click="tab='assign'">用户角色分配</button>
        <button :class="{active: tab==='check'}" @click="tab='check'">权限检查</button>
        <button v-if="isSuperAdmin" :class="{active: tab==='super-admin'}" @click="tab='super-admin'">超级管理员</button>
      </div>
      
      <!-- 我的权限Tab -->
      <div v-if="tab==='my'">
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
      </div>

      <!-- 用户管理Tab -->
      <div v-else-if="tab==='user'">
        <div class="user-card">
          <h2>用户管理</h2>
          <div class="user-actions" v-if="isAdmin || isSuperAdmin">
            <button @click="openUserForm()">新增用户</button>
          </div>
          <div class="user-search">
            <input v-model="userSearch" placeholder="搜索用户名/邮箱" @keyup.enter="fetchUsers(1)" />
            <button @click="fetchUsers(1)">搜索</button>
          </div>
          <table class="user-table">
            <thead>
              <tr>
                <th>用户名</th>
                <th>邮箱</th>
                <th>全名</th>
                <th>角色</th>
                <th>状态</th>
                <th>注册时间</th>
                <th>最后登录</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.full_name || '-' }}</td>
                <td>
                  <div class="user-roles">
                    <span v-for="role in user.roles" :key="role.id" class="role-tag">
                      {{ role.name }}
                    </span>
                    <span v-if="!user.roles || user.roles.length === 0" class="no-role">
                      无角色
                    </span>
                  </div>
                </td>
                <td>
                  <span :class="user.is_active ? 'status-active' : 'status-inactive'">
                    {{ user.is_active ? '激活' : '未激活' }}
                  </span>
                </td>
                <td>{{ formatDate(user.created_at) }}</td>
                <td>{{ formatDate(user.last_login) }}</td>
                <td>
                  <button v-if="isAdmin || isSuperAdmin" @click="editUser(user)">编辑</button>
                  <button v-if="isAdmin || isSuperAdmin" @click="selectUser(user)">分配角色</button>
                  <button v-if="(isAdmin || isSuperAdmin) && user.username !== authStore.user?.username" @click="deleteUser(user)" style="background-color: #dc3545;">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button :disabled="userPage===1" @click="userPage--">上一页</button>
            <span>第{{userPage}}页/共{{userTotalPages}}页</span>
            <button :disabled="userPage===userTotalPages" @click="userPage++">下一页</button>
          </div>
        </div>
        <!-- 用户表单弹窗 -->
        <div v-if="showUserForm" class="modal-mask">
          <div class="modal-container">
            <h3>{{ editingUser ? '编辑用户' : '新增用户' }}</h3>
            <form @submit.prevent="submitUserForm">
              <div class="form-group">
                <label>用户名</label>
                <input v-model="userForm.username" required :disabled="editingUser" />
              </div>
              <div class="form-group">
                <label>邮箱</label>
                <input v-model="userForm.email" type="email" required />
              </div>
              <div class="form-group">
                <label>全名</label>
                <input v-model="userForm.full_name" />
              </div>
              <div class="form-group" v-if="!editingUser">
                <label>密码</label>
                <input v-model="userForm.password" type="password" required />
              </div>
              <div class="form-group">
                <label>状态</label>
                <select v-model="userForm.status">
                  <option value="active">激活</option>
                  <option value="inactive">未激活</option>
                </select>
              </div>
              <div class="form-actions">
                <button type="submit">保存</button>
                <button type="button" @click="closeUserForm">取消</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 角色管理Tab -->
      <div v-else-if="tab==='role'">
        <div class="roles-card">
          <h2>角色管理</h2>
          <div class="role-actions" v-if="isAdmin || isSuperAdmin">
            <button @click="openRoleForm()">新增角色</button>
          </div>
          <table class="role-table">
            <thead>
              <tr>
                <th>角色名</th>
                <th>描述</th>
                <th>权限</th>
                <th>系统角色</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="role in roles" :key="role.id">
                <td>{{ role.name }}</td>
                <td>{{ role.description }}</td>
                <td>
                  <span v-for="pid in role.permissions" :key="pid" class="perm-tag">
                    {{ getPermissionName(pid) }}
                  </span>
                </td>
                <td>{{ role.is_system ? '是' : '否' }}</td>
                <td>
                  <button v-if="isAdmin || isSuperAdmin" @click="openRoleForm(role)">编辑</button>
                  <button v-if="(isAdmin || isSuperAdmin) && !role.is_system" @click="deleteRole(role)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button :disabled="page===1" @click="page--">上一页</button>
            <span>第{{page}}页/共{{totalPages}}页</span>
            <button :disabled="page===totalPages" @click="page++">下一页</button>
          </div>
        </div>
        <!-- 角色表单弹窗 -->
        <div v-if="showRoleForm" class="modal-mask">
          <div class="modal-container">
            <h3>{{ editingRole ? '编辑角色' : '新增角色' }}</h3>
            <form @submit.prevent="submitRoleForm">
              <div class="form-group">
                <label>角色名</label>
                <input v-model="roleForm.name" required :disabled="editingRole && roleForm.is_system" />
              </div>
              <div class="form-group">
                <label>描述</label>
                <input v-model="roleForm.description" />
              </div>
              <div class="form-group">
                <label>分配权限</label>
                <div class="perm-list">
                  <label v-for="perm in allPermissions" :key="perm.id" class="perm-checkbox">
                    <input type="checkbox" :value="perm.id" v-model="roleForm.permissions" :disabled="perm.is_system" />
                    {{ perm.name }}
                  </label>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit">保存</button>
                <button type="button" @click="closeRoleForm">取消</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 权限管理Tab -->
      <div v-else-if="tab==='perm'">
        <div class="permissions-card">
          <h2>权限管理</h2>
          <div class="perm-actions" v-if="isAdmin || isSuperAdmin">
            <button @click="openPermForm()">新增权限</button>
          </div>
          <table class="perm-table">
            <thead>
              <tr>
                <th>权限名</th>
                <th>资源</th>
                <th>操作</th>
                <th>描述</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="perm in permissions" :key="perm.id">
                <td>{{ perm.name }}</td>
                <td>{{ perm.resource }}</td>
                <td>{{ perm.action }}</td>
                <td>{{ perm.description }}</td>
                <td>
                  <button v-if="isAdmin || isSuperAdmin" @click="deletePerm(perm)">删除</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button :disabled="permPage===1" @click="permPage--">上一页</button>
            <span>第{{permPage}}页/共{{permTotalPages}}页</span>
            <button :disabled="permPage===permTotalPages" @click="permPage++">下一页</button>
          </div>
        </div>
        <!-- 权限表单弹窗 -->
        <div v-if="showPermForm" class="modal-mask">
          <div class="modal-container">
            <h3>新增权限</h3>
            <form @submit.prevent="submitPermForm">
              <div class="form-group">
                <label>权限名</label>
                <input v-model="permForm.name" required />
              </div>
              <div class="form-group">
                <label>资源</label>
                <input v-model="permForm.resource" required />
              </div>
              <div class="form-group">
                <label>操作</label>
                <input v-model="permForm.action" required />
              </div>
              <div class="form-group">
                <label>描述</label>
                <input v-model="permForm.description" />
              </div>
              <div class="form-actions">
                <button type="submit">保存</button>
                <button type="button" @click="closePermForm">取消</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <!-- 用户角色分配Tab -->
      <div v-else-if="tab==='assign'">
        <div class="assign-card">
          <h2>用户角色分配</h2>
          <div class="user-search">
            <input v-model="userSearch" placeholder="搜索用户名/邮箱" @keyup.enter="fetchUsers(1)" />
            <button @click="fetchUsers(1)">搜索</button>
          </div>
          <table class="user-table">
            <thead>
              <tr>
                <th>用户名</th>
                <th>邮箱</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in users" :key="user.id">
                <td>{{ user.username }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.status }}</td>
                <td>
                  <button @click="selectUser(user)">分配角色</button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="pagination">
            <button :disabled="userPage===1" @click="userPage--">上一页</button>
            <span>第{{userPage}}页/共{{userTotalPages}}页</span>
            <button :disabled="userPage===userTotalPages" @click="userPage++">下一页</button>
          </div>
        </div>
        <!-- 角色分配弹窗 -->
        <div v-if="showAssignModal" class="modal-mask">
          <div class="modal-container">
            <h3>为用户分配角色</h3>
            <div class="assign-user-info">
              <div><strong>用户名：</strong>{{ selectedUser?.username }}</div>
              <div><strong>邮箱：</strong>{{ selectedUser?.email }}</div>
            </div>
            <form @submit.prevent="submitAssignRoles">
              <div class="form-group">
                <label>分配角色</label>
                <div class="role-list">
                  <label v-for="role in roles" :key="role.id" class="role-checkbox">
                    <input type="checkbox" :value="role.id" v-model="assignRoles" :disabled="role.is_system" />
                    {{ role.name }}
                  </label>
                </div>
              </div>
              <div class="form-actions">
                <button type="submit">保存</button>
                <button type="button" @click="closeAssignModal">取消</button>
              </div>
            </form>
            <div class="assigned-roles">
              <h4>已分配角色</h4>
              <div v-if="userRoles.length > 0">
                <span v-for="role in userRoles" :key="role.id" class="perm-tag">
                  {{ role.name }}
                  <button v-if="isAdmin && !role.is_system" @click="removeUserRole(role)">移除</button>
                </span>
              </div>
              <p v-else>暂无角色</p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 权限检查Tab -->
      <div v-else-if="tab==='check'">
        <div class="check-card">
          <h2>权限检查</h2>
          <div class="check-form">
            <div class="form-group">
              <label>选择用户</label>
              <select v-model="checkUserId" @change="loadUserPermissions">
                <option value="">请选择用户</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.username }} ({{ user.email }})
                </option>
              </select>
            </div>
            <div class="form-group">
              <label>检查权限</label>
              <select v-model="checkPermissionId">
                <option value="">请选择权限</option>
                <option v-for="perm in allPermissions" :key="perm.id" :value="perm.id">
                  {{ perm.name }} ({{ perm.resource }}:{{ perm.action }})
                </option>
              </select>
            </div>
            <button @click="checkUserPermission" :disabled="!checkUserId || !checkPermissionId">检查权限</button>
          </div>
          
          <div v-if="checkResult" class="check-result">
            <h3>检查结果</h3>
            <div :class="['result-item', checkResult.hasPermission ? 'success' : 'error']">
              <strong>权限状态：</strong>
              <span>{{ checkResult.hasPermission ? '有权限' : '无权限' }}</span>
            </div>
            <div v-if="checkResult.roles && checkResult.roles.length > 0" class="result-item">
              <strong>用户角色：</strong>
              <span v-for="role in checkResult.roles" :key="role.id" class="perm-tag">
                {{ role.name }}
              </span>
            </div>
            <div v-else class="result-item">
              <strong>用户角色：</strong>
              <span class="no-data">无角色</span>
            </div>
            <div v-if="checkResult.permissions && checkResult.permissions.length > 0" class="result-item">
              <strong>用户权限：</strong>
              <span v-for="perm in checkResult.permissions" :key="perm.id" class="perm-tag">
                {{ perm.name }}
              </span>
            </div>
            <div v-else class="result-item">
              <strong>用户权限：</strong>
              <span class="no-data">无权限</span>
            </div>
            <!-- 调试信息 -->
            <div class="debug-info" style="margin-top: 1rem; padding: 0.5rem; background: #f8f9fa; border-radius: 4px; font-size: 0.9rem;">
              <strong>调试信息：</strong>
              <pre>{{ JSON.stringify(checkResult, null, 2) }}</pre>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 超级管理员Tab -->
      <div v-else-if="tab==='super-admin'">
        <div class="super-admin-card">
          <h2>超级管理员管理</h2>
          <div class="actions">
            <button @click="refreshSuperAdmins" class="btn btn-primary">刷新列表</button>
          </div>
          
          <div v-if="superAdminLoading" class="loading">
            加载中...
          </div>
          
          <div v-else-if="superAdmins.length === 0" class="empty-state">
            <p>暂无超级管理员</p>
          </div>
          
          <div v-else class="super-admin-list">
            <div v-for="admin in superAdmins" :key="admin.id" class="admin-item">
              <div class="admin-info">
                <h3>{{ admin.username }}</h3>
                <p><strong>邮箱:</strong> {{ admin.email }}</p>
                <p><strong>全名:</strong> {{ admin.full_name || '未设置' }}</p>
                <p><strong>状态:</strong> 
                  <span :class="['status', admin.is_active ? 'active' : 'inactive']">
                    {{ admin.is_active ? '激活' : '未激活' }}
                  </span>
                </p>
                <p><strong>创建时间:</strong> {{ formatDate(admin.created_at) }}</p>
                <p><strong>最后登录:</strong> {{ formatDate(admin.last_login) }}</p>
              </div>
              
              <div class="admin-actions">
                <button 
                  v-if="admin.id !== authStore.user?.id" 
                  @click="removeSuperAdmin(admin)" 
                  class="btn btn-danger"
                >
                  取消超级管理员权限
                </button>
                <span v-else class="self-note">当前用户</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 设置超级管理员 -->
        <div class="set-super-admin-card">
          <h2>设置超级管理员</h2>
          <div class="form-group">
            <label>选择用户:</label>
            <select v-model="selectedSuperAdminUserId" class="form-control">
              <option value="">请选择用户</option>
              <option v-for="user in availableSuperAdminUsers" :key="user.id" :value="user.id">
                {{ user.username }} ({{ user.email }})
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <button 
              @click="setSuperAdmin" 
              :disabled="!selectedSuperAdminUserId || settingSuperAdmin"
              class="btn btn-primary"
            >
              {{ settingSuperAdmin ? '设置中...' : '设置为超级管理员' }}
            </button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { permissionAPI } from '@/api/permission'
import { roleAPI } from '@/api/role'
import { superAdminAPI } from '@/api/super-admin'
import { userAPI } from '@/api/user'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref, watch } from 'vue'

const authStore = useAuthStore()
const tab = ref<'my'|'user'|'role'|'perm'|'assign'|'check'|'super-admin'>('my')

// 管理员权限检查
const isAdmin = computed(() => !!(authStore.hasRole && authStore.hasRole('admin')))
const isSuperAdmin = computed(() => !!authStore.user?.is_super_admin)

// 角色管理相关
const roles = ref<any[]>([])
const page = ref(1)
const limit = ref(10)
const totalPages = ref(1)
const total = ref(0)
const allPermissions = ref<any[]>([])

const showRoleForm = ref(false)
const editingRole = ref<any|null>(null)
const roleForm = ref({ name: '', description: '', permissions: [], is_system: false })

// 权限管理相关
const permissions = ref<any[]>([])
const permPage = ref(1)
const permLimit = ref(10)
const permTotalPages = ref(1)
const permTotal = ref(0)
const showPermForm = ref(false)
const permForm = ref({ name: '', resource: '', action: '', description: '' })

// 用户管理相关
const users = ref<any[]>([])
const userPage = ref(1)
const userLimit = ref(10)
const userTotalPages = ref(1)
const userTotal = ref(0)
const userSearch = ref('')
const showUserForm = ref(false)
const editingUser = ref<any|null>(null)
const userForm = ref({ username: '', email: '', full_name: '', password: '', status: 'active' })

// 用户角色分配相关
const selectedUser = ref<any|null>(null)
const showAssignModal = ref(false)
const assignRoles = ref<string[]>([])
const userRoles = ref<any[]>([])

// 权限检查相关
const checkUserId = ref('')
const checkPermissionId = ref('')
const checkResult = ref<any|null>(null)

// 超级管理员相关
const superAdmins = ref<any[]>([])
const availableSuperAdminUsers = ref<any[]>([])
const selectedSuperAdminUserId = ref('')
const superAdminLoading = ref(false)
const settingSuperAdmin = ref(false)

// 格式化日期
const formatDate = (dateString?: string) => {
  if (!dateString) return '未设置'
  try {
    return new Date(dateString).toLocaleString('zh-CN')
  } catch {
    return '无效日期'
  }
}

// 获取权限名称
function getPermissionName(pid: string) {
  const perm = allPermissions.value.find(p => p.id === pid)
  return perm ? perm.name : pid
}

// 角色管理功能
function openRoleForm(role?: any) {
  if (role) {
    editingRole.value = role
    roleForm.value = { ...role, permissions: [...role.permissions], is_system: !!role.is_system }
  } else {
    editingRole.value = null
    roleForm.value = { name: '', description: '', permissions: [], is_system: false }
  }
  showRoleForm.value = true
}

function closeRoleForm() {
  showRoleForm.value = false
}

async function fetchRoles() {
  try {
    const res = await roleAPI.list({ page: page.value, limit: limit.value })
    console.log('角色API响应:', res)
    if (res.data && (res.data.code === 0 || res.data.code === 200)) {
      // 后端返回的是嵌套结构：res.data.data.roles
      if (res.data.data && res.data.data.roles) {
        roles.value = res.data.data.roles
        total.value = res.data.data.pagination.total
        totalPages.value = res.data.data.pagination.pages
      } else {
        console.error('角色数据格式不正确:', res.data)
      }
    } else {
      console.error('角色API返回错误:', res.data)
    }
  } catch (error) {
    console.error('获取角色列表失败:', error)
  }
}

async function fetchAllPermissions() {
  try {
    const res = await permissionAPI.list({ page: 1, limit: 1000 })
    console.log('所有权限API响应:', res)
    if (res.data && (res.data.code === 0 || res.data.code === 200)) {
      // 后端返回的是嵌套结构：res.data.data.permissions
      if (res.data.data && res.data.data.permissions) {
        allPermissions.value = res.data.data.permissions
      } else {
        console.error('权限数据格式不正确:', res.data)
      }
    } else {
      console.error('权限API返回错误:', res.data)
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
  }
}

async function submitRoleForm() {
  try {
    if (editingRole.value) {
      await roleAPI.update(editingRole.value.id, {
        name: roleForm.value.name,
        description: roleForm.value.description,
        permissions: roleForm.value.permissions
      })
    } else {
      await roleAPI.create({
        name: roleForm.value.name,
        description: roleForm.value.description,
        permissions: roleForm.value.permissions
      })
    }
    showRoleForm.value = false
    await fetchRoles()
    alert('操作成功')
  } catch (error: any) {
    alert('操作失败：' + (error.message || '未知错误'))
  }
}

async function deleteRole(role: any) {
  if (confirm('确定要删除该角色吗？')) {
    try {
      await roleAPI.remove(role.id)
      await fetchRoles()
      alert('删除成功')
    } catch (error: any) {
      alert('删除失败：' + (error.message || '未知错误'))
    }
  }
}

// 权限管理功能
function openPermForm() {
  permForm.value = { name: '', resource: '', action: '', description: '' }
  showPermForm.value = true
}

function closePermForm() {
  showPermForm.value = false
}

async function fetchPermissions() {
  try {
    const res = await permissionAPI.list({ page: permPage.value, limit: permLimit.value })
    console.log('权限API响应:', res)
    if (res.data && (res.data.code === 0 || res.data.code === 200)) {
      // 后端返回的是嵌套结构：res.data.data.permissions
      if (res.data.data && res.data.data.permissions) {
        permissions.value = res.data.data.permissions
        permTotal.value = res.data.data.pagination.total
        permTotalPages.value = res.data.data.pagination.pages
      } else {
        console.error('权限数据格式不正确:', res.data)
      }
    } else {
      console.error('权限API返回错误:', res.data)
    }
  } catch (error) {
    console.error('获取权限列表失败:', error)
  }
}

async function submitPermForm() {
  try {
    await permissionAPI.create({
      name: permForm.value.name,
      resource: permForm.value.resource,
      action: permForm.value.action,
      description: permForm.value.description
    })
    showPermForm.value = false
    await fetchPermissions()
    await fetchAllPermissions()
    alert('创建成功')
  } catch (error: any) {
    alert('创建失败：' + (error.message || '未知错误'))
  }
}

async function deletePerm(perm: any) {
  if (confirm(`确定要删除权限 "${perm.name}" 吗？`)) {
    try {
      await permissionAPI.remove(perm.id)
      await fetchPermissions()
      await fetchAllPermissions()
      alert('删除成功')
    } catch (error: any) {
      alert('删除失败：' + (error.message || '未知错误'))
    }
  }
}

// 用户管理功能
function openUserForm(user?: any) {
  if (user) {
    editingUser.value = user
    userForm.value = { 
      username: user.username, 
      email: user.email, 
      full_name: user.full_name || '', 
      password: '', 
      status: user.status || 'active' 
    }
  } else {
    editingUser.value = null
    userForm.value = { username: '', email: '', full_name: '', password: '', status: 'active' }
  }
  showUserForm.value = true
}

function closeUserForm() {
  showUserForm.value = false
}

async function fetchUsers(pageNum = 1) {
  try {
    userPage.value = pageNum
    const params: any = { page: userPage.value, limit: userLimit.value }
    if (userSearch.value) params.search = userSearch.value
    const res = await userAPI.list(params)
    if (res.data && (res.data.code === 0 || res.data.code === 200) && res.data.data && res.data.data.users) {
      users.value = res.data.data.users
      userTotal.value = res.data.data.pagination?.total || res.data.data.users.length
      userTotalPages.value = res.data.data.pagination?.pages || 1
    }
  } catch (error) {
    console.error('获取用户列表失败:', error)
  }
}

async function submitUserForm() {
  try {
    if (editingUser.value) {
      // 编辑用户
      const updateData: any = {
        email: userForm.value.email,
        full_name: userForm.value.full_name,
        status: userForm.value.status
      }
      await userAPI.update(editingUser.value.id, updateData)
    } else {
      // 创建用户
      await userAPI.create({
        username: userForm.value.username,
        email: userForm.value.email,
        full_name: userForm.value.full_name,
        password: userForm.value.password,
        status: userForm.value.status
      })
    }
    showUserForm.value = false
    await fetchUsers()
    alert('操作成功')
  } catch (error: any) {
    alert('操作失败：' + (error.message || '未知错误'))
  }
}

function editUser(user: any) {
  openUserForm(user)
}

async function deleteUser(user: any) {
  if (confirm(`确定要删除用户 "${user.username}" 吗？此操作不可恢复。`)) {
    try {
      await userAPI.remove(user.id)
      await fetchUsers()
      alert('删除成功')
    } catch (error: any) {
      alert('删除失败：' + (error.message || '未知错误'))
    }
  }
}

// 用户角色分配功能
function selectUser(user: any) {
  selectedUser.value = user
  fetchUserRoles(user.id)
  showAssignModal.value = true
}

function closeAssignModal() {
  showAssignModal.value = false
  selectedUser.value = null
  assignRoles.value = []
  userRoles.value = []
}

async function fetchUserRoles(userId: string) {
  try {
    const res = await userAPI.getUserRoles(userId)
    if (res.data && (res.data.code === 0 || res.data.code === 200) && res.data.data && res.data.data.roles) {
      userRoles.value = res.data.data.roles
      assignRoles.value = userRoles.value.map((r: any) => r.id)
    }
  } catch (error) {
    console.error('获取用户角色失败:', error)
  }
}

async function submitAssignRoles() {
  if (!selectedUser.value) return
  try {
    // 先移除所有，再分配选中的
    for (const role of userRoles.value) {
      if (!assignRoles.value.includes(role.id)) {
        await userAPI.removeRole(selectedUser.value.id, role.id)
      }
    }
    for (const roleId of assignRoles.value) {
      if (!userRoles.value.some((r: any) => r.id === roleId)) {
        await userAPI.assignRole(selectedUser.value.id, roleId)
      }
    }
    await fetchUserRoles(selectedUser.value.id)
    alert('分配成功')
  } catch (error: any) {
    alert('分配失败：' + (error.message || '未知错误'))
  }
}

async function removeUserRole(role: any) {
  if (!selectedUser.value) return
  if (confirm('确定要移除该角色吗？')) {
    try {
      await userAPI.removeRole(selectedUser.value.id, role.id)
      await fetchUserRoles(selectedUser.value.id)
      alert('移除成功')
    } catch (error: any) {
      alert('移除失败：' + (error.message || '未知错误'))
    }
  }
}

// 权限检查功能
async function loadUserPermissions() {
  if (!checkUserId.value) {
    checkResult.value = null
    return
  }
  
  try {
    const [rolesRes, permissionsRes] = await Promise.all([
      userAPI.getUserRoles(checkUserId.value),
      userAPI.getUserPermissions(checkUserId.value)
    ])
    
    console.log('角色响应:', rolesRes)
    console.log('权限响应:', permissionsRes)
    
    // 兼容不同的数据结构
    const roles = rolesRes.data?.data?.roles || rolesRes.data?.roles || []
    const permissions = permissionsRes.data?.data?.permissions || permissionsRes.data?.permissions || []
    
    checkResult.value = {
      roles,
      permissions
    }
    
    console.log('解析后的权限数据:', checkResult.value)
  } catch (error) {
    console.error('获取用户权限信息失败:', error)
    checkResult.value = null
  }
}

async function checkUserPermission() {
  if (!checkUserId.value || !checkPermissionId.value) return
  
  try {
    // 这里需要后端提供权限检查API
    // 暂时使用前端检查逻辑
    const userPermissions = checkResult.value?.permissions || []
    const hasPermission = userPermissions.some((p: any) => p.id === checkPermissionId.value)
    
    checkResult.value = {
      ...checkResult.value,
      hasPermission
    }
  } catch (error) {
    console.error('权限检查失败:', error)
    alert('权限检查失败：' + (error as any).message || '未知错误')
  }
}

// 超级管理员功能
async function refreshSuperAdmins() {
  superAdminLoading.value = true
  try {
    const res = await superAdminAPI.list()
    if (res.data && (res.data.code === 0 || res.data.code === 200) && res.data.data && res.data.data.super_admins) {
      superAdmins.value = res.data.data.super_admins
    }
  } catch (error) {
    console.error('获取超级管理员列表失败:', error)
  } finally {
    superAdminLoading.value = false
  }
}

async function removeSuperAdmin(admin: any) {
  if (confirm(`确定要取消用户 "${admin.username}" 的超级管理员权限吗？`)) {
    try {
      await superAdminAPI.removeSuperAdmin(admin.id)
      await refreshSuperAdmins()
      alert('超级管理员权限已取消')
    } catch (error: any) {
      alert('取消超级管理员权限失败：' + (error.message || '未知错误'))
    }
  }
}

async function setSuperAdmin() {
  if (!selectedSuperAdminUserId.value) return
  settingSuperAdmin.value = true
  try {
    await superAdminAPI.setSuperAdmin({ user_id: selectedSuperAdminUserId.value })
    await refreshSuperAdmins()
    alert('超级管理员设置成功')
  } catch (error: any) {
    alert('设置超级管理员失败：' + (error.message || '未知错误'))
  } finally {
    settingSuperAdmin.value = false
  }
}

async function fetchAvailableSuperAdminUsers() {
  try {
    const res = await userAPI.list({ limit: 1000, search: '!is_super_admin' }) // 查找不是超级管理员的用户
    if (res.data && (res.data.code === 0 || res.data.code === 200) && res.data.data && res.data.data.users) {
      availableSuperAdminUsers.value = res.data.data.users
    }
  } catch (error) {
    console.error('获取可用超级管理员用户失败:', error)
  }
}

// 监听Tab切换，加载对应数据
watch(tab, (newTab) => {
  if (newTab === 'role') {
    fetchRoles()
    fetchAllPermissions()
  } else if (newTab === 'perm') {
    fetchPermissions()
  } else if (newTab === 'user' || newTab === 'assign' || newTab === 'check') {
    fetchUsers()
  }
  if (newTab === 'check') {
    fetchAllPermissions()
    // 清空之前的检查结果
    checkResult.value = null
    checkUserId.value = ''
    checkPermissionId.value = ''
  }
  if (newTab === 'super-admin') {
    refreshSuperAdmins()
    fetchAvailableSuperAdminUsers()
  }
})

onMounted(() => {
  // 初始化加载数据
  if (tab.value === 'role') {
    fetchRoles()
    fetchAllPermissions()
  } else if (tab.value === 'perm') {
    fetchPermissions()
  } else if (tab.value === 'user' || tab.value === 'assign') {
    fetchUsers()
  }
  if (tab.value === 'super-admin') {
    refreshSuperAdmins()
    fetchAvailableSuperAdminUsers()
  }
})

// 监听分页变化
watch([page], () => {
  if (tab.value === 'role') fetchRoles()
})

watch([permPage], () => {
  if (tab.value === 'perm') fetchPermissions()
})

watch([userPage], () => {
  if (tab.value === 'user' || tab.value === 'assign') fetchUsers(userPage.value)
})

watch(() => authStore.user, (val) => {
  console.log('authStore.user变更:', val)
}, { immediate: true, deep: true })
</script>

<style scoped>
/* 原有样式保持不变 */
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
  max-width: 1200px;
  margin: 0 auto;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.tabs button {
  padding: 0.5rem 1.5rem;
  border: none;
  border-radius: 4px 4px 0 0;
  background: #e9ecef;
  color: #333;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.tabs button.active {
  background: #007bff;
  color: white;
}

.permissions-card,
.roles-card,
.assign-card,
.user-card,
.check-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.permissions-card h2,
.roles-card h2,
.assign-card h2,
.user-card h2,
.check-card h2 {
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

.role-actions,
.perm-actions,
.user-actions {
  margin-bottom: 1rem;
}

.role-actions button,
.perm-actions button,
.user-actions button {
  background-color: #28a745;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 0.5rem;
}

.role-table,
.perm-table,
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}

.role-table th, .role-table td,
.perm-table th, .perm-table td,
.user-table th, .user-table td {
  border: 1px solid #eee;
  padding: 0.5rem 1rem;
  text-align: left;
}

.perm-tag {
  display: inline-block;
  background: #e9ecef;
  color: #007bff;
  border-radius: 12px;
  padding: 0 8px;
  margin: 0 2px;
  font-size: 0.85em;
}

.modal-mask {
  position: fixed;
  z-index: 9999;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.3);
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-container {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  min-width: 400px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.perm-list,
.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 0.5rem;
  border-radius: 4px;
}

.perm-checkbox,
.role-checkbox {
  margin-right: 1rem;
  white-space: nowrap;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.form-actions button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.form-actions button[type="submit"] {
  background-color: #28a745;
  color: white;
}

.form-actions button[type="button"] {
  background-color: #6c757d;
  color: white;
}

.user-search {
  margin-bottom: 1rem;
  display: flex;
  gap: 0.5rem;
}

.user-search input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.user-search button {
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.assign-user-info {
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.assigned-roles {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
}

.assigned-roles h4 {
  margin-bottom: 0.5rem;
}

.assigned-roles .perm-tag {
  margin-right: 0.5rem;
  background: #e9ecef;
  color: #007bff;
  border-radius: 12px;
  padding: 0 8px;
  font-size: 0.85em;
  display: inline-flex;
  align-items: center;
}

.assigned-roles button {
  margin-left: 4px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0 6px;
  cursor: pointer;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  background: #f8f9fa;
  cursor: not-allowed;
}

.pagination span {
  color: #666;
}

.check-form {
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.check-form button {
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 1rem;
}

.check-form button:disabled {
  background-color: #6c757d;
  cursor: not-allowed;
}

.check-result {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.check-result h3 {
  margin-bottom: 1rem;
  color: #333;
}

.result-item {
  margin-bottom: 1rem;
  padding: 0.5rem;
  border-radius: 4px;
}

.result-item.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.result-item.error {
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.result-item strong {
  margin-right: 0.5rem;
}

.perm-tag {
  display: inline-block;
  padding: 0.25rem 0.5rem;
  margin: 0.125rem;
  background-color: #007bff;
  color: white;
  border-radius: 4px;
  font-size: 0.875rem;
}

.no-data {
  color: #6c757d;
  font-style: italic;
}

.debug-info {
  margin-top: 1rem;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
  border: 1px solid #dee2e6;
}

.debug-info pre {
  margin: 0.5rem 0 0 0;
  white-space: pre-wrap;
  word-break: break-all;
}

/* 用户角色显示样式 */
.user-roles {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.role-tag {
  background-color: #007bff;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  white-space: nowrap;
}

.no-role {
  color: #6c757d;
  font-style: italic;
  font-size: 0.85rem;
}

/* 用户状态显示样式 */
.status-active {
  color: #28a745;
  font-weight: 500;
}

.status-inactive {
  color: #dc3545;
  font-weight: 500;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main {
    padding: 1rem;
  }
  
  .tabs {
    flex-direction: column;
  }
  
  .tabs button {
    border-radius: 4px;
  }
  
  .modal-container {
    margin: 1rem;
    min-width: auto;
  }
  
  .role-table,
  .perm-table,
  .user-table {
    font-size: 0.9rem;
  }
  
  .role-table th, .role-table td,
  .perm-table th, .perm-table td,
  .user-table th, .user-table td {
    padding: 0.25rem 0.5rem;
  }
}
</style> 