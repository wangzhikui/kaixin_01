<script setup>
import { ref, onMounted } from 'vue'
import { packagesApi, agentsApi } from '../../api'
import { ElMessage } from 'element-plus'
import AppHeader from '../../components/AppHeader.vue'
import AppFooter from '../../components/AppFooter.vue'

const packages = ref([])
const agents = ref([])
const loading = ref(true)
const billingCycle = ref('monthly')

defineOptions({
  name: 'Pricing'
})

onMounted(async () => {
  loading.value = true
  try {
    const [packagesData, agentsData] = await Promise.all([
      packagesApi.getAll(),
      agentsApi.getAll()
    ])
    packages.value = packagesData || []
    agents.value = agentsData || []
  } catch (error) {
    console.error('Failed to load packages:', error)
  } finally {
    loading.value = false
  }
})

function getAgentNames(agentIds) {
  if (!agentIds || !agentIds.length) return []
  return agentIds.map(id => {
    const agent = agents.value.find(a => a.id === id)
    return agent ? `${agent.icon || ''} ${agent.name}`.trim() : null
  }).filter(Boolean)
}

function getPrice(pkg) {
  const prices = pkg.prices || {}
  switch (billingCycle.value) {
    case 'quarterly':
      return prices.quarterly || 0
    case 'yearly':
      return prices.yearly || 0
    default:
      return prices.monthly || 0
  }
}

function formatPrice(price) {
  return price === 0 ? '免费' : `¥${price}`
}

function getPriceLabel() {
  switch (billingCycle.value) {
    case 'quarterly':
      return '/季'
    case 'yearly':
      return '/年'
    default:
      return '/月'
  }
}

function getBillingLabel() {
  switch (billingCycle.value) {
    case 'quarterly':
      return '季度'
    case 'yearly':
      return '年度'
    default:
      return '月度'
  }
}

function getOriginalPrice(pkg) {
  const monthlyPrice = pkg.prices?.monthly || 0
  if (monthlyPrice === 0) return null

  switch (billingCycle.value) {
    case 'quarterly':
      return `¥${monthlyPrice * 3}/季`
    case 'yearly':
      return `¥${monthlyPrice * 12}/年`
    default:
      return null
  }
}

function getSavings(pkg) {
  const monthlyPrice = pkg.prices?.monthly || 0
  if (monthlyPrice === 0) return null

  const currentPrice = getPrice(pkg)
  let originalTotal
  switch (billingCycle.value) {
    case 'quarterly':
      originalTotal = monthlyPrice * 3
      break
    case 'yearly':
      originalTotal = monthlyPrice * 12
      break
    default:
      return null
  }

  const savings = originalTotal - currentPrice
  if (savings <= 0) return null
  return `省 ¥${savings}`
}

async function handleSubscribe(pkg) {
  const price = getPrice(pkg)
  if (price === 0) {
    ElMessage.success('您已选择免费套餐')
    return
  }
  ElMessage.info('请联系客服开通付费套餐')
}
</script>

