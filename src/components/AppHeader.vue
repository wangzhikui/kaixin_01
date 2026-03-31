<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { usersApi } from '../api'

const router = useRouter()
const currentUser = ref(null)
const showUserMenu = ref(false)
const userMenuRef = ref(null)

function goHome() {
  router.push('/')
}

function scrollToSection(sectionId) {
  if (router.currentRoute.value.path !== '/') {
    router.push('/').then(() => {
      setTimeout(() => {
        const element = document.getElementById(sectionId)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    })
  } else {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }
}

function checkUserLogin() {
  const user = usersApi.getCurrentUser()
  if (user) {
    currentUser.value = user
  }
}

function logout() {
  usersApi.logout()
  currentUser.value = null
  showUserMenu.value = false
  router.push('/')
}

function goToProfile() {
  showUserMenu.value = false
  router.push('/user/profile')
}

function goToSubscription() {
  showUserMenu.value = false
  router.push('/user/subscription')
}

function handleClickOutside(event) {
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false
  }
}

onMounted(() => {
  checkUserLogin()
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <nav class="navbar">
    <div class="container nav-content">
      <div class="logo" @click="goHome">
        <div class="dolphin-logo">
          <svg viewBox="0 0 100 100" class="dolphin-svg">
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
            <circle cx="45" cy="75" r="2" fill="#5eead4"/>
            <circle cx="55" cy="75" r="2" fill="#5eead4"/>
            <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                  fill="url(#dolphinGrad)" opacity="0.95"/>
            <circle cx="58" cy="28" r="2.5" fill="#1e1b4b"/>
            <circle cx="59" cy="27" r="1" fill="#fff"/>
          </svg>
        </div>
        <span class="logo-text">EDA365 AI</span>
      </div>
      <div class="nav-links">
        <router-link to="/hub/chat" class="nav-hub">EDA HUB</router-link>
        <a href="javascript:void(0)" @click="scrollToSection('toptools')">AI工具集合</a>
        <a href="javascript:void(0)" @click="scrollToSection('tutorials')">AI实战笔记</a>
        <a href="javascript:void(0)" @click="scrollToSection('navigation')">AI网址导航</a>
        <router-link to="/user/pricing">会员服务</router-link>
        <a href="javascript:void(0)" @click="scrollToSection('about')">关于</a>

        <!-- User logged in -->
        <div v-if="currentUser" ref="userMenuRef" class="user-menu-container">
          <div class="user-avatar" @click.stop="showUserMenu = !showUserMenu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="8" r="4"/>
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
            </svg>
          </div>
          <div v-if="showUserMenu" class="user-dropdown">
            <a href="javascript:void(0)" @click="goToProfile">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-icon">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
              个人中心
            </a>
            <a href="javascript:void(0)" @click="goToSubscription">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-icon">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              我的订阅
            </a>
            <div class="menu-divider"></div>
            <a href="javascript:void(0)" @click="logout" class="logout-item">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="menu-icon">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              退出登录
            </a>
          </div>
        </div>

        <!-- Not logged in -->
        <router-link v-else to="/user/login" class="btn btn-primary nav-btn">登录</router-link>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Navbar - Glassmorphism */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-sm);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.dolphin-logo {
  width: 40px;
  height: 40px;
}

.dolphin-svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links a {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.nav-links a:hover {
  color: var(--color-primary);
}

.nav-hub {
  background: linear-gradient(135deg, #14B8A6, #2DD4BF);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  font-weight: 700;
}

.nav-hub:hover {
  background: linear-gradient(135deg, #0d9488, #14B8A6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-btn {
  padding: 10px 20px;
}

.user-menu-container {
  position: relative;
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
}

.user-avatar svg {
  width: 20px;
  height: 20px;
  color: white;
}

.user-dropdown {
  position: absolute;
  top: calc(100% + 12px);
  right: 0;
  background: white;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--color-border-light);
  min-width: 160px;
  padding: 8px 0;
  z-index: 1001;
}

.user-dropdown::before {
  content: '';
  position: absolute;
  top: -6px;
  right: 16px;
  width: 12px;
  height: 12px;
  background: white;
  border-left: 1px solid var(--color-border-light);
  border-top: 1px solid var(--color-border-light);
  transform: rotate(45deg);
}

.user-dropdown a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  transition: all 0.2s ease;
}

.user-dropdown a:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.menu-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.menu-divider {
  height: 1px;
  background: var(--color-border-light);
  margin: 6px 12px;
}

.logout-item {
  color: #ef4444;
}

.logout-item:hover {
  background: #fef2f2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .nav-links a:not(.nav-btn) {
    display: none;
  }
}
</style>
