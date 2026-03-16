<script setup>
import { ref, onMounted } from 'vue'
import { navigationData } from '../data/navigation'

const isVisible = ref(false)
const currentYear = new Date().getFullYear()

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

const activeCategory = ref('overseas-vps')

function scrollToCategory(categoryId) {
  activeCategory.value = categoryId
  const element = document.getElementById(`category-${categoryId}`)
  if (element) {
    const navbarHeight = 70 // 导航栏高度
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - navbarHeight

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }
}

// 监听滚动更新activeCategory
function handleScroll() {
  const sections = navigationData.map(cat => {
    const element = document.getElementById(`category-${cat.id}`)
    if (!element) return null
    return {
      id: cat.id,
      top: element.getBoundingClientRect().top
    }
  }).filter(Boolean)

  for (const section of sections) {
    if (section.top <= 150) {
      activeCategory.value = section.id
    }
  }
}

onMounted(() => {
  // 页面加载时滚动到顶部
  window.scrollTo({ top: 0, behavior: 'auto' })
  window.addEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="nav-page">
    <!-- Navigation Header -->
    <nav class="navbar">
      <div class="container nav-content">
        <div class="logo" @click="$router.push('/'); window.scrollTo({top: 0, behavior: 'smooth'})">
          <div class="dolphin-logo">
            <svg viewBox="0 0 100 100" class="dolphin-svg">
              <defs>
                <linearGradient id="dolphinGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#0099CC;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="chipGrad2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF6700;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#FF8C1A;stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect x="10" y="40" width="80" height="50" rx="8" fill="url(#chipGrad2)" opacity="0.9"/>
              <rect x="15" y="45" width="70" height="40" rx="4" fill="#0f0f23"/>
              <line x1="25" y1="55" x2="75" y2="55" stroke="#00D4FF" stroke-width="1.5" opacity="0.8"/>
              <line x1="25" y1="65" x2="75" y2="65" stroke="#00D4FF" stroke-width="1.5" opacity="0.6"/>
              <line x1="25" y1="75" x2="75" y2="75" stroke="#00D4FF" stroke-width="1.5" opacity="0.4"/>
              <circle cx="25" cy="55" r="3" fill="#00D4FF"/>
              <circle cx="75" cy="55" r="3" fill="#00D4FF"/>
              <circle cx="35" cy="65" r="2.5" fill="#00D4FF"/>
              <circle cx="65" cy="65" r="2.5" fill="#00D4FF"/>
              <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                    fill="url(#dolphinGrad2)" opacity="0.95"/>
              <circle cx="58" cy="28" r="2.5" fill="#0f0f23"/>
              <circle cx="59" cy="27" r="1" fill="#fff"/>
            </svg>
          </div>
          <span class="logo-text">AI老魁</span>
        </div>
        <div class="nav-links">
          <a href="/#tutorials">OpenClaw实战笔记</a>
          <a href="/#navigation">AI网址导航</a>
          <a href="/#about">关于</a>
          <a href="/#contact" class="btn btn-primary nav-btn">联系我</a>
        </div>
      </div>
    </nav>

    <!-- Page Header -->
    <header class="page-header">
      <div class="container">
        <h1 :class="{ visible: isVisible }">AI 网址导航</h1>
        <p :class="{ visible: isVisible }">精选 AI 领域优质网站，一站式获取你需要的学习资源</p>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main-content">
      <div class="container">
        <div class="content-layout">
          <!-- Left Sidebar - Categories -->
          <aside class="sidebar" :class="{ visible: isVisible }">
            <div class="sidebar-sticky">
              <h3>分类导航</h3>
              <ul class="category-list">
                <li
                  v-for="category in navigationData"
                  :key="category.id"
                  :class="{ active: activeCategory === category.id }"
                  @click="scrollToCategory(category.id)"
                >
                  <span class="category-icon">{{ category.icon }}</span>
                  <span class="category-name">{{ category.name }}</span>
                  <span class="category-count">{{ category.sites.length }}</span>
                </li>
              </ul>
            </div>
          </aside>

          <!-- Right Content - Sites -->
          <div class="content-area">
            <div
              v-for="category in navigationData"
              :key="category.id"
              :id="`category-${category.id}`"
              class="category-section"
            >
              <div class="category-title">
                <span class="category-icon">{{ category.icon }}</span>
                <h2>{{ category.name }}</h2>
                <span class="category-badge">{{ category.sites.length }} 个网站</span>
              </div>
              <div class="sites-grid">
                <a
                  v-for="site in category.sites"
                  :key="site.url"
                  :href="site.url"
                  target="_blank"
                  class="site-card"
                >
                  <div class="site-info">
                    <span class="site-name">{{ site.name }}</span>
                    <span class="site-desc">{{ site.desc }}</span>
                  </div>
                  <span class="site-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <p>&copy; {{ currentYear }} AI老魁. All rights reserved.</p>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.nav-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

/* Navbar */
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-light);
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
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-warm));
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
  color: var(--color-accent-primary);
}