<template>
  <div class="pricing-page" v-loading="loading">
    <AppHeader />
    <div class="pricing-container">
      <div class="page-header">
        <span class="section-tag">会员服务</span>
        <h1>选择您的套餐</h1>
        <p>选择最适合您需求的方案，开启 AI 编程之旅</p>
      </div>

      <div class="billing-tabs">
        <button
          class="tab-btn"
          :class="{ active: billingCycle === 'monthly' }"
          @click="billingCycle = 'monthly'"
        >
          月度
        </button>
        <button
          class="tab-btn"
          :class="{ active: billingCycle === 'quarterly' }"
          @click="billingCycle = 'quarterly'"
        >
          季度
        </button>
        <button
          class="tab-btn"
          :class="{ active: billingCycle === 'yearly' }"
          @click="billingCycle = 'yearly'"
        >
          年度
        </button>
      </div>

      <div class="pricing-grid">
        <div
          v-for="pkg in packages"
          :key="pkg.id"
          class="pricing-card"
          :class="{ recommended: pkg.code === 'pro' }"
        >
          <div v-if="pkg.code === 'pro'" class="recommended-badge">推荐</div>

          <div class="card-header">
            <h3 class="package-name">{{ pkg.name }}</h3>
            <div class="price-block">
              <div class="price">
                <span class="amount">{{ formatPrice(getPrice(pkg)) }}</span>
                <span class="unit">{{ getPriceLabel() }}</span>
              </div>
              <div v-if="getOriginalPrice(pkg)" class="original-price">
                {{ getOriginalPrice(pkg) }}
              </div>
              <div v-if="getSavings(pkg)" class="savings-badge">
                {{ getSavings(pkg) }}
              </div>
            </div>
            <p class="description">{{ pkg.description }}</p>
          </div>

          <div class="card-body">
            <div class="feature-list">
              <div class="feature-item" v-if="pkg.tokenLimit > 0">
                <span class="feature-icon">✓</span>
                <span>{{ pkg.tokenLimit.toLocaleString() }} tokens/{{ getBillingLabel() }}</span>
              </div>
              <div class="feature-item" v-else>
                <span class="feature-icon">✓</span>
                <span>无限 tokens</span>
              </div>
              <div
                v-for="agentName in getAgentNames(pkg.agentIds || pkg.featureIds || [])"
                :key="agentName"
                class="feature-item"
              >
                <span class="feature-icon">✓</span>
                <span>{{ agentName }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <button
              class="subscribe-btn"
              :class="{ primary: pkg.code !== 'free' }"
              @click="handleSubscribe(pkg)"
            >
              {{ getPrice(pkg) === 0 ? '当前方案' : '立即订阅' }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <AppFooter />
  </div>
</template>

<style scoped>
.pricing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--color-bg-secondary);
}

.pricing-container {
  flex: 1;
  padding: 120px 24px 80px;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-tag {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(99, 102, 241, 0.1);
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-primary);
  margin-bottom: 16px;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 12px 0;
}

.page-header p {
  font-size: 1.125rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.billing-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 40px;
}

.tab-btn {
  padding: 10px 24px;
  border: 1px solid var(--color-border);
  background: #fff;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tab-btn.active {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
  border-color: transparent;
  box-shadow: 0 4px 16px rgba(99, 102, 241, 0.25);
}

.pricing-grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 24px;
  justify-content: center;
}

.pricing-card {
  flex: 1;
  min-width: 280px;
  max-width: 360px;
  background: white;
  border-radius: var(--radius-xl);
  padding: 32px;
  position: relative;
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
}

.pricing-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.12);
  transform: translateY(-4px);
}

.pricing-card.recommended {
  border-color: var(--color-primary);
  box-shadow: 0 12px 40px rgba(99, 102, 241, 0.15);
}

.recommended-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
  padding: 4px 16px;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.card-header {
  text-align: center;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border-light);
  margin-bottom: 24px;
}

.package-name {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

.price-block {
  margin-bottom: 12px;
}

.price {
  display: flex;
  align-items: baseline;
  justify-content: center;
  gap: 4px;
}

.price .amount {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.price .unit {
  font-size: 1rem;
  color: var(--color-text-muted);
}

.original-price {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-decoration: line-through;
  margin-top: 4px;
}

.savings-badge {
  display: inline-block;
  margin-top: 8px;
  padding: 2px 10px;
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 600;
}

.description {
  color: var(--color-text-muted);
  margin: 0;
  font-size: 0.875rem;
}

.card-body {
  flex: 1;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

.feature-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  flex-shrink: 0;
}

.card-footer {
  margin-top: 24px;
}

.subscribe-btn {
  width: 100%;
  padding: 14px 24px;
  border-radius: var(--radius-lg);
  border: 2px solid var(--color-primary);
  background: transparent;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.subscribe-btn:hover {
  background: rgba(99, 102, 241, 0.1);
}

.subscribe-btn:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

.subscribe-btn.primary {
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent-warm));
  color: #fff;
  border: none;
}

.subscribe-btn.primary:hover {
  box-shadow: 0 8px 24px rgba(99, 102, 241, 0.3);
  transform: translateY(-2px);
}

@media (max-width: 1024px) {
  .pricing-grid {
    flex-wrap: wrap;
  }

  .pricing-card {
    flex: 1 1 calc(50% - 12px);
    max-width: none;
  }
}

@media (max-width: 640px) {
  .pricing-card {
    flex: 1 1 100%;
  }

  .page-header h1 {
    font-size: 1.75rem;
  }

  .billing-tabs {
    flex-wrap: wrap;
  }

  .tab-btn {
    padding: 8px 16px;
    font-size: 0.85rem;
  }
}
</style>
