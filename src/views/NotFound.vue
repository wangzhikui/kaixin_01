<script setup>
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'
</script>

<template>
  <div class="not-found-page">
    <AppHeader />

    <main class="not-found-content">
      <div class="container">
        <h1>404</h1>
        <p class="subtitle">页面未找到</p>
        <p class="description">抱歉，您访问的页面不存在或已被移除。</p>
        <div class="actions">
          <a href="/" class="btn btn-primary">返回首页</a>
        </div>
      </div>
    </main>

    <AppFooter />
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.not-found-content {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 20px 60px;
}

.not-found-content h1 {
  font-size: 8rem;
  font-weight: 700;
  color: var(--color-accent-primary);
  margin: 0;
  line-height: 1;
}

.not-found-content .subtitle {
  font-size: 2rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 20px 0;
}

.not-found-content .description {
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin-bottom: 40px;
}

.actions {
  margin-top: 20px;
}

@media (max-width: 768px) {
  .not-found-content h1 {
    font-size: 5rem;
  }

  .not-found-content .subtitle {
    font-size: 1.5rem;
  }

  .nav-links a:not(.nav-btn) {
    display: none;
  }
}
</style>
