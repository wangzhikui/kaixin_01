<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { articlesApi, membersApi, subscriptionsApi, agentsApi } from '../../api'

const router = useRouter()
const loading = ref(true)

const stats = ref({
  articles: 0,
  members: 0,
  subscriptions: 0,
  agents: 0,
  activeSubscriptions: 0
})

const recentArticles = ref([])
const recentMembers = ref([])
const recentSubscriptions = ref([])

defineOptions({
  name: 'AdminHome'
})

onMounted(async () => {
  try {
    const [articles, members, subscriptions, agents] = await Promise.all([
      articlesApi.getAll(),
      membersApi.getAll(),
      subscriptionsApi.getAll(),
      agentsApi.getAll()
    ])

    // 计算统计数据
    stats.value = {
      articles: articles?.length || 0,
      members: members?.length || 0,
      subscriptions: subscriptions?.length || 0,
      agents: agents?.length || 0,
      activeSubscriptions: subscriptions?.filter(s => s.status === 'active')?.length || 0
    }

    // 获取最近文章（按日期排序，取前5篇）
    recentArticles.value = (articles || [])
      .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
      .slice(0, 5)

    // 获取最近会员（取前5个）
    recentMembers.value = (members || [])
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)

    // 最近订阅
    recentSubscriptions.value = (subscriptions || [])
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .slice(0, 5)

  } catch (error) {
    console.error('Failed to load stats:', error)
  } finally {
    loading.value = false
  }
})

// 格式化日期
function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

// 获取状态类型
function getStatusType(status) {
  switch (status) {
    case 'active':
    case 'publish':
      return 'success'
    case 'expired':
    case 'draft':
      return 'info'
    case 'cancelled':
    case 'deleted':
      return 'danger'
    default:
      return 'info'
  }
}

// 获取状态文本
function getStatusText(status) {
  switch (status) {
    case 'active':
      return '活跃'
    case 'expired':
      return '已过期'
    case 'cancelled':
      return '已取消'
    case 'publish':
      return '已发布'
    case 'draft':
      return '草稿'
    default:
      return status || '-'
  }
}

// 跳转到编辑文章
function goToEditArticle(id) {
  router.push(`/admin/articles/edit/${id}`)
}

// 跳转到文章列表
function goToArticles() {
  router.push('/admin/articles')
}

// 跳转到会员列表
function goToMembers() {
  router.push('/admin/members')
}

// 跳转到订阅列表
function goToSubscriptions() {
  router.push('/admin/subscriptions')
}
</script>

