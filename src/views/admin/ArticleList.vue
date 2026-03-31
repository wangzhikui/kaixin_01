<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { articlesApi, articleCategoriesApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const router = useRouter()
const articles = ref([])
const allCategories = ref([])
const loading = ref(true)
const searchQuery = ref('')
const selectedCategories = ref([])
const activeTab = ref('all')

defineOptions({
  name: 'ArticleList'
})

async function loadData() {
  loading.value = true
  try {
    const [articlesData, categoriesData] = await Promise.all([
      articlesApi.getAll(),
      articleCategoriesApi.getAll()
    ])
    articles.value = articlesData || []
    allCategories.value = categoriesData || []
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// 统计数据
const stats = computed(() => {
  const total = articles.value.length
  const published = articles.value.filter(a => a.status === 'publish').length
  const drafts = total - published
  return { total, published, drafts }
})

// 获取所有文章中实际使用的分类
const articleCategories = computed(() => {
  const cats = new Set()
  articles.value.forEach(a => {
    if (a.categories && Array.isArray(a.categories)) {
      a.categories.forEach(c => cats.add(c))
    } else if (a.category) {
      cats.add(a.category)
    }
  })
  return [...cats].sort()
})

// 过滤后的分类列表（只显示文章中实际使用的）
const filterCategories = computed(() => {
  return allCategories.value.filter(cat => articleCategories.value.includes(cat.name))
})

// 获取文章的分类名称列表
function getArticleCategories(article) {
  if (article.categories && Array.isArray(article.categories)) {
    return article.categories
  }
  return article.category ? [article.category] : []
}

// 切换分类筛选
function toggleCategoryFilter(catName) {
  const index = selectedCategories.value.indexOf(catName)
  if (index === -1) {
    selectedCategories.value.push(catName)
  } else {
    selectedCategories.value.splice(index, 1)
  }
}

// 判断分类是否被选中
function isCategorySelected(catName) {
  return selectedCategories.value.includes(catName)
}

// 清除筛选
function clearFilter() {
  selectedCategories.value = []
  activeTab.value = 'all'
}

// 切换状态标签
function setTab(tab) {
  activeTab.value = tab
  selectedCategories.value = []
}

function handlePreview(article) {
  router.push(`/article/${article.id}`)
}

function handleEdit(article) {
  router.push(`/admin/articles/edit/${article.id}`)
}

async function handleDelete(article) {
  try {
    await ElMessageBox.confirm('确定要删除这篇文章吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await articlesApi.delete(article.id)
    ElMessage.success('删除成功')
    loadData()
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

function handleAdd() {
  router.push('/admin/articles/edit/new')
}

// 过滤文章
const filteredArticles = computed(() => {
  let result = articles.value

  // 状态筛选
  if (activeTab.value === 'published') {
    result = result.filter(a => a.status === 'publish')
  } else if (activeTab.value === 'drafts') {
    result = result.filter(a => a.status !== 'publish')
  }

  // 分类筛选
  if (selectedCategories.value.length > 0) {
    result = result.filter(a => {
      const cats = getArticleCategories(a)
      return selectedCategories.value.some(sc => cats.includes(sc))
    })
  }

  // 搜索筛选
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      a.title?.toLowerCase().includes(query) ||
      a.filename?.toLowerCase().includes(query)
    )
  }

  return result
})

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}
</script>

<template>
  <div class="article-list" v-loading="loading">
    <!-- 顶部区域 -->
    <div class="list-header">
      <!-- 标题和统计 -->
      <div class="header-top">
        <div class="stats-pills">
          <span class="stat-pill" :class="{ active: activeTab === 'all' }" @click="setTab('all')">
            全部 <em>{{ stats.total }}</em>
          </span>
          <span class="stat-pill published" :class="{ active: activeTab === 'published' }" @click="setTab('published')">
            已发布 <em>{{ stats.published }}</em>
          </span>
          <span class="stat-pill drafts" :class="{ active: activeTab === 'drafts' }" @click="setTab('drafts')">
            草稿 <em>{{ stats.drafts }}</em>
          </span>
        </div>

        <div class="header-actions">
          <div class="search-wrap">
            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="搜索文章..."
            />
          </div>
          <button type="primary" class="add-btn" @click="handleAdd">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            新建文章
          </button>
        </div>
      </div>

      <!-- 分类筛选 -->
      <div class="filter-section" v-if="filterCategories.length > 0">
        <div class="filter-tags">
          <span
            class="filter-tag"
            :class="{ active: selectedCategories.length === 0 }"
            @click="selectedCategories = []"
          >
            全部
          </span>
          <span
            v-for="cat in filterCategories"
            :key="cat.id"
            class="filter-tag"
            :class="{ active: isCategorySelected(cat.name) }"
            @click="toggleCategoryFilter(cat.name)"
          >
            {{ cat.icon }} {{ cat.name }}
          </span>
        </div>
      </div>
    </div>

    <!-- 结果统计 -->
    <div class="result-bar" v-if="!loading">
      <span class="result-count">
        共 <strong>{{ filteredArticles.length }}</strong> 篇
        <template v-if="selectedCategories.length > 0 || activeTab !== 'all'">
          （已筛选）
        </template>
      </span>
      <span v-if="selectedCategories.length > 0 || activeTab !== 'all'" class="clear-btn" @click="clearFilter">
        清除筛选
      </span>
    </div>

    <!-- 卡片列表 -->
    <div class="articles-grid" v-if="filteredArticles.length > 0">
      <div
        v-for="article in filteredArticles"
        :key="article.id"
        class="article-card"
      >
        <div class="card-header">
          <div class="card-meta">
            <span class="status-badge" :class="article.status">
              {{ article.status === 'publish' ? '已发布' : '草稿' }}
            </span>
            <span class="card-date">{{ formatDate(article.date) }}</span>
          </div>
          <div class="card-actions">
            <button class="icon-btn" title="预览" @click="handlePreview(article)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                <circle cx="12" cy="12" r="3"></circle>
              </svg>
            </button>
            <button class="icon-btn" title="编辑" @click="handleEdit(article)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
            </button>
            <button class="icon-btn danger" title="删除" @click="handleDelete(article)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"></polyline>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
              </svg>
            </button>
          </div>
        </div>

        <h3 class="card-title">{{ article.title || '无标题' }}</h3>

        <!-- 文章分类标签 -->
        <div class="card-categories" v-if="getArticleCategories(article).length > 0">
          <span
            v-for="cat in getArticleCategories(article)"
            :key="cat"
            class="card-category-tag"
          >
            {{ cat }}
          </span>
        </div>

        <p class="card-excerpt">{{ article.excerpt || '暂无摘要' }}</p>

        <div class="card-footer">
          <span class="read-time">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ article.readTime || '1 min' }}
          </span>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
        </svg>
      </div>
      <h3>暂无文章</h3>
      <p>开始创作你的第一篇文章吧</p>
      <el-button type="primary" @click="handleAdd">创建文章</el-button>
    </div>
  </div>
</template>

<style scoped>
.article-list {
  padding: 20px;
  background: var(--color-bg-secondary);
  min-height: calc(100vh - 56px);
}

/* 顶部区域 */
.list-header {
  background: white;
  border-radius: 16px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
}

.header-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* 统计药丸 */
.stats-pills {
  display: flex;
  gap: 6px;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 12px;
  background: var(--color-bg-secondary);
  border-radius: 16px;
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-pill em {
  font-style: normal;
  font-weight: 600;
  color: var(--color-text-primary);
}

.stat-pill:hover {
  background: var(--color-primary-bg);
}

.stat-pill.active {
  background: var(--color-primary);
  color: white;
}

.stat-pill.active em {
  color: white;
}

.stat-pill.published.active {
  background: #10b981;
}

.stat-pill.drafts.active {
  background: #f59e0b;
}

/* 新建按钮 */
.add-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  border: none;
  border-radius: 8px;
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-btn svg {
  width: 16px;
  height: 16px;
}

.add-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* 搜索框 */
.search-wrap {
  position: relative;
  width: 240px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-input {
  width: 100%;
  padding: 9px 12px 9px 38px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 0.85rem;
  background: var(--color-bg-secondary);
  transition: all 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

/* 分类筛选 */
.filter-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 14px;
  background: var(--color-bg-secondary);
  border: 1px solid transparent;
  border-radius: 16px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.filter-tag.active {
  background: var(--color-primary-bg);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 结果统计栏 */
.result-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding: 0 4px;
}

.result-count {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.result-count strong {
  color: var(--color-text-primary);
  font-weight: 600;
}

.clear-btn {
  font-size: 0.8rem;
  color: var(--color-primary);
  cursor: pointer;
}

.clear-btn:hover {
  text-decoration: underline;
}

/* 卡片网格 */
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
}

.article-card {
  background: white;
  border-radius: 14px;
  padding: 20px;
  border: 1px solid var(--color-border-light);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.article-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.1);
  transform: translateY(-2px);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.card-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-badge {
  display: inline-flex;
  padding: 3px 10px;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 500;
}

.status-badge.publish,
.status-badge.published {
  background: rgba(16, 185, 129, 0.12);
  color: #10b981;
}

.status-badge.draft {
  background: rgba(245, 158, 11, 0.12);
  color: #f59e0b;
}

.card-date {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.card-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.article-card:hover .card-actions {
  opacity: 1;
}

.icon-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-btn svg {
  width: 16px;
  height: 16px;
  color: var(--color-text-secondary);
}

.icon-btn:hover {
  background: var(--color-primary-bg);
}

.icon-btn:hover svg {
  color: var(--color-primary);
}

.icon-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
}

.icon-btn.danger:hover svg {
  color: #ef4444;
}

.card-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 卡片分类标签 */
.card-categories {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 12px;
}

.card-category-tag {
  display: inline-block;
  padding: 3px 10px;
  background: var(--color-primary-bg);
  color: var(--color-primary);
  border-radius: 12px;
  font-size: 0.72rem;
  font-weight: 500;
}

.card-excerpt {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.5;
  flex-grow: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  align-items: center;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light);
}

.read-time {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.read-time svg {
  width: 14px;
  height: 14px;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  text-align: center;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border-radius: 50%;
  margin-bottom: 20px;
}

.empty-icon svg {
  width: 40px;
  height: 40px;
  color: var(--color-text-muted);
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 1.1rem;
  color: var(--color-text-primary);
}

.empty-state p {
  margin: 0 0 20px 0;
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

/* 响应式 */
@media (max-width: 768px) {
  .header-top {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .page-title {
    font-size: 1.25rem;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .card-actions {
    opacity: 1;
  }
}
</style>
