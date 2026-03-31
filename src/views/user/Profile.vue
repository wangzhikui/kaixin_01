<script setup>
import { ref, onMounted } from 'vue'
import { usersApi, subscriptionsApi, packagesApi, membersApi } from '../../api'
import { useRouter, useRoute } from 'vue-router'
import AppHeader from '../../components/AppHeader.vue'
import AppFooter from '../../components/AppFooter.vue'

const router = useRouter()
const route = useRoute()
const activeTab = ref('profile')
const user = ref(null)
const subscription = ref(null)
const packageInfo = ref(null)
const loading = ref(true)

defineOptions({
  name: 'UserProfile'
})

onMounted(async () => {
  loading.value = true
  try {
    // Check if navigated from subscription route
    if (route.path === '/user/subscription') {
      activeTab.value = 'subscription'
    }
    user.value = usersApi.getCurrentUser()
    console.log('Profile onMounted - user:', user.value)
    console.log('Profile onMounted - user.id:', user.value?.id)
    console.log('Profile onMounted - user.phone:', user.value?.phone)
    if (!user.value) {
      router.push('/user/login')
      return
    }
    await loadSubscription()
  } catch (error) {
    console.error('Failed to load profile:', error)
  } finally {
    loading.value = false
  }
})

async function loadSubscription() {
  if (!user.value) return

  try {
    let userId = user.value.id

    // 如果 userId 是 demo 或者无效，尝试通过手机号查找会员ID
    if (!userId || userId === 'demo') {
      if (user.value.phone) {
        const members = await membersApi.getAll()
        const member = members.find(m => m.phone === user.value.phone)
        if (member) {
          userId = member.id
        }
      }
    }

    console.log('loadSubscription - final userId:', userId)
    if (!userId) return

    const subs = await subscriptionsApi.getActiveByUserId(userId)
    console.log('loadSubscription - subs:', subs)
    if (subs && subs.length > 0) {
      subscription.value = subs[0]
      console.log('loadSubscription - subscription.value:', subscription.value)
      const packages = await packagesApi.getAll()
      console.log('loadSubscription - packages:', packages)
      console.log('loadSubscription - packageId to find:', subscription.value.packageId, typeof subscription.value.packageId)
      packageInfo.value = packages.find(p => p.id === subscription.value.packageId)
      console.log('loadSubscription - packageInfo.value:', packageInfo.value)
    }
  } catch (error) {
    console.error('Failed to load subscription:', error)
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('zh-CN')
}

function getRemainingDays() {
  if (!subscription.value || !subscription.value.endTime) return 0
  const now = new Date()
  const end = new Date(subscription.value.endTime)
  const diff = end.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

function formatTokenLimit(limit) {
  if (limit === -1) return '无限'
  if (!limit) return '-'
  return limit.toLocaleString()
}
</script>

<template>
  <div class="profile-page">
    <AppHeader />
    <div class="profile-container" v-loading="loading">
      <div class="profile-layout">
        <!-- Left Sidebar -->
        <aside class="profile-sidebar">
          <h2 class="sidebar-title">账户中心</h2>
          <nav class="sidebar-nav">
            <button
              class="nav-item"
              :class="{ active: activeTab === 'profile' }"
              @click="activeTab = 'profile'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
                <circle cx="12" cy="8" r="4"/>
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6"/>
              </svg>
              个人中心
            </button>
            <button
              class="nav-item"
              :class="{ active: activeTab === 'subscription' }"
              @click="activeTab = 'subscription'"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" class="nav-icon">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              我的订阅
            </button>
          </nav>
        </aside>

        <!-- Right Content -->
        <main class="profile-content">
          <!-- Profile Tab -->
          <div v-if="activeTab === 'profile'" class="content-panel">
            <div class="user-header">
              <div class="avatar">
                {{ user?.name?.charAt(0) || user?.username?.charAt(0) || '用户' }}
              </div>
              <div class="user-info">
                <h1>{{ user?.name || user?.username || '未设置姓名' }}</h1>
                <p>{{ user?.email || '未设置邮箱' }}</p>
              </div>
            </div>

            <div class="info-card">
              <h3>账户信息</h3>
              <div class="info-grid">
                <div class="info-item">
                  <span class="label">用户名</span>
                  <span class="value">{{ user?.username }}</span>
                </div>
                <div class="info-item">
                  <span class="label">手机号</span>
                  <span class="value">{{ user?.phone || '未绑定' }}</span>
                </div>
                <div class="info-item">
                  <span class="label">注册时间</span>
                  <span class="value">{{ formatDate(user?.createdAt) }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Subscription Tab -->
          <div v-if="activeTab === 'subscription'" class="content-panel">
            <div v-if="subscription && packageInfo" class="subscription-details">
              <div class="current-plan">
                <div class="plan-header">
                  <span class="plan-name">{{ packageInfo.name }}</span>
                  <span class="plan-status">生效中</span>
                </div>
                <p class="plan-desc">{{ packageInfo.description }}</p>
              </div>

              <div class="stats-row">
                <div class="stat-card" v-if="packageInfo.tokenLimit > 0">
                  <span class="stat-label">已用 Tokens</span>
                  <span class="stat-value">{{ (subscription.tokenUsed || 0).toLocaleString() }}</span>
                  <span class="stat-unit">/ {{ formatTokenLimit(packageInfo.tokenLimit) }}</span>
                </div>
                <div class="stat-card" v-else>
                  <span class="stat-label">Tokens</span>
                  <span class="stat-value unlimited">无限</span>
                </div>
              </div>

              <div class="dates-row">
                <div class="date-card">
                  <span class="date-label">开始时间</span>
                  <span class="date-value">{{ formatDate(subscription.startTime) }}</span>
                </div>
                <div class="date-card">
                  <span class="date-label">结束时间</span>
                  <span class="date-value">{{ formatDate(subscription.endTime) }}</span>
                </div>
                <div class="date-card highlight">
                  <span class="date-label">剩余天数</span>
                  <span class="date-value">{{ getRemainingDays() }} 天</span>
                </div>
              </div>

              <div class="action-row">
                <router-link to="/user/pricing" class="action-btn outline">
                  升级套餐
                </router-link>
              </div>
            </div>

            <div v-else class="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" class="empty-icon">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
              <p>您还没有订阅任何套餐</p>
              <router-link to="/user/pricing" class="action-btn primary">
                选择套餐
              </router-link>
            </div>
          </div>
        </main>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.profile-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
}

.profile-container {
  flex: 1;
  padding: 120px 24px 80px;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}

.profile-layout {
  display: flex;
  gap: 24px;
}

.profile-sidebar {
  width: 240px;
  flex-shrink: 0;
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 24px;
  height: fit-content;
}

.sidebar-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 20px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  background: transparent;
  border: none;
  border-radius: var(--radius-lg);
  color: var(--color-text-secondary);
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
}

.nav-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.nav-item.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.profile-content {
  flex: 1;
  min-width: 0;
}

.content-panel {
  background: #fff;
  border-radius: var(--radius-xl);
  padding: 32px;
}

.user-header {
  display: flex;
  align-items: center;
  gap: 20px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 24px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
  font-weight: 700;
  flex-shrink: 0;
}

.user-info h1 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.user-info p {
  color: var(--color-text-muted);
  margin: 0;
  font-size: 0.95rem;
}

.info-card h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  text-transform: uppercase;
  margin: 0 0 16px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item .label {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.info-item .value {
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.action-row {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--color-border-light);
}

.action-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: var(--radius-lg);
  font-weight: 600;
  font-size: 0.95rem;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: none;
}

.action-btn.primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
}

.action-btn.primary:hover {
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

.action-btn.outline {
  background: transparent;
  border: 2px solid var(--color-primary);
  color: var(--color-primary);
}

.action-btn.outline:hover {
  background: rgba(99, 102, 241, 0.05);
}

/* Subscription Styles */
.subscription-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.current-plan {
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border-light);
}

.plan-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.plan-status {
  padding: 4px 12px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.plan-desc {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

.stats-row {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.stat-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.stat-unit {
  font-size: 0.85rem;
  color: var(--color-text-muted);
}

.stat-value.unlimited {
  color: #10b981;
}

.dates-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.date-card {
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  padding: 16px;
  text-align: center;
}

.date-card.highlight {
  background: rgba(99, 102, 241, 0.1);
}

.date-card.highlight .date-value {
  color: var(--color-primary);
}

.date-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-bottom: 4px;
}

.date-value {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  width: 64px;
  height: 64px;
  color: var(--color-text-muted);
  margin-bottom: 16px;
}

.empty-state p {
  color: var(--color-text-muted);
  margin: 0 0 24px 0;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .profile-layout {
    flex-direction: column;
  }

  .profile-sidebar {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .stats-row,
  .dates-row {
    grid-template-columns: 1fr;
  }
}
</style>
