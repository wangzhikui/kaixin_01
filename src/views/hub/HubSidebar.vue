<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usersApi, subscriptionsApi, packagesApi, agentsApi } from '../../api'

const props = defineProps({
  user: Object
})

const emit = defineEmits(['agent-selected'])

const router = useRouter()
const route = useRoute()
const subscription = ref(null)
const packageInfo = ref(null)
const agents = ref([])
const selectedAgent = ref(null)

onMounted(async () => {
  if (props.user) {
    try {
      const subs = await subscriptionsApi.getActiveByUserId(props.user.id)
      if (subs && subs.length > 0) {
        subscription.value = subs[0]
        const packages = await packagesApi.getAll()
        packageInfo.value = packages.find(p => p.id === subscription.value.packageId)
      }
    } catch (error) {
      console.error('Failed to load subscription:', error)
    }
  }
  await loadAgents()
})

async function loadAgents() {
  try {
    const data = await agentsApi.getAll()
    agents.value = data || []
    if (agents.value.length > 0 && !selectedAgent.value) {
      selectedAgent.value = agents.value[0]
      emit('agent-selected', selectedAgent.value)
    }
  } catch (error) {
    console.error('Failed to load agents:', error)
  }
}

function selectAgent(agent) {
  selectedAgent.value = agent
  emit('agent-selected', agent)
}

function handleLogout() {
  usersApi.logout()
  router.push('/user/login')
}
</script>

<template>
  <aside class="sidebar">
    <div class="sidebar-header">
      <div class="logo" @click="router.push('/')">
        <svg viewBox="0 0 40 40" class="logo-svg">
          <rect x="4" y="8" width="32" height="24" rx="4" fill="#111"/>
          <rect x="8" y="12" width="24" height="16" rx="2" fill="#fff"/>
          <line x1="12" y1="17" x2="28" y2="17" stroke="#111" stroke-width="1.5" opacity="0.8"/>
          <line x1="12" y1="21" x2="24" y2="21" stroke="#111" stroke-width="1.5" opacity="0.6"/>
          <line x1="12" y1="25" x2="20" y2="25" stroke="#111" stroke-width="1.5" opacity="0.4"/>
          <circle cx="28" cy="17" r="2" fill="#111"/>
        </svg>
        <span class="logo-text">EDA HUB</span>
      </div>
    </div>

    <nav class="menu">
      <div
        v-for="agent in agents"
        :key="agent.id"
        class="menu-item agent-item"
        @click="selectAgent(agent)"
      >
        <span class="agent-icon">{{ agent.icon }}</span>
        <span class="menu-text">{{ agent.name }}</span>
      </div>
    </nav>

    <div class="sidebar-footer">
      <div v-if="packageInfo" class="subscription-info">
        <span class="package-name">{{ packageInfo.name }}</span>
        <span class="token-info" v-if="packageInfo.tokenLimit > 0">
          {{ subscription?.tokenUsed || 0 }} / {{ packageInfo.tokenLimit }} tokens
        </span>
        <span class="token-info" v-else>
          无限 tokens
        </span>
      </div>
      <button class="logout-btn" @click="handleLogout">
        <span class="menu-icon">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        </span>
        <span class="menu-text">退出登录</span>
      </button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 280px;
  background: #fff;
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow: hidden;
}

.sidebar-header {
  padding: 20px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.logo-svg {
  width: 36px;
  height: 36px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #111;
  letter-spacing: -0.5px;
}

.menu {
  flex: 1;
  padding: 12px;
  overflow-y: auto;
}

.menu-title {
  font-size: 0.75rem;
  color: #6b7280;
  text-transform: uppercase;
  padding: 8px 12px;
  margin-bottom: 8px;
}

.agent-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.agent-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  color: #374151;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 2px;
  transition: all 0.15s ease;
  cursor: pointer;
  font-size: 0.9rem;
}

.menu-item:hover {
  background: #f5f5f5;
  color: #111;
}

.menu-icon {
  font-size: 18px;
  width: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-text {
  font-weight: 500;
}

.sidebar-footer {
  padding: 16px;
}

.subscription-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 14px;
  background: #f9f9f9;
  border-radius: 12px;
  margin-bottom: 12px;
}

.package-name {
  font-weight: 600;
  color: #111;
  font-size: 0.9rem;
}

.token-info {
  font-size: 0.75rem;
  color: #6b7280;
}

.logout-btn {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  background: transparent;
  border: none;
  color: #374151;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.15s;
  font-size: 0.9rem;
}

.logout-btn:hover {
  background: #f5f5f5;
  color: #111;
}

@media (max-width: 768px) {
  .sidebar {
    width: 100%;
    height: auto;
    position: static;
  }
}
</style>
