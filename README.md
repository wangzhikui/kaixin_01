# AI老魁博客

> 通过 Claude + MiniMax2.5 搭建的个人博客

## 简介

这是一个基于 **Vue 3 + Vite** 技术栈开发的个人博客网站，部署于 www.wangdongwei.com。

## 技术方案

| 技术 | 说明 |
|------|------|
| 前端框架 | Vue 3 + Composition API |
| 构建工具 | Vite |
| 路由 | Vue Router |
| Markdown | markdown-it |
| 内容管理 | Notion（数据来源） |
| 版本管理 | Git |
| 部署 | 服务器 Git Hook 自动拉取 |

## 项目结构

```
kaixin_01/
├── src/
│   ├── views/          # 页面组件
│   │   ├── Home.vue           # 首页
│   │   ├── Article.vue        # 文章详情
│   │   └── Navigation.vue     # AI网址导航
│   ├── data/            # 静态数据
│   │   ├── articles.js        # 文章数据
│   │   └── navigation.js      # 网址导航数据
│   ├── router/          # 路由配置
│   ├── style.css       # 全局样式
│   └── main.js         # 入口文件
├── index.html
└── vite.config.js
```

## 本地开发

```bash
# 克隆项目
git clone https://github.com/wangzhikui/kaixin_01.git

# 安装依赖
cd kaixin_01
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

## 部署

服务器通过 Git 自动拉取代码部署：

```bash
# 在服务器克隆项目
git clone https://github.com/wangzhikui/kaixin_01.git

# 安装依赖并构建
cd kaixin_01
npm install
npm run build

# 配置 Nginx 托管 dist 目录
```

## 内容更新

- **文章内容**: 修改 `src/data/articles.js`
- **网址导航**: 修改 `src/data/navigation.js`

##  License

MIT