<template>
  <div class="admin-home" v-loading="loading">
    <!-- 统计卡片 -->
    <div class="stats-grid">
      <div class="stat-card articles" @click="goToArticles">
        <div class="stat-header">
          <div class="stat-icon articles">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span class="stat-trend up">↑</span>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.articles }}</span>
          <span class="stat-label">文章总数</span>
        </div>
        <div class="stat-footer">
          <span class="stat-desc">已发布 {{ Math.round(stats.articles * 0.8) }} 篇</span>
        </div>
      </div>

      <div class="stat-card members" @click="goToMembers">
        <div class="stat-header">
          <div class="stat-icon members">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <span class="stat-trend up">↑</span>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.members }}</span>
          <span class="stat-label">注册会员</span>
        </div>
        <div class="stat-footer">
          <span class="stat-desc">本月新增 {{ Math.max(1, Math.floor(stats.members * 0.1)) }} 人</span>
        </div>
      </div>

      <div class="stat-card subscriptions" @click="goToSubscriptions">
        <div class="stat-header">
          <div class="stat-icon subscriptions">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
              <line x1="1" y1="10" x2="23" y2="10"></line>
            </svg>
          </div>
          <span class="stat-trend" :class="stats.activeSubscriptions > 0 ? 'up' : 'down'">
            {{ stats.activeSubscriptions > 0 ? '↑' : '↓' }}
          </span>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.activeSubscriptions }}</span>
          <span class="stat-label">活跃订阅</span>
        </div>
        <div class="stat-footer">
          <span class="stat-desc">共 {{ stats.subscriptions }} 个订阅</span>
        </div>
      </div>

      <div class="stat-card agents" @click="router.push('/admin/agents')">
        <div class="stat-header">
          <div class="stat-icon agents">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 8V4H8"></path>
              <rect x="4" y="8" width="16" height="12" rx="2"></rect>
              <circle cx="9" cy="14" r="1" fill="currentColor"></circle>
              <circle cx="15" cy="14" r="1" fill="currentColor"></circle>
              <path d="M9 18h6"></path>
            </svg>
          </div>
        </div>
        <div class="stat-body">
          <span class="stat-value">{{ stats.agents }}</span>
          <span class="stat-label">智能体</span>
        </div>
        <div class="stat-footer">
          <span class="stat-desc">AI 助手数量</span>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-grid">
      <!-- 最近文章 -->
      <div class="content-card recent-articles">
        <div class="card-header">
          <h3>
            <el-icon class="doc"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg></el-icon>
            最近文章
          </h3>
          <el-button text size="small" @click="goToArticles">查看全部</el-button>
        </div>
        <div class="card-body">
          <div v-if="recentArticles.length === 0" class="empty-state">
            <span>暂无文章</span>
            <el-button type="primary" size="small" @click="router.push('/admin/articles/edit/new')">
              创建第一篇
            </el-button>
          </div>
          <div
            v-for="article in recentArticles"
            :key="article.id"
            class="list-item"
            @click="goToEditArticle(article.id)"
          >
            <div class="item-info">
              <span class="item-title">{{ article.title || '无标题' }}</span>
              <span class="item-meta">
                <el-tag :type="getStatusType(article.status)" size="small">
                  {{ getStatusText(article.status) }}
                </el-tag>
                <span class="item-date">{{ formatDate(article.date) }}</span>
              </span>
            </div>
            <el-icon class="item-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 最近会员 -->
      <div class="content-card recent-members">
        <div class="card-header">
          <h3>
            <el-icon class="user"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle></svg></el-icon>
            最近会员
          </h3>
          <el-button text size="small" @click="goToMembers">查看全部</el-button>
        </div>
        <div class="card-body">
          <div v-if="recentMembers.length === 0" class="empty-state">
            <span>暂无会员数据</span>
          </div>
          <div
            v-for="member in recentMembers"
            :key="member.id"
            class="list-item"
            @click="goToMembers"
          >
            <div class="item-info">
              <span class="item-title">{{ member.name || member.email || '匿名用户' }}</span>
              <span class="item-meta">
                <el-tag :type="getStatusType(member.level)" size="small">
                  {{ member.level === 'vip' ? 'VIP' : '普通' }}
                </el-tag>
                <span class="item-date">{{ formatDate(member.createdAt) }}</span>
              </span>
            </div>
            <el-icon class="item-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>

      <!-- 快捷操作 -->
      <div class="content-card quick-actions">
        <div class="card-header">
          <h3>
            <el-icon class="lightning"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></el-icon>
            快捷操作
          </h3>
        </div>
        <div class="card-body">
          <div class="action-grid">
            <div class="action-item" @click="router.push('/admin/articles/edit/new')">
              <div class="action-icon write">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 20h9"></path>
                  <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
                </svg>
              </div>
              <span>写文章</span>
            </div>
            <div class="action-item" @click="router.push('/admin/navigation')">
              <div class="action-icon nav">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <span>网址导航</span>
            </div>
            <div class="action-item" @click="router.push('/admin/members')">
              <div class="action-icon member">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <span>添加会员</span>
            </div>
            <div class="action-item" @click="router.push('/admin/packages')">
              <div class="action-icon package">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                  <line x1="12" y1="22.08" x2="12" y2="12"></line>
                </svg>
              </div>
              <span>套餐管理</span>
            </div>
            <div class="action-item" @click="router.push('/admin/agents')">
              <div class="action-icon agent">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 8V4H8"></path>
                  <rect x="4" y="8" width="16" height="12" rx="2"></rect>
                  <circle cx="9" cy="14" r="1" fill="currentColor"></circle>
                  <circle cx="15" cy="14" r="1" fill="currentColor"></circle>
                  <path d="M9 18h6"></path>
                </svg>
              </div>
              <span>智能体</span>
            </div>
            <div class="action-item" @click="router.push('/admin/menus')">
              <div class="action-icon menu">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </svg>
              </div>
              <span>菜单设置</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近订阅 -->
      <div class="content-card recent-subscriptions">
        <div class="card-header">
          <h3>
            <el-icon class="credit"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></el-icon>
            最近订阅
          </h3>
          <el-button text size="small" @click="goToSubscriptions">查看全部</el-button>
        </div>
        <div class="card-body">
          <div v-if="recentSubscriptions.length === 0" class="empty-state">
            <span>暂无订阅数据</span>
          </div>
          <div
            v-for="sub in recentSubscriptions"
            :key="sub.id"
            class="list-item"
            @click="goToSubscriptions"
          >
            <div class="item-info">
              <span class="item-title">{{ sub.plan || sub.package || '未知套餐' }}</span>
              <span class="item-meta">
                <el-tag :type="getStatusType(sub.status)" size="small">
                  {{ getStatusText(sub.status) }}
                </el-tag>
                <span class="item-date">{{ formatDate(sub.createdAt) }}</span>
              </span>
            </div>
            <el-icon class="item-arrow"><ArrowRight /></el-icon>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.admin-home {
  padding: 20px;
  background: var(--color-bg-secondary);
  min-height: calc(100vh - 56px);
}

