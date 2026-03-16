<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { articlesList } from '../data/articles-list'
import { navigationPreview } from '../data/navigation'

const router = useRouter()
const isVisible = ref(false)
const currentYear = new Date().getFullYear()

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

function goToArticle(id) {
  router.push(`/article/${id}`)
}

function goToNavigation() {
  router.push('/navigation')
}

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="app">
    <!-- Navigation -->
    <nav class="navbar">
      <div class="container nav-content">
        <div class="logo" @click="scrollToTop">
          <div class="dolphin-logo">
            <svg viewBox="0 0 100 100" class="dolphin-svg">
              <defs>
                <linearGradient id="dolphinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#00D4FF;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#0099CC;stop-opacity:1" />
                </linearGradient>
                <linearGradient id="chipGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#FF6700;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#FF8C1A;stop-opacity:1" />
                </linearGradient>
              </defs>
              <!-- Chip base -->
              <rect x="10" y="40" width="80" height="50" rx="8" fill="url(#chipGrad)" opacity="0.9"/>
              <rect x="15" y="45" width="70" height="40" rx="4" fill="#0f0f23"/>
              <!-- Circuit lines -->
              <line x1="25" y1="55" x2="75" y2="55" stroke="#00D4FF" stroke-width="1.5" opacity="0.8"/>
              <line x1="25" y1="65" x2="75" y2="65" stroke="#00D4FF" stroke-width="1.5" opacity="0.6"/>
              <line x1="25" y1="75" x2="75" y2="75" stroke="#00D4FF" stroke-width="1.5" opacity="0.4"/>
              <!-- Nodes -->
              <circle cx="25" cy="55" r="3" fill="#00D4FF"/>
              <circle cx="75" cy="55" r="3" fill="#00D4FF"/>
              <circle cx="35" cy="65" r="2.5" fill="#00D4FF"/>
              <circle cx="65" cy="65" r="2.5" fill="#00D4FF"/>
              <circle cx="45" cy="75" r="2" fill="#00D4FF"/>
              <circle cx="55" cy="75" r="2" fill="#00D4FF"/>
              <!-- Dolphin silhouette -->
              <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                    fill="url(#dolphinGrad)" opacity="0.95"/>
              <!-- Dolphin eye -->
              <circle cx="58" cy="28" r="2.5" fill="#0f0f23"/>
              <circle cx="59" cy="27" r="1" fill="#fff"/>
            </svg>
          </div>
          <span class="logo-text">AI老魁</span>
        </div>
        <div class="nav-links">
          <a href="#tutorials">OpenClaw实战笔记</a>
          <a href="#navigation">AI网址导航</a>
          <a href="#about">关于</a>
          <a href="#contact" class="btn btn-primary nav-btn">联系我</a>
        </div>
      </div>
    </nav>

    <!-- Hero Section - OpenClaw教程 -->
    <section class="hero">
      <div class="hero-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="container hero-content" :class="{ visible: isVisible }">
        <div class="hero-badge">
          <span>🆕 最新教程</span>
        </div>
        <h1 class="hero-title">
          OpenClaw<br />
          <span class="highlight">完全指南</span>
        </h1>
        <p class="hero-desc">
          带你从零开始掌握OpenClaw——你的个人AI助手。安装配置、Skills扩展、多Agent架构，
          这里有你需要的一切。
        </p>
        <div class="hero-actions">
          <a href="#tutorials" class="btn btn-primary">
            开始学习
            <span class="btn-arrow">→</span>
          </a>
          <a href="#about" class="btn btn-secondary">了解更多</a>
        </div>
      </div>
    </section>

    <!-- Quick Links -->
    <section class="quick-links">
      <div class="container">
        <div class="links-grid">
          <a v-for="link in quickLinks" :key="link.name" :href="link.url" target="_blank" class="link-card">
            <span class="link-icon">{{ link.icon }}</span>
            <span class="link-name">{{ link.name }}</span>
          </a>
        </div>
      </div>
    </section>

    <!-- Tutorials Section -->
    <section id="tutorials" class="tutorials section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">学习路径</span>
          <h2>OpenClaw 实战笔记</h2>
          <p>从入门到进阶，系统学习OpenClaw的使用</p>
        </div>
        <div class="articles-grid">
          <article
            v-for="(article, index) in articlesList"
            :key="article.id"
            class="article-card"
            :style="{ animationDelay: `${index * 0.05}s` }"
            @click="goToArticle(article.id)"
          >
            <div class="article-meta">
              <span class="article-category">{{ article.category }}</span>
              <span class="article-date">{{ article.date }}</span>
            </div>
            <h3>{{ article.title }}</h3>
            <p>{{ article.excerpt }}</p>
            <div class="article-footer">
              <span class="read-time">{{ article.readTime }} 阅读</span>
              <span class="read-more">阅读全文 →</span>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Navigation Section -->
    <section id="navigation" class="navigation section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">资源导航</span>
          <h2>AI 网址导航</h2>
          <p>精选 AI 领域优质网站，一站式获取你需要的学习资源</p>
        </div>
        <div class="nav-categories-grid">
          <div
            v-for="category in navigationPreview"
            :key="category.id"
            class="nav-category-card"
          >
            <div class="category-header">
              <span class="category-icon">{{ category.icon }}</span>
              <h3>{{ category.name }}</h3>
            </div>
            <div class="category-sites">
              <a
                v-for="site in category.sites"
                :key="site.url"
                :href="site.url"
                target="_blank"
                class="site-link"
              >
                <span class="site-name">{{ site.name }}</span>
                <span class="site-desc">{{ site.desc }}</span>
              </a>
            </div>
          </div>
        </div>
        <div class="nav-more">
          <button class="btn btn-primary" @click="goToNavigation">
            查看更多网址
            <span class="btn-arrow">→</span>
          </button>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="about section">
      <div class="container">
        <div class="about-content">
          <div class="about-image">
            <div class="chip-image-card">
              <!-- Chip layers -->
              <div class="chip-layer layer-1"></div>
              <div class="chip-layer layer-2"></div>
              <div class="chip-layer layer-3"></div>
              <!-- Circuit pattern -->
              <div class="circuit-container">
                <svg viewBox="0 0 200 200" class="circuit-svg">
                  <defs>
                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" style="stop-color:#FF6700" />
                      <stop offset="100%" style="stop-color:#00D4FF" />
                    </linearGradient>
                  </defs>
                  <!-- Horizontal lines -->
                  <line x1="20" y1="50" x2="180" y2="50" stroke="url(#lineGrad)" stroke-width="2" class="circuit-line"/>
                  <line x1="20" y1="80" x2="180" y2="80" stroke="url(#lineGrad)" stroke-width="2" class="circuit-line"/>
                  <line x1="20" y1="110" x2="180" y2="110" stroke="url(#lineGrad)" stroke-width="2" class="circuit-line"/>
                  <line x1="20" y1="140" x2="180" y2="140" stroke="url(#lineGrad)" stroke-width="2" class="circuit-line"/>
                  <!-- Vertical connections -->
                  <line x1="50" y1="50" x2="50" y2="140" stroke="url(#lineGrad)" stroke-width="2" class="circuit-line"/>
                  <line x1="100" y1="50" x2="100" y2="140" stroke="url(#lineGrad)" stroke-width="2" class="circuit-line"/>
                  <line x1="150" y1="50" x2="150" y2="140" stroke="url(#lineGrad)" stroke-width="2" class="circuit-line"/>
                  <!-- Nodes -->
                  <circle cx="50" cy="50" r="6" fill="#FF6700" class="node node-1"/>
                  <circle cx="100" cy="80" r="6" fill="#00D4FF" class="node node-2"/>
                  <circle cx="150" cy="110" r="6" fill="#FF6700" class="node node-3"/>
                  <circle cx="50" cy="140" r="6" fill="#00D4FF" class="node node-4"/>
                  <circle cx="100" cy="110" r="4" fill="#FF6700" class="node node-5"/>
                  <circle cx="150" cy="50" r="4" fill="#00D4FF" class="node node-6"/>
                  <!-- Chip center -->
                  <rect x="60" y="60" width="80" height="60" rx="8" fill="none" stroke="#FF6700" stroke-width="2" class="chip-border"/>
                  <text x="100" y="95" text-anchor="middle" fill="#fff" font-size="14" font-weight="bold">AI</text>
                </svg>
              </div>
              <!-- Floating particles -->
              <div class="particle particle-1"></div>
              <div class="particle particle-2"></div>
              <div class="particle particle-3"></div>
            </div>
          </div>
          <div class="about-text">
            <span class="section-tag">关于博主</span>
            <h2>探索 AI 的无限可能</h2>
            <p>
              我是AI老魁，一个热爱技术和创新的开发者。这个网站记录了我学习和使用OpenClaw的过程，
              希望能够帮助更多想要入门AI助手的朋友。
            </p>
            <p>
              OpenClaw是一个强大的个人AI助手框架，支持多Agent架构、丰富的Skills扩展，
              以及多种消息渠道集成。让我们一起探索AI的奥秘！
            </p>
            <div class="about-features">
              <div class="about-feature">
                <span class="check">✓</span>
                <span>持续更新OpenClaw实战笔记</span>
              </div>
              <div class="about-feature">
                <span class="check">✓</span>
                <span>分享实战经验和技巧</span>
              </div>
              <div class="about-feature">
                <span class="check">✓</span>
                <span>解答学习中的疑难问题</span>
              </div>
            </div>
            <a href="#contact" class="btn btn-primary">与我交流</a>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section id="contact" class="cta section">
      <div class="container">
        <div class="cta-card">
          <div class="cta-content">
            <h2>有问题？来找我！</h2>
            <p>学习过程中遇到任何问题，都可以随时联系我</p>
            <div class="cta-actions">
              <a href="#" class="btn btn-primary btn-lg">
                微信联系
                <span class="btn-arrow">→</span>
              </a>
              <a href="#" class="btn btn-secondary btn-lg">发送邮件</a>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Back to Top Button -->
    <button class="back-to-top" @click="scrollToTop" title="返回顶部">
      <span>↑</span>
    </button>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <div class="logo">
              <div class="dolphin-logo-small">
                <svg viewBox="0 0 100 100" class="dolphin-svg-small">
                  <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28"
                        fill="#FF6700"/>
                  <circle cx="58" cy="28" r="2.5" fill="#0f0f23"/>
                </svg>
              </div>
              <span class="logo-text">AI老魁</span>
            </div>
            <p>探索 AI 的无限可能</p>
          </div>
          <div class="footer-links">
            <div class="footer-column">
              <h4>学习</h4>
              <a href="#tutorials">实战笔记</a>
              <a href="#navigation">AI网址导航</a>
              <a href="#">安装指南</a>
              <a href="#">命令手册</a>
            </div>
            <div class="footer-column">
              <h4>资源</h4>
              <a href="https://openclaw.ai/" target="_blank">OpenClaw官网</a>
              <a href="https://clawhub.ai/" target="_blank">ClawHub</a>
              <a href="https://docs.openclaw.ai/" target="_blank">官方文档</a>
            </div>
            <div class="footer-column">
              <h4>联系</h4>
              <a href="#">微信</a>
              <a href="#">邮箱</a>
              <a href="#">GitHub</a>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>&copy; {{ currentYear }} AI老魁. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.app {
  overflow-x: hidden;
}

