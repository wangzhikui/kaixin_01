<script setup>
import { ref, onMounted } from 'vue'
import { articlesApi, membersApi, subscriptionsApi, packagesApi, usersApi } from '../../api'
import { ElCard } from 'element-plus'

const loading = ref(true)
const stats = ref({
  totalMembers: 0,
  activeSubscriptions: 0,
  totalArticles: 0,
  totalPackages: 0,
  totalAgents: 20,
  todayNewMembers: 0,
  todayNewSubscriptions: 0
})

const memberGrowth = ref([])
const subscriptionDistribution = ref([])
const recentSubscriptions = ref([])

defineOptions({
  name: 'Dashboard'
})

onMounted(async () => {
  loading.value = true
  try {
    await Promise.all([
      loadStats()
    ])
  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
})

async function loadStats() {
  try {
    const [members, subscriptions, articles, packages] = await Promise.all([
      membersApi.getAll(),
      subscriptionsApi.getAll(),
      articlesApi.getAll(),
      packagesApi.getAll()
    ])

    // Basic stats
    stats.value.totalMembers = members.length || 0
    stats.value.totalArticles = articles.length || 0
    stats.value.totalPackages = packages.length || 0

    // Active subscriptions
    const activeSubs = subscriptions.filter(s => s.status === 'active')
    stats.value.activeSubscriptions = activeSubs.length || 0

    // Today's new members
    const today = new Date().toDateString()
    stats.value.todayNewMembers = members.filter(m => {
      return m.registerTime && new Date(m.registerTime).toDateString() === today
    }).length

    // Today's new subscriptions
    stats.value.todayNewSubscriptions = activeSubs.filter(s => {
      return s.createdAt && new Date(s.createdAt).toDateString() === today
    }).length

    // Recent subscriptions (last 5)
    recentSubscriptions.value = subscriptions
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)

    // Package distribution
    const packageCounts = {}
    activeSubs.forEach(sub => {
      const pkg = packages.find(p => p.id === sub.packageId)
      const name = pkg ? pkg.name : '未知'
      packageCounts[name] = (packageCounts[name] || 0) + 1
    })
    subscriptionDistribution.value = Object.entries(packageCounts).map(([name, value]) => ({
      name,
      value
    }))

    // Member growth (simulated - in production would track by date)
    memberGrowth.value = [
      { month: '1月', value: Math.floor(members.length * 0.6) },
      { month: '2月', value: Math.floor(members.length * 0.8) },
      { month: '3月', value: Math.floor(members.length * 0.9) },
      { month: '4月', value: Math.floor(members.length * 0.95) },
      { month: '5月', value: Math.floor(members.length * 0.98) },
      { month: '6月', value: members.length }
    ]
  } catch (error) {
    console.error('Error loading stats:', error)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}
</script>

<template>
  <div class="dashboard" v-loading="loading">
    <!-- Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card primary">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalMembers }}</span>
          <span class="stat-label">会员总数</span>
        </div>
        <div class="stat-badge success">+{{ stats.todayNewMembers }} 今日</div>
      </div>

      <div class="stat-card success">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.activeSubscriptions }}</span>
          <span class="stat-label">活跃订阅</span>
        </div>
        <div class="stat-badge info">+{{ stats.todayNewSubscriptions }} 今日</div>
      </div>

      <div class="stat-card warning">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
            <polyline points="10 9 9 9 8 9"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalArticles }}</span>
          <span class="stat-label">文章总数</span>
        </div>
      </div>

      <div class="stat-card info">
        <div class="stat-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="3"/>
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.33A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.33A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.33a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.33a1.65 1.65 0 0 0-1.51 1z"/>
          </svg>
        </div>
        <div class="stat-content">
          <span class="stat-value">{{ stats.totalAgents }}</span>
          <span class="stat-label">AI智能体</span>
        </div>
      </div>
    </div>

    <!-- Charts Row -->
    <div class="charts-row">
      <!-- Subscription Distribution -->
      <div class="chart-card">
        <h3>订阅套餐分布</h3>
        <div class="distribution-list">
          <div
            v-for="(item, index) in subscriptionDistribution"
            :key="index"
            class="distribution-item"
          >
            <div class="distribution-info">
              <span class="distribution-name">{{ item.name }}</span>
              <span class="distribution-count">{{ item.value }} 个</span>
            </div>
            <div class="distribution-bar">
              <div
                class="distribution-fill"
                :style="{ width: `${(item.value / stats.activeSubscriptions) * 100}%` }"
              ></div>
            </div>
          </div>
          <div v-if="subscriptionDistribution.length === 0" class="empty-data">
            暂无数据
          </div>
        </div>
      </div>

      <!-- Recent Subscriptions -->
      <div class="chart-card">
        <h3>最新订阅</h3>
        <div class="recent-list">
          <div
            v-for="sub in recentSubscriptions"
            :key="sub.id"
            class="recent-item"
          >
            <div class="recent-info">
              <span class="recent-user">{{ sub.packageName || '未知套餐' }}</span>
              <span class="recent-date">{{ formatDate(sub.createdAt) }}</span>
            </div>
            <div class="recent-status" :class="sub.status">
              {{ sub.status === 'active' ? '生效中' : '已过期' }}
            </div>
          </div>
          <div v-if="recentSubscriptions.length === 0" class="empty-data">
            暂无订阅记录
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h3>快捷操作</h3>
      <div class="actions-grid">
        <router-link to="/admin/members" class="action-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
          </svg>
          <span>会员管理</span>
        </router-link>
        <router-link to="/admin/subscriptions" class="action-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="4" width="18" height="18" rx="2"/>
            <path d="M16 2v4M8 2v4M3 10h18"/>
          </svg>
          <span>订阅管理</span>
        </router-link>
        <router-link to="/admin/packages" class="action-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8"/>
            <path d="M12 18V6"/>
          </svg>
          <span>套餐管理</span>
        </router-link>
        <router-link to="/admin/articles" class="action-card">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14 2 14 8 20 8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
          <span>文章管理</span>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard {
  padding: 20px;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  position: relative;
  border: 1px solid var(--color-border-light);
}