.nav-btn {
  padding: 10px 20px;
}

/* Page Header */
.page-header {
  padding: 120px 0 60px;
  background: linear-gradient(135deg, var(--color-bg-primary) 0%, var(--color-bg-secondary) 100%);
  text-align: center;
}

.page-header h1 {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease;
}

.page-header h1.visible {
  opacity: 1;
  transform: translateY(0);
}

.page-header p {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.6s ease 0.1s;
}

.page-header p.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Main Content */
.main-content {
  padding: 40px 0 80px;
}

.content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
}

/* Sidebar */
.sidebar {
  opacity: 0;
  transform: translateX(-20px);
  transition: all 0.6s ease 0.2s;
}

.sidebar.visible {
  opacity: 1;
  transform: translateX(0);
}

.sidebar-sticky {
  position: sticky;
  top: 100px;
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border-light);
}

.sidebar-sticky h3 {
  font-size: 1rem;
  color: var(--color-text-muted);
  margin-bottom: 16px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.category-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-base);
}

.category-list li:hover {
  background: rgba(255, 103, 0, 0.1);
}

.category-list li.active {
  background: var(--color-accent-primary);
  color: white;
}

.category-list li .category-icon {
  font-size: 18px;
}

.category-list li .category-name {
  flex: 1;
  font-weight: 500;
  font-size: 0.95rem;
}

.category-list li .category-count {
  font-size: 0.75rem;
  padding: 2px 8px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50px;
}

.category-list li:not(.active) .category-count {
  background: var(--color-bg-secondary);
  color: var(--color-text-muted);
}

/* Content Area */
.content-area {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.category-section {
  background: white;
  border-radius: var(--radius-lg);
  padding: 32px;
  border: 1px solid var(--color-border-light);
}

.category-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.category-title .category-icon {
  font-size: 28px;
}

.category-title h2 {
  flex: 1;
  font-size: 1.5rem;
  margin: 0;
}

.category-badge {
  font-size: 0.8rem;
  padding: 4px 12px;
  background: rgba(255, 103, 0, 0.1);
  color: var(--color-accent-primary);
  border-radius: 50px;
  font-weight: 500;
}

.sites-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.site-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
  border: 1px solid transparent;
}

.site-card:hover {
  background: white;
  border-color: var(--color-accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.site-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.site-name {
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 1rem;
}

.site-desc {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.site-arrow {
  font-size: 1.25rem;
  color: var(--color-accent-primary);
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-base);
}

.site-card:hover .site-arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Footer */
.footer {
  background: var(--color-text-primary);
  color: white;
  padding: 32px 0;
  text-align: center;
}

.footer p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 1024px) {
  .content-layout {
    grid-template-columns: 220px 1fr;
  }

  .sites-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .content-layout {
    grid-template-columns: 1fr;
  }

  .sidebar {
    position: static;
    opacity: 1;
    transform: none;
  }

  .sidebar-sticky {
    position: static;
    display: flex;
    flex-direction: column;
  }

  .category-list {
    flex-direction: row;
    flex-wrap: wrap;
    gap: 8px;
  }

  .category-list li {
    padding: 8px 12px;
  }

  .category-count {
    display: none;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .sites-grid {
    grid-template-columns: 1fr;
  }
}
</style>
