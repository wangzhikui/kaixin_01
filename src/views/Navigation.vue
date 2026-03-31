<script setup>
import { ref, onMounted, computed } from 'vue'
import { categoriesApi, linksApi } from '../api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const isVisible = ref(false)
const currentYear = new Date().getFullYear()
const categories = ref([])
const links = ref([])
const loading = ref(true)

onMounted(async () => {
  try {
    const [catsData, linksData] = await Promise.all([
      categoriesApi.getAll(),
      linksApi.getAll()
    ])
    categories.value = (catsData || []).sort((a, b) => (a.order || 0) - (b.order || 0))
    links.value = linksData || []
    // 设置初始选中分类
    if (categories.value.length > 0) {
      activeCategory.value = categories.value[0].id
    }
  } catch (error) {
    console.error('Failed to load navigation data:', error)
  }
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

// 构建带链接的分类数据
const navigationData = computed(() => {
  return categories.value.map(cat => ({
    ...cat,
    sites: links.value.filter(link => link.categoryId === cat.id).sort((a, b) => (a.order || 0) - (b.order || 0))
  }))
})

const activeCategory = ref('')

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
  if (!categories.value.length) return
  const sections = categories.value.map(cat => {
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
    <AppHeader />

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
    <AppFooter />
  </div>
</template>

<style scoped>
.nav-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

/* Main Content */
.main-content {
  padding: 100px 0 80px;
}

.content-layout {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 40px;
  padding-top: 20px;
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
  transition: all 0.2s ease;
}

.category-list li:hover {
  background: rgba(79, 70, 229, 0.1);
}

.category-list li:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.category-list li.active {
  background: var(--color-primary);
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
  background: rgba(79, 70, 229, 0.1);
  color: var(--color-primary);
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
  transition: all 0.2s ease;
  border: 1px solid transparent;
  cursor: pointer;
}

.site-card:hover {
  background: white;
  border-color: var(--color-primary);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.1);
}

.site-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
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
  color: var(--color-primary);
  opacity: 0;
  transform: translateX(-10px);
  transition: var(--transition-base);
}

.site-card:hover .site-arrow {
  opacity: 1;
  transform: translateX(0);
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
