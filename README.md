# ITLK - AI 实战笔记 & AI 网址导航

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**在线访问**: [https://www.wangdongwei.com](https://www.wangdongwei.com)

一个现代化的个人网站，集成了 AI 工具推荐、网址导航、AI 实战笔记博客以及智能体对话功能。

## 功能特性

### 公开页面

- **AI 网址导航** (`/navigation`)
  - 收录主流 AI 工具网站
  - 分类浏览，快速搜索
  - 显示网站图标和描述

- **AI 实战笔记** (`/`)
  - 技术博客文章
  - OpenClaw、Claude Code 等工具使用教程
  - AI 应用实践分享

### 管理后台 (`/admin`)

- **数据看板** - 运营数据概览
- **文章管理** - 博客文章 CRUD
- **导航管理** - 网址分类和链接管理
- **套餐管理** - 会员订阅套餐配置（支持月/季/年价格）
- **智能体管理 (EDA HUB)** - AI 智能体配置，支持 Dify API 集成
- **会员管理** - 会员信息管理
- **订阅管理** - 会员订阅记录
- **角色权限** - RBAC 角色权限管理
- **菜单管理** - 动态配置后台菜单

### 智能体对话 (`/hub/chat`)

- 基于 Dify API 的流式对话
- 支持多智能体切换
- Markdown 内容渲染
- 对话历史管理

### 会员服务 (`/user`)

- 手机号登录
- 会员套餐购买
- 个人中心

## 技术栈

| 技术 | 说明 |
|------|------|
| Vue 3 | 渐进式 JavaScript 框架 |
| Vite 7 | 下一代前端构建工具 |
| Vue Router 4 | Vue.js 官方路由管理器 |
| Element Plus | 基于 Vue 3 的组件库 |
| Axios | HTTP 请求库 |
| json-server | REST API Mock 服务器 |
| markdown-it | Markdown 解析渲染 |

## 项目结构

```
src/
├── api/                 # API 接口封装
├── components/          # 公共组件
├── data/              # 静态数据
├── router/            # 路由配置
├── views/
│   ├── admin/        # 管理后台页面
│   │   ├── AdminLayout.vue    # 后台布局
│   │   ├── AdminHome.vue      # 后台首页
│   │   ├── Dashboard.vue     # 数据看板
│   │   ├── ArticleList.vue   # 文章列表
│   │   ├── ArticleEdit.vue   # 文章编辑
│   │   ├── NavigationManager.vue # 导航管理
│   │   ├── PackageManager.vue # 套餐管理
│   │   ├── AgentManager.vue  # 智能体管理
│   │   ├── MemberManager.vue  # 会员管理
│   │   ├── SubscriptionManager.vue # 订阅管理
│   │   ├── RoleManager.vue    # 角色管理
│   │   ├── UserManager.vue    # 用户管理
│   │   └── MenuManager.vue   # 菜单管理
│   ├── hub/          # 智能体对话页面
│   │   ├── HubLayout.vue    # 对话布局
│   │   ├── HubSidebar.vue   # 侧边栏
│   │   └── HubChat.vue      # 聊天界面
│   ├── user/         # 会员相关页面
│   │   ├── Login.vue        # 登录
│   │   ├── Profile.vue      # 个人中心
│   │   └── Pricing.vue      # 套餐价格
│   ├── Home.vue      # 首页/博客
│   ├── Article.vue   # 文章详情
│   └── Navigation.vue # 网址导航
├── App.vue
├── main.js
└── style.css         # 全局样式
```

## 快速开始

### 环境要求

- Node.js >= 18
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 启动 json-server 后端

```bash
npx json-server --watch db.json --port 3001
```

### 构建生产版本

```bash
npm run build
```

## 配置说明

### 环境变量（如需要）

创建 `.env` 文件：

```env
VITE_API_BASE_URL=http://localhost:3001
```

### Dify API 配置

在管理后台的智能体管理中配置：

- **Dify API 地址**: Dify 应用的 API 端点
- **Dify API Key**: 认证密钥
- **对话接口**: 默认 `/chat-messages`
- **文件上传接口**: 默认 `/files/upload`

## 数据库

项目使用 `db.json` 作为 json-server 的数据源，包含以下表：

| 表名 | 说明 |
|------|------|
| articles | 文章 |
| categories | 导航分类 |
| links | 网址链接 |
| packages | 订阅套餐 |
| agents | 智能体 |
| members | 会员 |
| subscriptions | 订阅记录 |
| users | 用户 |
| roles | 角色 |
| menus | 菜单 |
| conversations | 对话 |
| messages | 消息 |

## 许可证

本项目基于 [MIT License](LICENSE) 开源。

## 作者

**ITLK** - [www.wangdongwei.com](https://www.wangdongwei.com)

---

*如果你觉得这个项目有帮助，请给个 Star ⭐*