.stat-card.primary {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.1), rgba(99, 102, 241, 0.05));
  border-color: rgba(99, 102, 241, 0.2);
}

.stat-card.success {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05));
  border-color: rgba(16, 185, 129, 0.2);
}

.stat-card.warning {
  background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(245, 158, 11, 0.05));
  border-color: rgba(245, 158, 11, 0.2);
}

.stat-card.info {
  background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(14, 165, 233, 0.05));
  border-color: rgba(14, 165, 233, 0.2);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.primary .stat-icon {
  background: rgba(99, 102, 241, 0.15);
  color: var(--color-primary);
}

.stat-card.success .stat-icon {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.stat-card.warning .stat-icon {
  background: rgba(245, 158, 11, 0.15);
  color: #f59e0b;
}

.stat-card.info .stat-icon {
  background: rgba(14, 165, 233, 0.15);
  color: #0ea5e9;
}

.stat-icon svg {
  width: 24px;
  height: 24px;
}

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text-primary);
  line-height: 1;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.stat-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.stat-badge.success {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.stat-badge.info {
  background: rgba(14, 165, 233, 0.15);
  color: #0ea5e9;
}

/* Charts Row */
.charts-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.chart-card {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-light);
}

.chart-card h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

/* Distribution List */
.distribution-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.distribution-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.distribution-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.distribution-name {
  font-size: 0.85rem;
  color: var(--color-text-secondary);
}

.distribution-count {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.distribution-bar {
  height: 6px;
  background: var(--color-bg-secondary);
  border-radius: 3px;
  overflow: hidden;
}

.distribution-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent-warm));
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* Recent List */
.recent-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--color-bg-secondary);
  border-radius: 8px;
}

.recent-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.recent-user {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.recent-date {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.recent-status {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
}

.recent-status.active {
  background: rgba(16, 185, 129, 0.15);
  color: #10b981;
}

.recent-status.inactive {
  background: rgba(239, 68, 68, 0.15);
  color: #ef4444;
}

.empty-data {
  text-align: center;
  color: var(--color-text-muted);
  padding: 20px;
  font-size: 0.85rem;
}

/* Quick Actions */
.quick-actions {
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--color-border-light);
}

.quick-actions h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  background: var(--color-bg-secondary);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.2s;
}

.action-card:hover {
  background: var(--color-primary);
  color: #fff;
  transform: translateY(-2px);
}

.action-card svg {
  width: 28px;
  height: 28px;
  color: var(--color-primary);
  transition: color 0.2s;
}

.action-card:hover svg {
  color: #fff;
}

.action-card span {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  transition: color 0.2s;
}

.action-card:hover span {
  color: #fff;
}

/* Responsive */
@media (max-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .charts-row {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
