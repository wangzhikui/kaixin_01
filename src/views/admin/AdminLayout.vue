<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usersApi } from '../../api'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const collapsed = ref(false)
const currentUser = ref(null)
const menus = ref([])
const sidebarWidth = ref(260)
const isResizing = ref(false)

// 图标名称到组件的映射
const iconMap = { ...ElementPlusIconsVue }

// 根据菜单标题关键词映射图标
const keywordIconMap = {
  '首页': 'HomeFilled',
  'home': 'HomeFilled',
  '数据': 'DataAnalysis',
  '看板': 'DataAnalysis',
  'dashboard': 'DataAnalysis',
  '文章': 'Document',
  '文档': 'Document',
  'article': 'Document',
  '导航': 'Guide',
  '链接': 'Link',
  'link': 'Link',
  '导航管理': 'Guide',
  '会员': 'UserFilled',
  '用户': 'User',
  'user': 'User',
  '角色': 'Avatar',
  'role': 'Avatar',
  '订阅': 'Message',
  'package': 'Box',
  '套餐': 'Box',
  '设置': 'Setting',
  'config': 'Setting',
  '管理': 'Management',
  '订阅管理': 'Message',
  '菜单': 'Menu',
  '菜单管理': 'Menu'
}

// 获取图标组件
function getIconComponent(iconName, title) {
  // 1. 尝试直接匹配
  if (iconName && iconMap[iconName]) return iconMap[iconName]

  // 2. 尝试大小写变体
  if (iconName) {
    const capitalized = iconName.charAt(0).toUpperCase() + iconName.slice(1)
    if (iconMap[capitalized]) return iconMap[capitalized]
    // 尝试添加Filled后缀
    if (iconMap[capitalized + 'Filled']) return iconMap[capitalized + 'Filled']
  }

  // 3. 根据标题关键词获取图标
  if (title) {
    return getIconByTitle(title)
  }

  // 4. 默认图标
  return ElementPlusIconsVue['Menu']
}

// 根据菜单标题获取合适的图标
function getIconByTitle(title) {
  if (!title) return ElementPlusIconsVue['Menu']

  // 先看关键词映射
  for (const [keyword, iconName] of Object.entries(keywordIconMap)) {
    if (title.includes(keyword)) {
      return getIconComponent(iconName)
    }
  }

  // 默认
  return ElementPlusIconsVue['Menu']
}

onMounted(async () => {
  // First try to use menus from localStorage (set during login)
  const user = usersApi.getCurrentAdmin()
  if (user && user.menus && user.menus.length > 0) {
    menus.value = filterMenus(user.menus)
    currentUser.value = user
  } else if (!user) {
    router.push('/admin/login')
    return
  }

  // Then refresh from database to get latest menu data
  try {
    const refreshedUser = await usersApi.refreshAdminMenus()
    if (refreshedUser && refreshedUser.menus) {
      menus.value = filterMenus(refreshedUser.menus)
      currentUser.value = refreshedUser
    }
  } catch (error) {
    console.error('Failed to refresh menus:', error)
  }

  // Listen for menu updates from MenuManager
  window.addEventListener('menusUpdated', handleMenusUpdated)

  // Add mouse events for resizing
  document.addEventListener('mousemove', handleMouseMove)
  document.addEventListener('mouseup', handleMouseUp)
})

onUnmounted(() => {
  window.removeEventListener('menusUpdated', handleMenusUpdated)
  document.removeEventListener('mousemove', handleMouseMove)
  document.removeEventListener('mouseup', handleMouseUp)
})

function handleMenusUpdated(event) {
  menus.value = filterMenus(event.detail)
  // Also update localStorage
  const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}')
  adminUser.menus = event.detail
  localStorage.setItem('adminUser', JSON.stringify(adminUser))
}

// Filter out deprecated menus (features management is deprecated, use agents instead)
function filterMenus(menuList) {
  if (!menuList) return []
  // Filter out 'features' key menu as it's deprecated
  return menuList.filter(menu => menu.key !== 'features')
}

function handleLogout() {
  usersApi.logoutAdmin()
  router.push('/admin/login')
}

function isActive(path) {
  return route.path === path
}

function toggleCollapse() {
  collapsed.value = !collapsed.value
}