/* Navbar */
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

.nav-btn {
  padding: 10px 20px;
}

/* Hero */
.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 120px 0 60px;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.5;
}

.orb-1 {
  width: 500px;
  height: 500px;
  background: radial-gradient(circle, rgba(255, 103, 0, 0.25) 0%, transparent 70%);
  top: -200px;
  right: -100px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(255, 140, 26, 0.2) 0%, transparent 70%);
  bottom: -100px;
  left: -100px;
}

.orb-3 {
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(255, 87, 34, 0.15) 0%, transparent 70%);
  top: 40%;
  left: 30%;
}

.hero-content {
  position: relative;
  z-index: 1;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
}

.hero-content.visible {
  opacity: 1;
  transform: translateY(0);
}

.hero-badge {
  display: inline-block;
  padding: 8px 16px;
  background: rgba(255, 103, 0, 0.1);
  border: 1px solid rgba(255, 103, 0, 0.3);
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-accent-primary);
  margin-bottom: 24px;
}

.hero-title {
  font-size: 4rem;
  font-weight: 700;
  line-height: 1.1;
  margin-bottom: 24px;
  letter-spacing: -0.02em;
}

.hero-title .highlight {
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-warm));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-desc {
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 540px;
  margin-bottom: 40px;
  line-height: 1.7;
}

