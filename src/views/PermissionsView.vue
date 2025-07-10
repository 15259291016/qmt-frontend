<template>
  <div class="permissions-container">
    <header class="header">
      <h1>权限管理</h1>
      <router-link to="/" class="back-btn">返回首页</router-link>
    </header>
    <main class="main">
      <div class="tabs">
        <button :class="{active: tab==='my'}" @click="tab='my'">我的权限</button>
        <button :class="{active: tab==='role'}" @click="tab='role'">角色管理</button>
        <button :class="{active: tab==='perm'}" @click="tab='perm'">权限管理</button>
        <button :class="{active: tab==='assign'}" @click="tab='assign'">用户角色分配</button>
      </div>
      <div v-if="tab==='my'">
        <!-- 我的权限/角色（原有内容） -->
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
      <div v-else-if="tab==='role'">
        <!-- 角色管理Tab -->
        <div class="roles-card">
          <h2>角色管理</h2>
          <div class="role-actions" v-if="isAdmin">
            <button @click="openRoleForm()">新增角色</button>
          </div>
          <table class="role-table">
            <thead>
              <tr>
                <th>角色名</th>
                <th>描述</th>
                <th>权限</th>
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
                <td>
                  <button v-if="isAdmin" @click="openRoleForm(role)">编辑</button>
                  <button v-if="isAdmin && !role.is_system" @click="deleteRole(role)">删除</button>
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
      <div v-else-if="tab==='perm'">
        <!-- 权限管理Tab -->
        <div class="permissions-card">
          <h2>权限管理</h2>
          <div class="perm-actions" v-if="isAdmin">
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
                  <button v-if="isAdmin" @click="deletePerm(perm)">删除</button>
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
      <div v-else-if="tab==='assign'">
        <!-- 用户角色分配Tab -->
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
    </main>
  </div>
</template>

<script setup lang="ts">
import { permissionAPI } from '@/api/permission'
import { roleAPI } from '@/api/role'
import { userAPI } from '@/api/user'
import { useAuthStore } from '@/stores/auth'
import { computed, onMounted, ref, watch } from 'vue'

const authStore = useAuthStore()
const tab = ref<'my'|'role'|'perm'|'assign'>('my')

// 角色管理相关
const isAdmin = computed(() => authStore.hasRole && authStore.hasRole('admin'))
const roles = ref<any[]>([])
const page = ref(1)
const limit = ref(10)
const totalPages = ref(1)
const total = ref(0)
const allPermissions = ref<any[]>([])

const showRoleForm = ref(false)
const editingRole = ref<any|null>(null)
const roleForm = ref({ name: '', description: '', permissions: [], is_system: false })

function getPermissionName(pid: string) {
  const perm = allPermissions.value.find(p => p.id === pid)
  return perm ? perm.name : pid
}

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
  const res = await roleAPI.list({ page: page.value, limit: limit.value })
  if (res.data && res.data.data && res.data.data.roles) {
    roles.value = res.data.data.roles
    total.value = res.data.data.pagination.total
    totalPages.value = res.data.data.pagination.pages
  }
}

async function fetchAllPermissions() {
  const res = await permissionAPI.list({ page: 1, limit: 1000 })
  if (res.data && res.data.data && res.data.data.permissions) {
    allPermissions.value = res.data.data.permissions
  }
}

async function submitRoleForm() {
  if (editingRole.value) {
    // 编辑
    await roleAPI.update(editingRole.value.id, {
      name: roleForm.value.name,
      description: roleForm.value.description,
      permissions: roleForm.value.permissions
    })
  } else {
    // 新增
    await roleAPI.create({
      name: roleForm.value.name,
      description: roleForm.value.description,
      permissions: roleForm.value.permissions
    })
  }
  showRoleForm.value = false
  await fetchRoles()
}

async function deleteRole(role: any) {
  if (confirm('确定要删除该角色吗？')) {
    await roleAPI.remove(role.id)
    await fetchRoles()
  }
}

// 权限管理相关
const permissions = ref<any[]>([])
const permPage = ref(1)
const permLimit = ref(10)
const permTotalPages = ref(1)
const permTotal = ref(0)
const showPermForm = ref(false)
const permForm = ref({ name: '', resource: '', action: '', description: '' })

