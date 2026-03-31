<script setup>
import { ref, onMounted, computed } from 'vue'
import { categoriesApi, linksApi } from '../../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const categories = ref([])
const links = ref([])
const loading = ref(true)
const selectedCategory = ref(null)
const searchQuery = ref('')

defineOptions({
  name: 'NavigationManager'
})

async function loadData() {
  loading.value = true
  try {
    const [categoriesData, linksData] = await Promise.all([
      categoriesApi.getAll(),
      linksApi.getAll()
    ])
    categories.value = (categoriesData || []).sort((a, b) => (a.order || 0) - (b.order || 0))
    links.value = linksData || []
    // Select first category by default
    if (categories.value.length > 0) {
      selectedCategory.value = categories.value[0]
    }
  } catch (error) {
    ElMessage.error('加载数据失败')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})

// Get links for selected category
const categoryLinks = computed(() => {
  if (!selectedCategory.value) return []
  const filtered = links.value.filter(link => link.categoryId === selectedCategory.value.id)
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    return filtered.filter(link =>
      link.name?.toLowerCase().includes(query) ||
      link.url?.toLowerCase().includes(query) ||
      link.desc?.toLowerCase().includes(query)
    )
  }
  return filtered.sort((a, b) => (a.order || 0) - (b.order || 0))
})

// Select category
function selectCategory(category) {
  selectedCategory.value = category
  searchQuery.value = ''
}

// Add new category
async function handleAddCategory() {
  try {
    const newCategory = {
      name: '新分类',
      icon: '📁',
      order: categories.value.length + 1
    }
    const result = await categoriesApi.create(newCategory)
    if (result && result.id) {
      const created = { ...newCategory, id: result.id }
      categories.value.push(created)
      selectedCategory.value = created
      ElMessage.success('分类已添加')
    }
  } catch (error) {
    ElMessage.error('添加分类失败')
  }
}