.hero-actions {
  display: flex;
  gap: 16px;
}

.btn-arrow {
  transition: transform 0.2s ease;
}

.btn:hover .btn-arrow {
  transform: translateX(4px);
}

.btn-primary.btn-lg {
  padding: 18px 36px;
  font-size: 1rem;
}

.btn-secondary.btn-lg {
  padding: 18px 36px;
  font-size: 1rem;
}

/* Quick Links */
.quick-links {
  background: var(--color-bg-secondary);
  padding: 40px 0;
  border-top: 1px solid var(--color-border-light);
  border-bottom: 1px solid var(--color-border-light);
}

.links-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.link-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: white;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border-light);
  transition: var(--transition-base);
}

.link-card:hover {
  border-color: var(--color-accent-primary);
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.link-icon {
  font-size: 24px;
}

.link-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

/* Tutorials */
.tutorials {
  background: var(--color-bg-secondary);
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 64px;
}

.section-tag {
  display: inline-block;
  padding: 6px 14px;
  background: rgba(255, 103, 0, 0.1);
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-accent-primary);
  margin-bottom: 16px;
}

.section-header h2 {
  margin-bottom: 16px;
}

.section-header p {
  font-size: 1.125rem;
}

.articles-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.article-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 28px;
  border: 1px solid var(--color-border-light);
  transition: var(--transition-base);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
  border-color: var(--color-accent-primary);
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.article-category {
  padding: 4px 10px;
  background: rgba(255, 103, 0, 0.1);
  color: var(--color-accent-primary);
  border-radius: 50px;
  font-size: 0.75rem;
  font-weight: 500;
}