async function fetchPermissions() {
  const res = await permissionAPI.list({ page: permPage.value, limit: permLimit.value })
  if (res.data && res.data.data && res.data.data.permissions) {
    permissions.value = res.data.data.permissions
    permTotal.value = res.data.data.pagination.total
    permTotalPages.value = res.data.data.pagination.pages
  }
}
function openPermForm() {
  permForm.value = { name: '', resource: '', action: '', description: '' }
  showPermForm.value = true
}
function closePermForm() {
  showPermForm.value = false
}
async function submitPermForm() {
  await permissionAPI.create({
    name: permForm.value.name,
    resource: permForm.value.resource,
    action: permForm.value.action,
    description: permForm.value.description
  })
  showPermForm.value = false
  await fetchPermissions()
  await fetchAllPermissions() // 角色管理Tab权限同步
}
async function deletePerm(perm: any) {
  if (confirm('确定要删除该权限吗？')) {
    // 后端未实现权限删除API，实际可补充
    // await permissionAPI.remove(perm.id)
    alert('请在后端实现权限删除API后再使用此功能')
    // await fetchPermissions()
    // await fetchAllPermissions()
  }
}

// 用户角色分配相关
const users = ref<any[]>([])
const userPage = ref(1)
const userLimit = ref(10)
const userTotalPages = ref(1)
const userTotal = ref(0)
const userSearch = ref('')
const selectedUser = ref<any|null>(null)
const showAssignModal = ref(false)
const assignRoles = ref<string[]>([])
const userRoles = ref<any[]>([])

async function fetchUsers(pageNum = 1) {
  userPage.value = pageNum
  const params: any = { page: userPage.value, limit: userLimit.value }
  if (userSearch.value) params.search = userSearch.value
  const res = await userAPI.list(params)
  if (res.data && Array.isArray(res.data.data)) {
    users.value = res.data.data
    userTotal.value = res.data.data.length // 如后端有分页total可替换
    userTotalPages.value = 1 // 如后端有分页pages可替换
  }
}
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
  const res = await userAPI.getUserRoles(userId)
  if (res.data && res.data.data && res.data.data.roles) {
    userRoles.value = res.data.data.roles
    assignRoles.value = userRoles.value.map((r: any) => r.id)
  }
}
async function submitAssignRoles() {
  if (!selectedUser.value) return
  // 先移除所有，再分配选中的（可优化为diff）
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
}
async function removeUserRole(role: any) {
  if (!selectedUser.value) return
  if (confirm('确定要移除该角色吗？')) {
    await userAPI.removeRole(selectedUser.value.id, role.id)
    await fetchUserRoles(selectedUser.value.id)
  }
}

onMounted(() => {
  fetchRoles()
  fetchAllPermissions()
  fetchPermissions() // 权限管理Tab初始化
  fetchUsers() // 用户角色分配Tab初始化
})

watch([page], () => {
  fetchRoles()
})

watch([permPage], () => {
  fetchPermissions()
})

watch([userPage], () => {
  fetchUsers(userPage.value)
})
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
  max-width: 900px;
  margin: 0 auto;
}
.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
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
.assign-card {
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
.permissions-card h2,
.roles-card h2,
.assign-card h2 {
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
.role-actions {
  margin-bottom: 1rem;
}
.role-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.role-table th, .role-table td {
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
  min-width: 320px;
  max-width: 90vw;
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
}
.form-group input[type="text"],
.form-group input[type="password"],
.form-group input[type="email"] {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.perm-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.perm-checkbox {
  margin-right: 1rem;
}
.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}
.perm-actions {
  margin-bottom: 1rem;
}
.perm-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.perm-table th, .perm-table td {
  border: 1px solid #eee;
  padding: 0.5rem 1rem;
  text-align: left;
}
.user-search {
  margin-bottom: 1rem;
}
.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1rem;
}
.user-table th, .user-table td {
  border: 1px solid #eee;
  padding: 0.5rem 1rem;
  text-align: left;
}
.assign-user-info {
  margin-bottom: 1rem;
}
.role-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.role-checkbox {
  margin-right: 1rem;
}
.assigned-roles {
  margin-top: 1rem;
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
</style> 