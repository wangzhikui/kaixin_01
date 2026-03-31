<script setup>
import { ref, onMounted } from 'vue'
import { usersApi, subscriptionsApi, packagesApi } from '../../api'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const subscription = ref(null)
const packageInfo = ref(null)
const loading = ref(true)

defineOptions({
  name: 'UserSubscription'
})

onMounted(async () => {
  loading.value = true
  try {
    const user = usersApi.getCurrentUser()
    if (!user) {
      router.push('/user/login')
      return
    }

    const subs = await subscriptionsApi.getActiveByUserId(user.id)
    if (subs && subs.length > 0) {
      subscription.value = subs[0]
      const packages = await packagesApi.getAll()
      packageInfo.value = packages.find(p => p.id === subscription.value.packageId)
    }
  } catch (error) {
    console.error('Failed to load subscription:', error)
  } finally {
    loading.value = false
  }
})

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
</script>

<template>
  <div class="subscription-page" v-loading="loading">
    <div class="page-header">
      <h1>我的订阅</h1>
    </div>

    <div class="subscription-content" v-if="subscription && packageInfo">
      <div class="current-plan">
        <div class="plan-card">
          <div class="plan-header">
            <span class="plan-name">{{ packageInfo.name }}</span>
            <el-tag type="success">生效中</el-tag>
          </div>
          <div class="plan-desc">{{ packageInfo.description }}</div>

          <div class="plan-stats">
            <div class="stat-item" v-if="packageInfo.tokenLimit > 0">
              <span class="stat-label">已用 Tokens</span>
              <span class="stat-value">{{ subscription.tokenUsed || 0 }}</span>
              <span class="stat-total">/ {{ packageInfo.tokenLimit }}</span>
            </div>
            <div class="stat-item" v-else>
              <span class="stat-label">Tokens</span>
              <span class="stat-value unlimited">无限</span>
            </div>
          </div>

          <div class="plan-dates">
            <div class="date-item">
              <span class="date-label">开始时间</span>
              <span class="date-value">{{ formatDate(subscription.startTime) }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">结束时间</span>
              <span class="date-value">{{ formatDate(subscription.endTime) }}</span>
            </div>
            <div class="date-item">
              <span class="date-label">剩余天数</span>
              <span class="date-value highlight">{{ getRemainingDays() }} 天</span>
            </div>
          </div>
        </div>
      </div>

      <div class="upgrade-section">
        <h2>升级套餐</h2>
        <p>联系客服了解更多套餐信息</p>
        <router-link to="/user/pricing" class="upgrade-btn">
          查看所有套餐
        </router-link>
      </div>
    </div>

    <div class="no-subscription" v-else>
      <div class="empty-state">
        <p>您还没有订阅任何套餐</p>
        <router-link to="/user/pricing" class="subscribe-btn">
          选择套餐
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.subscription-page {
  max-width: 800px;
  padding: 40px 20px;
}

.page-header {
  margin-bottom: 32px;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 700;
  color: #303133;
  margin: 0;
}

.subscription-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.plan-card {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  border: 2px solid #4F46E5;
}

.plan-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.plan-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: #4F46E5;
}

.plan-desc {
  color: #606266;
  margin-bottom: 24px;
}

.plan-stats {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  margin-bottom: 24px;
}

.stat-item {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.stat-label {
  color: #909399;
  font-size: 0.875rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #303133;
}

.stat-total {
  color: #909399;
}

.stat-value.unlimited {
  color: #67c23a;
}

.plan-dates {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.date-item {
  text-align: center;
  padding: 16px;
  background: #f5f7fa;
  border-radius: 8px;
}

.date-label {
  display: block;
  color: #909399;
  font-size: 0.75rem;
  margin-bottom: 4px;
}

.date-value {
  font-weight: 600;
  color: #303133;
}

.date-value.highlight {
  color: #4F46E5;
}

.upgrade-section {
  background: #fff;
  border-radius: 16px;
  padding: 32px;
  text-align: center;
}

.upgrade-section h2 {
  margin: 0 0 8px 0;
  color: #303133;
}

.upgrade-section p {
  margin: 0 0 24px 0;
  color: #909399;
}

.upgrade-btn {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #4F46E5, #6366F1);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.2s ease;
  cursor: pointer;
}

.upgrade-btn:hover {
  box-shadow: 0 8px 24px rgba(79, 70, 229, 0.3);
}

.upgrade-btn:focus-visible {
  outline: 2px solid #4F46E5;
  outline-offset: 2px;
}

.subscribe-btn:focus-visible {
  outline: 2px solid #4F46E5;
  outline-offset: 2px;
}

.no-subscription {
  background: #fff;
  border-radius: 16px;
  padding: 64px 32px;
}

.empty-state {
  text-align: center;
}

.empty-state p {
  color: #909399;
  margin-bottom: 24px;
}

.subscribe-btn {
  display: inline-block;
  padding: 14px 32px;
  background: linear-gradient(135deg, #4F46E5, #6366F1);
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}
</style>