.article-date {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.article-card h3 {
  font-size: 1.1rem;
  margin-bottom: 12px;
  line-height: 1.4;
}

.article-card > p {
  font-size: 0.9rem;
  line-height: 1.6;
  margin-bottom: 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.read-time {
  font-size: 0.8rem;
  color: var(--color-text-muted);
}

.read-more {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-accent-primary);
}

/* Navigation */
.navigation {
  background: var(--color-bg-secondary);
}

.nav-categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.nav-category-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 24px;
  border: 1px solid var(--color-border-light);
  transition: var(--transition-base);
}

.nav-category-card:hover {
  border-color: var(--color-accent-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-4px);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-light);
}

.category-icon {
  font-size: 24px;
}

.category-header h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.category-sites {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.site-link {
  display: flex;
  flex-direction: column;
  padding: 10px 12px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  transition: var(--transition-base);
}

.site-link:hover {
  background: rgba(255, 103, 0, 0.1);
}

.site-name {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 0.9rem;
}

.site-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.nav-more {
  text-align: center;
  margin-top: 40px;
}

.nav-more .btn-arrow {
  transition: transform 0.2s ease;
}

.nav-more .btn:hover .btn-arrow {
  transform: translateX(4px);
}

/* About */
.about {
  background: white;
}

.about-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
}

.about-image {
  position: relative;
}

/* 3D Chip Style Image */
.chip-image-card {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--radius-xl);
  overflow: hidden;
  background: linear-gradient(145deg, #0a0a1a 0%, #1a1a3e 50%, #0a0a1a 100%);
  box-shadow:
    0 25px 60px rgba(0, 0, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.chip-layer {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-xl);
}

.chip-layer.layer-1 {
  background: linear-gradient(135deg, rgba(255, 103, 0, 0.2), transparent);
  animation: layer-rotate 20s linear infinite;
}

.chip-layer.layer-2 {
  background: radial-gradient(circle at 30% 30%, rgba(0, 212, 255, 0.1), transparent);
}

.chip-layer.layer-3 {
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.5));
}

@keyframes layer-rotate {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.circuit-container {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circuit-svg {
  width: 80%;
  height: 80%;
}

.circuit-line {
  animation: line-pulse 3s ease-in-out infinite;
}

.node {
  animation: node-blink 2s ease-in-out infinite;
}

.node-1 { animation-delay: 0s; }
.node-2 { animation-delay: 0.3s; }
.node-3 { animation-delay: 0.6s; }
.node-4 { animation-delay: 0.9s; }
.node-5 { animation-delay: 1.2s; }
.node-6 { animation-delay: 1.5s; }

@keyframes line-pulse {
  0%, 100% { opacity: 0.5; }
  50% { opacity: 1; }
}

@keyframes node-blink {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.2); }
}

.chip-border {
  animation: border-glow 4s ease-in-out infinite;
}

