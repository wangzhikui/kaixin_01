<script setup>
import { ref, onMounted, provide } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { usersApi } from '../../api'
import HubSidebar from './HubSidebar.vue'

const router = useRouter()
const route = useRoute()
const currentUser = ref(null)
const selectedAgent = ref(null)

provide('selectedAgent', selectedAgent)

onMounted(() => {
  const user = usersApi.getCurrentUser()
  if (!user) {
    router.push(`/user/login?redirect=${route.fullPath}`)
  } else {
    currentUser.value = user
  }
})

function handleAgentSelected(agent) {
  selectedAgent.value = agent
}
</script>

<template>
  <div class="hub-layout">
    <HubSidebar :user="currentUser" @agent-selected="handleAgentSelected" />
    <main class="main-content">
      <router-view :key="route.path" />
    </main>
  </div>
</template>

<style scoped>
.hub-layout {
  display: flex;
  height: 100vh;
  background: var(--color-bg-secondary);
  overflow: hidden;
}

.main-content {
  flex: 1;
  margin-left: 280px;
  height: 100vh;
  padding: 0;
  overflow: hidden;
}

@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
  }
}
</style>