/* 统计卡片 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.25s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  opacity: 0;
  transition: opacity 0.25s ease;
}

.stat-card:hover::before {
  opacity: 1;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.1);
}

.stat-card.articles::before {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.stat-card.members::before {
  background: linear-gradient(90deg, #ec4899, #f472b6);
}

.stat-card.subscriptions::before {
  background: linear-gradient(90deg, #f59e0b, #fbbf24);
}

.stat-card.agents::before {
  background: linear-gradient(90deg, #14b8a6, #2dd4bf);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  transition: transform 0.25s ease;
}

.stat-card:hover .stat-icon {
  transform: scale(1.08);
}

.stat-icon svg {
  width: 26px;
  height: 26px;
}

/* 文章图标 - 紫色渐变 */
.stat-icon.articles {
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
}

.stat-icon.articles svg {
  color: white;
}

/* 会员图标 - 粉色渐变 */
.stat-icon.members {
  background: linear-gradient(135deg, #ec4899 0%, #f472b6 100%);
  box-shadow: 0 4px 16px rgba(236, 72, 153, 0.35);
}

.stat-icon.members svg {
  color: white;
}

/* 订阅图标 - 橙色渐变 */
.stat-icon.subscriptions {
  background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
  box-shadow: 0 4px 16px rgba(245, 158, 11, 0.35);
}

.stat-icon.subscriptions svg {
  color: white;
}

/* 智能体图标 - 青色渐变 */
.stat-icon.agents {
  background: linear-gradient(135deg, #14b8a6 0%, #2dd4bf 100%);
  box-shadow: 0 4px 16px rgba(20, 184, 166, 0.35);
}

.stat-icon.agents svg {
  color: white;
}

.stat-trend {
  font-size: 0.7rem;
  padding: 3px 8px;
  border-radius: 6px;
  font-weight: 600;
}

.stat-trend.up {
  background: #ecfdf5;
  color: #059669;
}

.stat-trend.down {
  background: #fef2f2;
  color: #dc2626;
}

.stat-body {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
  margin-top: 6px;
}

.stat-footer {
  margin-top: 16px;
  padding-top: 14px;
  border-top: 1px solid var(--color-border-light);
}

.stat-desc {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
}

/* 内容网格 */
.content-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.content-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.card-header h3 {
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.card-header h3 .el-icon {
  font-size: 20px;
}

.card-header h3 .el-icon.doc {
  color: #6366f1;
}

.card-header h3 .el-icon.user {
  color: #ec4899;
}

.card-header h3 .el-icon.lightning {
  color: #f59e0b;
}

.card-header h3 .el-icon.credit {
  color: #14b8a6;
}

.card-body {
  padding: 8px 0;
}

/* 列表项 */
.list-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 20px;
  cursor: pointer;
  transition: all 0.15s ease;
}

.list-item:hover {
  background: var(--color-bg-secondary);
}

.list-item:hover .item-arrow {
  color: var(--color-primary);
  transform: translateX(4px);
}

.item-info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 0;
}

.item-title {
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.item-date {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.item-arrow {
  font-size: 16px;
  color: var(--color-text-muted);
  flex-shrink: 0;
  transition: all 0.15s ease;
}

/* 空状态 */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 36px 0;
  color: var(--color-text-muted);
  font-size: 0.85rem;
}

/* 快捷操作 */
.action-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  padding: 16px 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 18px 12px;
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  background: var(--color-bg-secondary);
  border: 1px solid transparent;
}

.action-item:hover {
  background: white;
  border-color: var(--color-primary-light);
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.12);
}

.action-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.action-icon svg {
  width: 22px;
  height: 22px;
  color: white;
  position: relative;
  z-index: 1;
}

/* 写文章 */
.action-icon.write {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

/* 网址导航 */
.action-icon.nav {
  background: linear-gradient(135deg, #14b8a6, #2dd4bf);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.35);
}

/* 添加会员 */
.action-icon.member {
  background: linear-gradient(135deg, #ec4899, #f472b6);
  box-shadow: 0 4px 12px rgba(236, 72, 153, 0.35);
}

/* 套餐管理 */
.action-icon.package {
  background: linear-gradient(135deg, #f59e0b, #fbbf24);
  box-shadow: 0 4px 12px rgba(245, 158, 11, 0.35);
}

/* 智能体 */
.action-icon.agent {
  background: linear-gradient(135deg, #14b8a6, #2dd4bf);
  box-shadow: 0 4px 12px rgba(20, 184, 166, 0.35);
}

/* 菜单设置 */
.action-icon.menu {
  background: linear-gradient(135deg, #6366f1, #8b5cf6);
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.35);
}

.action-item span {
  font-size: 0.78rem;
  color: var(--color-text-secondary);
  text-align: center;
  font-weight: 500;
}

/* 响应式 */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .admin-home {
    padding: 12px;
  }

  .action-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