// Resize handling
function startResize(e) {
  isResizing.value = true
  document.body.style.cursor = 'ew-resize'
  document.body.style.userSelect = 'none'
}

function handleMouseMove(e) {
  if (!isResizing.value) return
  const newWidth = e.clientX
  // Limit width between 200 and 400
  if (newWidth >= 200 && newWidth <= 500) {
    sidebarWidth.value = newWidth
  }
}

function handleMouseUp() {
  if (isResizing.value) {
    isResizing.value = false
    document.body.style.cursor = ''
    document.body.style.userSelect = ''
  }
}
</script>

<template>
  <div class="admin-layout">
    <!-- Sidebar -->
    <aside
      class="sidebar"
      :class="{ collapsed }"
      :style="{ width: collapsed ? '72px' : sidebarWidth + 'px' }"
    >
      <div class="sidebar-header">
        <div class="logo">
          <svg viewBox="0 0 100 100" class="logo-svg">
            <defs>
              <linearGradient id="dolphinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#14B8A6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2DD4BF;stop-opacity:1" />
              </linearGradient>
              <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#14B8A6;stop-opacity:1" />
                <stop offset="100%" style="stop-color:#2DD4BF;stop-opacity:1" />
              </linearGradient>
            </defs>
            <rect x="10" y="40" width="80" height="50" rx="8" fill="url(#chipGrad)" opacity="0.9"/>
            <rect x="15" y="45" width="70" height="40" rx="4" fill="#1e1b4b"/>
            <line x1="25" y1="55" x2="75" y2="55" stroke="#5eead4" stroke-width="1.5" opacity="0.8"/>
            <line x1="25" y1="65" x2="75" y2="65" stroke="#5eead4" stroke-width="1.5" opacity="0.6"/>
            <line x1="25" y1="75" x2="75" y2="75" stroke="#5eead4" stroke-width="1.5" opacity="0.4"/>
            <circle cx="25" cy="55" r="3" fill="#5eead4"/>
            <circle cx="75" cy="55" r="3" fill="#5eead4"/>
            <circle cx="35" cy="65" r="2.5" fill="#5eead4"/>
            <circle cx="65" cy="65" r="2.5" fill="#5eead4"/>
            <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                  fill="url(#dolphinGrad)" opacity="0.95"/>
            <circle cx="58" cy="28" r="2.5" fill="#1e1b4b"/>
            <circle cx="59" cy="27" r="1" fill="#fff"/>
          </svg>
          <span v-if="!collapsed" class="logo-text">EDA365 AI</span>
        </div>
        <button class="collapse-btn" @click="toggleCollapse" :title="collapsed ? '展开' : '收起'">
          <svg v-if="collapsed" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M6 4L11 8L6 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M10 4L5 8L10 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </button>
      </div>

      <nav class="menu">
        <router-link
          v-for="menu in menus"
          :key="menu.key"
          :to="menu.path"
          class="menu-item"
          :class="{ active: isActive(menu.path), collapsed: collapsed }"
          :title="collapsed ? menu.title : ''"
        >
          <span class="menu-icon">
            <el-icon><component :is="getIconComponent(menu.icon, menu.title)" /></el-icon>
          </span>
          <span v-if="!collapsed" class="menu-text">{{ menu.title }}</span>
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <div class="user-info">
          <span v-if="!collapsed" class="user-name">{{ currentUser?.username || '管理员' }}</span>
          <button class="logout-btn" @click="handleLogout" :title="collapsed ? '退出' : ''">
            <el-icon class="logout-icon"><component :is="getIconComponent('SwitchButton')" /></el-icon>
            <span v-if="!collapsed" class="logout-text">退出</span>
          </button>
        </div>
      </div>

      <!-- Resize Handle -->
      <div
        v-if="!collapsed"
        class="resize-handle"
        @mousedown="startResize"
      ></div>
    </aside>

    <!-- Main Content -->
    <div
      class="main-wrapper"
      :class="{ collapsed }"
      :style="{ marginLeft: collapsed ? '72px' : sidebarWidth + 'px' }"
    >
      <!-- Header -->
      <header class="header">
        <div class="header-left">
          <h2 class="page-title">{{ route.meta.title || '管理后台' }}</h2>
        </div>
      </header>

      <!-- Content -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.sidebar {
  background: #fff;
  display: flex;
  flex-direction: column;
  position: fixed;
  height: 100vh;
  z-index: 100;
  transition: width 0.2s;
  overflow: hidden;
}

.sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  /* 移除分隔线 */
  border-bottom: none;
}

/* 折叠状态头部 - 图标居中 */
.sidebar.collapsed .sidebar-header {
  justify-content: center;
  padding: 12px;
  flex-direction: column;
  gap: 8px;
}

.sidebar.collapsed .logo {
  justify-content: center;
}

.sidebar.collapsed .collapse-btn {
  width: 28px;
  height: 28px;
  font-size: 12px;
  opacity: 1;
  background: var(--color-bg-secondary);
}

.sidebar.collapsed .collapse-btn:hover {
  background: var(--color-primary);
  color: white;
}

.logo {
  display: flex;
  align-items: center;
  gap: 10px;
  overflow: hidden;
}

.logo-svg {
  width: 36px;
  height: 36px;
  flex-shrink: 0;
}

.logo-text {
  font-size: 1.2rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  white-space: nowrap;
}

.collapse-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  transition: all 0.2s;
  flex-shrink: 0;
}

.collapse-btn:hover {
  background: var(--color-primary);
  color: white;
}

.menu {
  flex: 1;
  padding: 12px 8px;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: var(--color-text-secondary);
  text-decoration: none;
  border-radius: 8px;
  margin-bottom: 2px;
  transition: all 0.2s ease;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
}

.menu-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.menu-item:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.menu-item.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
}

/* 折叠状态 - 图标居中 */
.menu-item.collapsed {
  justify-content: center;
  padding: 8px;
  margin: 2px 4px;
}

.menu-item.collapsed .menu-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  transition: all 0.2s ease;
}

.menu-item.collapsed .menu-icon .el-icon {
  font-size: 18px;
}

/* 折叠状态激活项 - 图标有背景，整体去除渐变 */
.menu-item.collapsed.active {
  background: transparent;
  color: var(--color-primary);
}

.menu-item.collapsed.active .menu-icon {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
}

.menu-item.collapsed.active .menu-icon .el-icon {
  color: white;
}

.menu-item:not(.collapsed):not(.active):hover .menu-icon {
  background: var(--color-bg-secondary);
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.menu-icon .el-icon {
  font-size: 18px;
}

.menu-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: 12px 8px;
  border-top: 1px solid var(--color-border-light);
}

/* 折叠状态底部栏 */
.sidebar.collapsed .sidebar-footer {
  padding: 12px 8px;
}

.sidebar.collapsed .sidebar-footer .user-info {
  flex-direction: column;
  padding: 8px;
  background: transparent;
  gap: 8px;
}

.sidebar.collapsed .logout-btn {
  width: 40px;
  height: 40px;
  padding: 0;
  border-radius: 10px;
  justify-content: center;
}

.sidebar.collapsed .logout-icon {
  margin: 0;
  font-size: 18px;
}

.user-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  gap: 8px;
  transition: all 0.2s ease;
}

.user-name {
  color: var(--color-text-primary);
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  flex: 1;
  min-width: 0;
}

.logout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 8px 14px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  font-size: 0.8rem;
  flex-shrink: 0;
}

.logout-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

.logout-icon {
  font-size: 16px;
}

.logout-text {
  white-space: nowrap;
}

/* Resize Handle */
.resize-handle {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 6px;
  cursor: ew-resize;
  background: transparent;
  transition: background 0.2s;
}

.resize-handle:hover {
  background: var(--color-primary);
}

/* Main Wrapper */
.main-wrapper {
  flex: 1;
  transition: margin-left 0.2s;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  height: 56px;
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24px;
  position: sticky;
  top: 0;
  z-index: 50;
  box-shadow: var(--shadow-sm);
}

.header-left {
  display: flex;
  align-items: center;
}

.page-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.content {
  flex: 1;
  padding: 0;
}

@media (max-width: 768px) {
  .sidebar {
    width: 72px !important;
  }

  .logo-text,
  .menu-text,
  .user-name,
  .logout-text {
    display: none;
  }

  .main-wrapper {
    margin-left: 72px !important;
  }

  .user-info {
    padding: 8px;
    justify-content: center;
  }

  .resize-handle {
    display: none;
  }
}
</style>