@keyframes border-glow {
  0%, 100% { stroke-opacity: 0.5; }
  50% { stroke-opacity: 1; }
}

/* Floating particles */
.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: #00D4FF;
  border-radius: 50%;
  animation: particle-float 6s ease-in-out infinite;
}

.particle-1 {
  top: 20%;
  left: 30%;
  animation-delay: 0s;
}

.particle-2 {
  top: 60%;
  right: 25%;
  width: 6px;
  height: 6px;
  background: #FF6700;
  animation-delay: 2s;
}

.particle-3 {
  bottom: 30%;
  left: 50%;
  animation-delay: 4s;
}

@keyframes particle-float {
  0%, 100% {
    transform: translateY(0) scale(1);
    opacity: 0.5;
  }
  50% {
    transform: translateY(-30px) scale(1.5);
    opacity: 1;
  }
}

.about-text .section-tag {
  margin-left: 0;
}

.about-text h2 {
  margin-bottom: 20px;
}

.about-text > p {
  font-size: 1.05rem;
  line-height: 1.8;
  margin-bottom: 20px;
}

.about-features {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 32px;
}

.about-feature {
  display: flex;
  align-items: center;
  gap: 12px;
}

.about-feature .check {
  width: 24px;
  height: 24px;
  background: var(--color-accent-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}

/* CTA */
.cta {
  background: var(--color-bg-primary);
}

.cta-card {
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-warm));
  border-radius: var(--radius-xl);
  padding: 80px;
  text-align: center;
  box-shadow: var(--shadow-xl);
  position: relative;
  overflow: hidden;
}

.cta-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 50%);
  animation: pulse-gentle 4s ease-in-out infinite;
}

.cta-content {
  position: relative;
  z-index: 1;
}

.cta-content h2 {
  color: white;
  font-size: 2.5rem;
  margin-bottom: 16px;
}

.cta-content p {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.25rem;
  margin-bottom: 40px;
}

.cta-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}

.cta-actions .btn-primary {
  background: white;
  color: var(--color-accent-primary);
}

.cta-actions .btn-primary:hover {
  background: var(--color-bg-primary);
  transform: translateY(-2px);
}

.cta-actions .btn-secondary {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.5);
  color: white;
}

.cta-actions .btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: white;
}

/* Footer */
.footer {
  background: var(--color-text-primary);
  color: white;
  padding: 80px 0 32px;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  margin-bottom: 60px;
}

.footer-brand .logo-text {
  color: white;
  background: none;
  -webkit-text-fill-color: white;
}

.footer-brand p {
  color: rgba(255, 255, 255, 0.5);
  margin-top: 12px;
}

.dolphin-logo-small {
  width: 24px;
  height: 24px;
}

.dolphin-svg-small {
  width: 100%;
  height: 100%;
}

.footer-links {
  display: flex;
  gap: 80px;
}

.footer-column {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer-column h4 {
  color: white;
  font-size: 1rem;
  margin-bottom: 8px;
}

.footer-column a {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.95rem;
}

.footer-column a:hover {
  color: var(--color-accent-primary);
}

.footer-bottom {
  text-align: center;
  padding-top: 32px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.4);
  font-size: 0.875rem;
}

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #FF6700 0%, #FF8C1A 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 4px 16px rgba(255, 103, 0, 0.35);
  transition: all 0.3s ease;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 24px rgba(255, 103, 0, 0.5);
}

.back-to-top span {
  line-height: 1;
}

/* Responsive */
@media (max-width: 1024px) {
  .links-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .articles-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .about-content {
    gap: 48px;
  }

  .nav-categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-desc {
    font-size: 1rem;
  }

  .hero-actions {
    flex-direction: column;
  }

  .links-grid {
    grid-template-columns: 1fr;
  }

  .articles-grid {
    grid-template-columns: 1fr;
  }

  .nav-categories-grid {
    grid-template-columns: 1fr;
  }

  .about-content {
    grid-template-columns: 1fr;
  }

  .about-image {
    order: -1;
  }

  .cta-card {
    padding: 48px 24px;
  }

  .cta-actions {
    flex-direction: column;
  }

  .footer-content {
    flex-direction: column;
    gap: 40px;
  }

  .footer-links {
    flex-wrap: wrap;
    gap: 40px;
  }

  .nav-links a:not(.nav-btn) {
    display: none;
  }
}
</style>
