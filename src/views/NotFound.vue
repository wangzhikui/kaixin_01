<script setup>
</script>

<template>
  <div class="not-found-page">
    <nav class="navbar">
      <div class="container nav-content">
        <div class="logo" @click="$router.push('/')">
          <div class="dolphin-logo">
            <svg viewBox="0 0 100 100" class="dolphin-svg">
              <defs>
                <linearGradient id="dolphinGrad404" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#0099CC;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="chipGrad404" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF6700;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#FF8C1A;stop-opacity:1" />
                </linearGradient>
              </defs>
              <rect x="10" y="40" width="80" height="50" rx="8" fill="url(#chipGrad404)" opacity="0.9"/>
              <rect x="15" y="45" width="70" height="40" rx="4" fill="#0f0f23"/>
              <line x1="25" y1="55" x2="75" y2="55" stroke="#00D4FF" stroke-width="1.5" opacity="0.8"/>
              <line x1="25" y1="65" x2="75" y2="65" stroke="#00D4FF" stroke-width="1.5" opacity="0.6"/>
              <line x1="25" y1="75" x2="75" y2="75" stroke="#00D4FF" stroke-width="1.5" opacity="0.4"/>
              <circle cx="25" cy="55" r="3" fill="#00D4FF"/>
              <circle cx="75" cy="55" r="3" fill="#00D4FF"/>
              <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28" fill="url(#dolphinGrad404)" opacity="0.95"/>
              <circle cx="58" cy="28" r="2.5" fill="#0f0f23"/>
            </svg>
          </div>
          <span class="logo-text">AI老魁</span>
        </div>
        <div class="nav-links">
          <a href="/#tutorials">OpenClaw实战笔记</a>
          <a href="/#navigation">AI网址导航</a>
          <a href="/#about">关于</a>
        </div>
      </div>
    </nav>

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
  </div>
</template>

<style scoped>
.not-found-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 16px 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--color-border-light);
}

.nav-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
}

.dolphin-logo {
  width: 40px;
  height: 40px;
}

.dolphin-svg {
  width: 100%;
  height: 100%;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-links a {
  font-weight: 500;
  color: var(--color-text-secondary);
}

.nav-links a:hover {
  color: var(--color-accent-primary);
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