// Update category
async function handleUpdateCategory(category, field, value) {
  if (category[field] === value) return
  try {
    await categoriesApi.update(category.id, { [field]: value })
    category[field] = value
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

// Delete category
async function handleDeleteCategory(category) {
  const linkCount = links.value.filter(l => l.categoryId === category.id).length
  const message = linkCount > 0
    ? `删除分类「${category.name}」将同时删除 ${linkCount} 个链接，确定删除吗？`
    : `确定要删除分类「${category.name}」吗？`

  try {
    await ElMessageBox.confirm(message, '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    // Delete associated links first
    const linksToDelete = links.value.filter(l => l.categoryId === category.id)
    for (const link of linksToDelete) {
      await linksApi.delete(link.id)
    }
    await categoriesApi.delete(category.id)
    links.value = links.value.filter(l => l.categoryId !== category.id)
    categories.value = categories.value.filter(c => c.id !== category.id)
    if (selectedCategory.value?.id === category.id) {
      selectedCategory.value = categories.value[0] || null
    }
    ElMessage.success('已删除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// Add link
async function handleAddLink() {
  if (!selectedCategory.value) return
  try {
    const result = await linksApi.create({
      categoryId: selectedCategory.value.id,
      name: '新链接',
      url: 'https://',
      desc: '',
      order: categoryLinks.value.length + 1
    })
    if (result && result.id) {
      links.value.push({
        categoryId: selectedCategory.value.id,
        name: '新链接',
        url: 'https://',
        desc: '',
        order: categoryLinks.value.length,
        id: result.id
      })
      ElMessage.success('链接已添加')
    }
  } catch (error) {
    ElMessage.error('添加链接失败')
  }
}

// Update link
async function handleUpdateLink(link, field, value) {
  if (link[field] === value) return
  try {
    await linksApi.update(link.id, { [field]: value })
    link[field] = value
  } catch (error) {
    ElMessage.error('更新失败')
  }
}

// Delete link
async function handleDeleteLink(link) {
  try {
    await ElMessageBox.confirm(`确定要删除链接「${link.name}」吗？`, '确认删除', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
    await linksApi.delete(link.id)
    links.value = links.value.filter(l => l.id !== link.id)
    ElMessage.success('已删除')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

// Get favicon
function getFavicon(url) {
  try {
    const domain = new URL(url).origin
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`
  } catch {
    return ''
  }
}
</script>

<template>
  <div class="navigation-manager" v-loading="loading">
    <div class="manager-layout">
      <!-- 左侧分类列表 -->
      <aside class="categories-panel">
        <div class="panel-header">
          <h3>分类</h3>
          <button class="add-btn" @click="handleAddCategory" title="添加分类">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          </button>
        </div>

        <div class="categories-list">
          <div
            v-for="category in categories"
            :key="category.id"
            class="category-item"
            :class="{ active: selectedCategory?.id === category.id }"
            @click="selectCategory(category)"
          >
            <div class="category-info">
              <span class="category-icon">{{ category.icon }}</span>
              <span
                class="category-name"
                contenteditable="true"
                @blur="handleUpdateCategory(category, 'name', $event.target.textContent)"
                @click.stop
              >{{ category.name }}</span>
            </div>
            <div class="category-actions" @click.stop>
              <button
                class="action-btn danger"
                @click="handleDeleteCategory(category)"
                title="删除"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </div>
          </div>

          <div v-if="categories.length === 0" class="empty-categories">
            <p>暂无分类</p>
            <button @click="handleAddCategory">添加分类</button>
          </div>
        </div>
      </aside>

      <!-- 右侧链接列表 -->
      <main class="links-panel">
        <template v-if="selectedCategory">
          <div class="panel-header">
            <div class="header-title">
              <span class="category-icon">{{ selectedCategory.icon }}</span>
              <h3>{{ selectedCategory.name }}</h3>
              <span class="link-count">{{ categoryLinks.length }} 个链接</span>
            </div>
            <div class="header-actions">
              <div class="search-box">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
                <input
                  v-model="searchQuery"
                  type="text"
                  placeholder="搜索链接..."
                />
              </div>
              <button class="add-btn primary" @click="handleAddLink">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="5" x2="12" y2="19"></line>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                </svg>
                添加链接
              </button>
            </div>
          </div>

          <div class="links-grid" v-if="categoryLinks.length > 0">
            <div
              v-for="link in categoryLinks"
              :key="link.id"
              class="link-card"
            >
              <div class="link-header">
                <div class="link-favicon">
                  <img :src="getFavicon(link.url)" :alt="link.name" @error="$event.target.style.display='none'" />
                </div>
                <div class="link-info">
                  <span
                    class="link-name"
                    contenteditable="true"
                    @blur="handleUpdateLink(link, 'name', $event.target.textContent)"
                  >{{ link.name }}</span>
                  <span
                    class="link-url"
                    contenteditable="true"
                    @blur="handleUpdateLink(link, 'url', $event.target.textContent)"
                  >{{ link.url }}</span>
                </div>
                <div class="link-actions">
                  <a :href="link.url" target="_blank" class="action-btn" title="访问">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                      <polyline points="15 3 21 3 21 9"></polyline>
                      <line x1="10" y1="14" x2="21" y2="3"></line>
                    </svg>
                  </a>
                  <button class="action-btn danger" @click="handleDeleteLink(link)" title="删除">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"></polyline>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                    </svg>
                  </button>
                </div>
              </div>
              <input
                type="text"
                class="link-desc"
                :value="link.desc"
                placeholder="添加描述..."
                @change="handleUpdateLink(link, 'desc', $event.target.value)"
              />
            </div>
          </div>

          <div v-else class="empty-links">
            <div class="empty-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <p v-if="searchQuery">没有找到匹配的链接</p>
            <p v-else>暂无链接</p>
            <button v-if="!searchQuery" @click="handleAddLink">添加第一个链接</button>
          </div>
        </template>

        <div v-else class="no-selection">
          <div class="empty-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
            </svg>
          </div>
          <p>选择左侧分类查看链接</p>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.navigation-manager {
  padding: 20px;
  background: var(--color-bg-secondary);
  min-height: calc(100vh - 56px);
}

.manager-layout {
  display: flex;
  gap: 16px;
  height: calc(100vh - 96px);
}

/* 左侧分类面板 */
.categories-panel {
  width: 280px;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--color-border-light);
}

.panel-header h3 {
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-title h3 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-title .category-icon {
  font-size: 20px;
}

.link-count {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  padding: 2px 8px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
}

.categories-list {
  flex: 1;
  overflow-y: auto;
  padding: 8px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  margin-bottom: 4px;
}

.category-item:hover {
  background: var(--color-bg-secondary);
}

.category-item.active {
  background: var(--color-primary-bg);
}

.category-item.active .category-name {
  color: var(--color-primary);
  font-weight: 600;
}

.category-info {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.category-icon {
  font-size: 18px;
  flex-shrink: 0;
}

.category-name {
  font-size: 0.9rem;
  color: var(--color-text-primary);
  outline: none;
  padding: 2px 4px;
  border-radius: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.category-name:focus {
  background: white;
  outline: 2px solid var(--color-primary);
}

.category-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.category-item:hover .category-actions {
  opacity: 1;
}

.category-item.active .category-actions {
  opacity: 1;
}

/* 操作按钮 */
.action-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--color-text-secondary);
  text-decoration: none;
}

.action-btn svg {
  width: 14px;
  height: 14px;
}

.action-btn:hover {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.action-btn.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.add-btn {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s ease;
  color: var(--color-text-secondary);
}

.add-btn svg {
  width: 14px;
  height: 14px;
}

.add-btn:hover {
  background: var(--color-primary-bg);
  color: var(--color-primary);
}

.add-btn.primary {
  width: auto;
  padding: 0 12px;
  gap: 6px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-primary-light));
  color: white;
  font-size: 0.85rem;
}

.add-btn.primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.add-btn.primary svg {
  width: 14px;
  height: 14px;
}

/* 右侧链接面板 */
.links-panel {
  flex: 1;
  background: white;
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.links-panel .panel-header {
  flex-shrink: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

.search-box {
  position: relative;
  width: 180px;
}

.search-box svg {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  width: 14px;
  height: 14px;
  color: var(--color-text-muted);
  pointer-events: none;
}

.search-box input {
  width: 100%;
  padding: 7px 10px 7px 32px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 0.85rem;
  background: var(--color-bg-secondary);
  transition: all 0.2s ease;
}

.search-box input:focus {
  outline: none;
  border-color: var(--color-primary);
  background: white;
}

/* 链接网格 */
.links-grid {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 12px;
  align-content: start;
}

.link-card {
  background: var(--color-bg-secondary);
  border-radius: 10px;
  padding: 14px;
  transition: all 0.15s ease;
}

.link-card:hover {
  background: var(--color-primary-bg);
}

.link-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.link-favicon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.link-favicon img {
  width: 24px;
  height: 24px;
}

.link-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.link-name {
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--color-text-primary);
  outline: none;
  padding: 1px 3px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-name:focus {
  background: white;
  outline: 2px solid var(--color-primary);
}

.link-url {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  outline: none;
  padding: 1px 3px;
  border-radius: 3px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-url:focus {
  background: white;
  outline: 2px solid var(--color-primary);
}

.link-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.15s ease;
}

.link-card:hover .link-actions {
  opacity: 1;
}

.link-desc {
  width: 100%;
  padding: 6px 10px;
  border: none;
  background: white;
  border-radius: 6px;
  font-size: 0.8rem;
  color: var(--color-text-secondary);
  transition: all 0.15s ease;
}

.link-desc:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary);
}

.link-desc::placeholder {
  color: var(--color-text-light);
}

/* 空状态 */
.empty-categories {
  padding: 20px;
  text-align: center;
  color: var(--color-text-muted);
}

.empty-categories p {
  margin: 0 0 10px 0;
  font-size: 0.85rem;
}

.empty-categories button {
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  font-size: 0.85rem;
}

.empty-categories button:hover {
  text-decoration: underline;
}

.empty-links,
.no-selection {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px;
  text-align: center;
  color: var(--color-text-muted);
}

.empty-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-bg-secondary);
  border-radius: 50%;
  margin-bottom: 16px;
}

.empty-icon svg {
  width: 32px;
  height: 32px;
}

.empty-links p,
.no-selection p {
  margin: 0 0 12px 0;
  font-size: 0.9rem;
}

.empty-links button {
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s ease;
}

.empty-links button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

/* 响应式 */
@media (max-width: 900px) {
  .manager-layout {
    flex-direction: column;
    height: auto;
  }

  .categories-panel {
    width: 100%;
    max-height: 300px;
  }

  .links-panel {
    min-height: 400px;
  }
}
</style>
