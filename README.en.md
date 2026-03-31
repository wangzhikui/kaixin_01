# ITLK - AI Practical Notes & AI Navigation

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

**Live Demo**: [https://www.wangdongwei.com](https://www.wangdongwei.com)

A modern personal website integrating AI tools recommendations, web navigation, AI practical notes blog, and intelligent agent chat functionality.

## Features

### Public Pages

- **AI Web Navigation** (`/navigation`)
  - Curated collection of popular AI tool websites
  - Browse by category, quick search
  - Display website icons and descriptions

- **AI Practical Notes** (`/`)
  - Technical blog articles
  - Tutorials for OpenClaw, Claude Code and other tools
  - AI application practice sharing

### Admin Panel (`/admin`)

- **Dashboard** - Business overview
- **Article Management** - Blog CRUD operations
- **Navigation Management** - Category and link management
- **Package Management** - Subscription tier configuration (monthly/quarterly/yearly pricing)
- **Agent Management (EDA HUB)** - AI agent configuration with Dify API integration
- **Member Management** - Member information
- **Subscription Management** - Subscription records
- **Role Management** - RBAC role permissions
- **Menu Management** - Dynamic admin menu configuration

### Intelligent Agent Chat (`/hub/chat`)

- Streaming chat powered by Dify API
- Multi-agent switching support
- Markdown content rendering
- Chat history management

### Member Services (`/user`)

- Phone number login
- Subscription purchase
- Personal profile

## Tech Stack

| Technology | Description |
|------------|------------|
| Vue 3 | Progressive JavaScript framework |
| Vite 7 | Next generation frontend build tool |
| Vue Router 4 | Official Vue.js routing |
| Element Plus | Vue 3 UI component library |
| Axios | HTTP request library |
| json-server | REST API mock server |
| markdown-it | Markdown parser and renderer |

## Project Structure

```
src/
├── api/                 # API interface封装
├── components/          # Shared components
├── data/              # Static data
├── router/            # Route configuration
├── views/
│   ├── admin/        # Admin panel pages
│   │   ├── AdminLayout.vue    # Admin layout
│   │   ├── AdminHome.vue      # Admin home
│   │   ├── Dashboard.vue     # Data dashboard
│   │   ├── ArticleList.vue   # Article list
│   │   ├── ArticleEdit.vue   # Article edit
│   │   ├── NavigationManager.vue # Navigation manager
│   │   ├── PackageManager.vue # Package manager
│   │   ├── AgentManager.vue  # Agent manager
│   │   ├── MemberManager.vue  # Member manager
│   │   ├── SubscriptionManager.vue # Subscription manager
│   │   ├── RoleManager.vue    # Role manager
│   │   ├── UserManager.vue    # User manager
│   │   └── MenuManager.vue   # Menu manager
│   ├── hub/          # Agent chat pages
│   │   ├── HubLayout.vue    # Chat layout
│   │   ├── HubSidebar.vue   # Sidebar
│   │   └── HubChat.vue      # Chat interface
│   ├── user/         # Member pages
│   │   ├── Login.vue        # Login
│   │   ├── Profile.vue      # Profile
│   │   └── Pricing.vue      # Pricing plans
│   ├── Home.vue      # Home/Blog
│   ├── Article.vue   # Article detail
│   └── Navigation.vue # Web navigation
├── App.vue
├── main.js
└── style.css         # Global styles
```

## Quick Start

### Requirements

- Node.js >= 18
- npm or yarn

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

### Start json-server Backend

```bash
npx json-server --watch db.json --port 3001
```

### Build for Production

```bash
npm run build
```

## Configuration

### Environment Variables (if needed)

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:3001
```

### Dify API Configuration

Configure in admin panel's Agent Management:

- **Dify API URL**: Dify application endpoint
- **Dify API Key**: Authentication key
- **Chat Endpoint**: Default `/chat-messages`
- **File Upload Endpoint**: Default `/files/upload`

## Database

The project uses `db.json` as json-server data source with the following tables:

| Table | Description |
|-------|-------------|
| articles | Blog articles |
| categories | Navigation categories |
| links | Website links |
| packages | Subscription packages |
| agents | AI agents |
| members | Members |
| subscriptions | Subscription records |
| users | Users |
| roles | Roles |
| menus | Menus |
| conversations | Conversations |
| messages | Messages |

## License

This project is open source under [MIT License](LICENSE).

## Author

**ITLK** - [www.wangdongwei.com](https://www.wangdongwei.com)

---

*If you find this project helpful, please give it a Star ⭐*
