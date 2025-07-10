# QMT前端管理系统

基于 Vue 3 + TypeScript + Vite + Pinia 构建的现代化前端管理系统。

## 功能特性

- 🔐 用户认证（登录/注册）
- 👤 用户管理
- 🔑 权限管理
- 💳 订阅管理
- 🎨 现代化UI设计
- 📱 响应式布局（支持手机端）
- 🔒 路由守卫
- 🚀 快速开发
- 📱 手机端完美适配

## 技术栈

- **框架**: Vue 3
- **语言**: TypeScript
- **构建工具**: Vite
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP客户端**: Axios
- **样式**: CSS3

## 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0

### 安装依赖

```bash
npm install
```

### 开发环境

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产版本

```bash
npm run preview
```

## 项目结构

```
src/
├── api/                 # API服务
│   ├── auth.ts         # 认证相关API
│   ├── user.ts         # 用户相关API
│   ├── permission.ts   # 权限相关API
│   └── business.ts     # 业务相关API
├── components/         # 公共组件
├── config/            # 配置文件
│   └── api.ts         # API配置
├── router/            # 路由配置
│   └── index.ts       # 路由定义
├── stores/            # 状态管理
│   └── auth.ts        # 认证状态
├── utils/             # 工具函数
│   └── http.ts        # HTTP客户端
├── views/             # 页面组件
│   ├── LoginView.vue      # 登录页
│   ├── RegisterView.vue   # 注册页
│   ├── HomeView.vue       # 首页
│   ├── ProfileView.vue    # 个人中心
│   ├── SubscribeView.vue  # 订阅页面
│   ├── AdminView.vue      # 管理员页面
│   ├── PermissionsView.vue # 权限管理
│   ├── ForbiddenView.vue  # 403页面
│   └── NotFoundView.vue   # 404页面
├── App.vue            # 根组件
└── main.ts            # 入口文件
```

## 环境变量

### 开发环境 (.env.development)

```
VITE_API_BASE_URL=http://localhost:8888
VITE_APP_TITLE=QMT前端管理系统
```

### 生产环境 (.env.production)

```
VITE_API_BASE_URL=https://your-api-domain.com
VITE_APP_TITLE=QMT前端管理系统
```

## API接口

### 认证相关

- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `POST /api/auth/logout` - 用户登出
- `GET /api/auth/profile` - 获取用户信息
- `POST /api/auth/refresh` - 刷新token

### 用户相关

- `POST /api/user/subscribe` - 订阅激活/续费

### 权限相关

- `GET /api/roles` - 获取角色列表
- `GET /api/permissions` - 获取权限列表
- `GET /api/users/{id}/roles` - 获取用户角色
- `GET /api/users/{id}/permissions` - 获取用户权限

### 业务相关

- `GET /api/data` - 获取数据
- `GET /api/system` - 获取系统信息
- `GET /api/users` - 获取用户列表
- `GET /api/admin` - 管理员信息
- `GET /api/mixed-permissions` - 混合权限信息

## 路由说明

| 路径 | 名称 | 描述 | 需要认证 |
|------|------|------|----------|
| `/login` | 登录 | 用户登录页面 | 否 |
| `/register` | 注册 | 用户注册页面 | 否 |
| `/` | 首页 | 系统首页 | 是 |
| `/profile` | 个人中心 | 用户信息管理 | 是 |
| `/subscribe` | 订阅 | 订阅管理页面 | 是 |
| `/admin` | 管理员 | 管理员面板 | 是（需要管理员权限） |
| `/permissions` | 权限管理 | 权限查看页面 | 是 |
| `/403` | 禁止访问 | 权限不足页面 | 否 |
| `/*` | 404 | 页面未找到 | 否 |

## 状态管理

使用 Pinia 进行状态管理，主要包含：

### 认证状态 (auth)

- `user` - 用户信息
- `permissions` - 用户权限
- `roles` - 用户角色
- `subscription` - 订阅信息
- `loading` - 加载状态

### 计算属性

- `isLoggedIn` - 是否已登录
- `hasPermission` - 检查权限
- `hasRole` - 检查角色
- `isSubscriptionValid` - 订阅是否有效

## 权限控制

### 路由守卫

- 自动检查用户认证状态
- 验证用户权限和角色
- 检查订阅有效性
- 自动跳转到相应页面

### 权限检查

```typescript
// 检查权限
if (authStore.hasPermission('user:read')) {
  // 有权限执行操作
}

// 检查角色
if (authStore.hasRole('admin')) {
  // 管理员操作
}
```

## 开发指南

### 添加新页面

1. 在 `src/views/` 创建新的 Vue 组件
2. 在 `src/router/index.ts` 添加路由配置
3. 根据需要添加权限控制

### 添加新API

1. 在 `src/api/` 创建新的API服务文件
2. 在 `src/config/api.ts` 添加API端点配置
3. 在状态管理中添加相应的状态和方法

### 样式规范

- 使用 CSS3 和 Flexbox/Grid 布局
- 遵循响应式设计原则
- 保持一致的视觉风格

## 📱 手机端适配

### 响应式断点
- **桌面端**: 1200px+
- **平板端**: 768px - 1199px
- **手机端**: < 768px
- **小屏手机**: < 480px

### 适配特性
- ✅ 触摸友好的交互设计
- ✅ 大尺寸输入框（防止iOS缩放）
- ✅ 响应式导航菜单
- ✅ 优化的字体和间距
- ✅ 全屏表单布局
- ✅ 卡片式信息展示

### 设备兼容性
- ✅ iPhone (iOS 12+)
- ✅ Android (Android 8+)
- ✅ iPad (iOS 12+)
- ✅ Android平板
- ✅ 各种尺寸的手机

### 浏览器支持
- ✅ Safari (iOS)
- ✅ Chrome (Android)
- ✅ Firefox Mobile
- ✅ Edge Mobile

## 部署说明

### 构建

```bash
npm run build
```

### 部署到服务器

将 `dist/` 目录下的文件部署到 Web 服务器。

### Nginx 配置示例

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/dist;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    location /api {
        proxy_pass http://localhost:8888;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 常见问题

### 1. 跨域问题

确保后端已正确配置 CORS，允许前端域名访问。

### 2. 认证失败

检查 token 是否正确设置，确保请求头包含 `Authorization: Bearer <token>`。

### 3. 权限不足

某些功能需要特定权限，请检查用户角色和权限配置。

### 4. 订阅过期

用户订阅过期时会自动跳转到订阅页面，需要续费后才能继续使用。

## 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 许可证

MIT License
