import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Article from '../views/Article.vue'
import Navigation from '../views/Navigation.vue'
import NotFound from '../views/NotFound.vue'

// Admin imports
import AdminLayout from '../views/admin/AdminLayout.vue'
import AdminHome from '../views/admin/AdminHome.vue'
import Dashboard from '../views/admin/Dashboard.vue'
import AdminLogin from '../views/admin/Login.vue'
import ArticleList from '../views/admin/ArticleList.vue'
import ArticleEdit from '../views/admin/ArticleEdit.vue'
import NavigationManager from '../views/admin/NavigationManager.vue'
import RoleManager from '../views/admin/RoleManager.vue'
import UserManager from '../views/admin/UserManager.vue'
import PackageManager from '../views/admin/PackageManager.vue'
import FeatureManager from '../views/admin/FeatureManager.vue'
import MemberManager from '../views/admin/MemberManager.vue'
import AgentManager from '../views/admin/AgentManager.vue'
import SubscriptionManager from '../views/admin/SubscriptionManager.vue'
import MenuManager from '../views/admin/MenuManager.vue'

// Hub imports
import HubLayout from '../views/hub/HubLayout.vue'
import HubChat from '../views/hub/HubChat.vue'

// User imports
import UserLogin from '../views/user/Login.vue'
import UserProfile from '../views/user/Profile.vue'
import Pricing from '../views/user/Pricing.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/article/:id',
    name: 'Article',
    component: Article
  },
  {
    path: '/navigation',
    name: 'Navigation',
    component: Navigation
  },

  // Admin routes
  {
    path: '/admin/login',
    name: 'AdminLogin',
    component: AdminLogin
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      {
        path: 'home',
        name: 'AdminHome',
        component: AdminHome,
        meta: { title: '首页' }
      },
      {
        path: 'dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { title: '数据看板' }
      },
      {
        path: 'articles',
        name: 'ArticleList',
        component: ArticleList,
        meta: { title: '文章管理' }
      },
      {
        path: 'articles/edit/:id',
        name: 'ArticleEdit',
        component: ArticleEdit,
        meta: { title: '编辑文章' }
      },
      {
        path: 'navigation',
        name: 'NavigationManager',
        component: NavigationManager,
        meta: { title: '导航管理' }
      },
      {
        path: 'roles',
        name: 'RoleManager',
        component: RoleManager,
        meta: { title: '角色管理' }
      },
      {
        path: 'users',
        name: 'UserManager',
        component: UserManager,
        meta: { title: '用户管理' }
      },
      {
        path: 'packages',
        name: 'PackageManager',
        component: PackageManager,
        meta: { title: '套餐管理' }
      },
      {
        path: 'features',
        name: 'FeatureManager',
        component: FeatureManager,
        meta: { title: '功能管理' }
      },
      {
        path: 'members',
        name: 'MemberManager',
        component: MemberManager,
        meta: { title: '会员管理' }
      },
      {
        path: 'subscriptions',
        name: 'SubscriptionManager',
        component: SubscriptionManager,
        meta: { title: '订阅管理' }
      },
      {
        path: 'menus',
        name: 'MenuManager',
        component: MenuManager,
        meta: { title: '菜单管理' }
      },
      {
        path: 'agents',
        name: 'AgentManager',
        component: AgentManager,
        meta: { title: '智能体管理' }
      }
    ]
  },

  // Hub routes - AI Chat
  {
    path: '/hub',
    component: HubLayout,
    children: [
      {
        path: 'chat',
        name: 'HubChat',
        component: HubChat
      },
      {
        path: '',
        redirect: '/hub/chat'
      }
    ]
  },

  // User routes
  {
    path: '/user/login',
    name: 'UserLogin',
    component: UserLogin
  },
  {
    path: '/user/profile',
    name: 'UserProfile',
    component: UserProfile
  },
  {
    path: '/user/subscription',
    name: 'UserSubscription',
    component: UserProfile
  },
  {
    path: '/user/pricing',
    name: 'Pricing',
    component: Pricing
  },

  // Not found
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFound
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  }
})

export default router
