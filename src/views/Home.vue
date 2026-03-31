<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { articlesList } from '../data/articles-list'
import { categoriesApi, linksApi } from '../api'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const router = useRouter()
const isVisible = ref(false)
const categories = ref([])
const links = ref([])

// Top 20 AI Tools - Current popular AI websites
const topAiTools = [
  { name: 'Claude', url: 'https://claude.ai/', desc: 'Anthropic开发的AI助手，擅长写作、分析和代码', logo: 'https://claude.ai/favicon.ico' },
  { name: 'ChatGPT', url: 'https://chatgpt.com/', desc: 'OpenAI开发的对话式AI，支持多模态交互', logo: 'https://chatgpt.com/favicon.ico' },
  { name: 'Cursor', url: 'https://cursor.com/', desc: 'AI驱动的代码编辑器，集成GPT-4和Claude', logo: 'https://cursor.com/favicon.ico' },
  { name: 'Midjourney', url: 'https://www.midjourney.com/', desc: '强大的AI图像生成工具，创意设计首选', logo: 'https://www.midjourney.com/favicon.ico' },
  { name: 'Stable Diffusion', url: 'https://stability.ai/', desc: '开源AI图像生成模型，支持本地部署', logo: 'https://stability.ai/favicon.ico' },
  { name: 'GitHub Copilot', url: 'https://github.com/features/copilot', desc: '微软/OpenAI开发的AI编程助手', logo: 'https://github.githubassets.com/favicons/favicon.svg' },
  { name: 'Notion AI', url: 'https://www.notion.so/product/ai', desc: 'Notion集成的AI写作助手', logo: 'https://www.notion.so/images/favicon.ico' },
  { name: 'Perplexity', url: 'https://www.perplexity.ai/', desc: 'AI搜索引擎，实时获取最新信息', logo: 'https://www.perplexity.ai/favicon.ico' },
  { name: 'Gemini', url: 'https://gemini.google.com/', desc: 'Google开发的多模态AI助手', logo: 'https://gemini.google.com/favicon.ico' },
  { name: 'Copilot', url: 'https://copilot.microsoft.com/', desc: '微软AI助手，集成Bing搜索能力', logo: 'https://copilot.microsoft.com/favicon.ico' },
  { name: 'Character.AI', url: 'https://character.ai/', desc: 'AI角色扮演和对话平台', logo: 'https://character.ai/favicon.ico' },
  { name: 'Kimi', url: 'https://kimi.moonshot.cn/', desc: '月之暗面开发的AI助手，超长上下文', logo: 'https://kimi.moonshot.cn/favicon.ico' },
  { name: '智谱AI', url: 'https://www.zhipuai.cn/', desc: '国产大模型，GLM系列模型提供商', logo: 'https://www.zhipuai.cn/favicon.ico' },
  { name: '通义千问', url: 'https://tongyi.aliyun.com/', desc: '阿里云开发的大语言模型', logo: 'https://tongyi.aliyun.com/favicon.ico' },
  { name: '文心一言', url: 'https://yiyan.baidu.com/', desc: '百度开发的生成式AI产品', logo: 'https://yiyan.baidu.com/favicon.ico' },
  { name: '讯飞星火', url: 'https://xinghuo.xfyun.cn/', desc: '科大讯飞开发的认知智能大模型', logo: 'https://xinghuo.xfyun.cn/favicon.ico' },
  { name: 'Dify', url: 'https://dify.ai/', desc: '开源的LLM应用开发平台', logo: 'https://dify.ai/favicon.ico' },
  { name: 'Coze', url: 'https://www.coze.cn/', desc: '字节跳动开发的AI应用平台', logo: 'https://www.coze.cn/favicon.ico' },
  { name: 'LangChain', url: 'https://www.langchain.com/', desc: '开发LLM应用的框架和工具', logo: 'https://www.langchain.com/favicon.ico' },
  { name: 'Lovable', url: 'https://lovable.dev/', desc: 'AI驱动的应用构建平台', logo: 'https://lovable.dev/favicon.ico' }
]

onMounted(async () => {
  try {
    const [catsData, linksData] = await Promise.all([
      categoriesApi.getAll(),
      linksApi.getAll()
    ])
    categories.value = (catsData || []).sort((a, b) => (a.order || 0) - (b.order || 0))
    links.value = linksData || []
  } catch (error) {
    console.error('Failed to load navigation data:', error)
  }
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})

// 导航预览数据 - 取前6个分类
const navigationPreview = computed(() => {
  return categories.value.slice(0, 6).map(cat => ({
    ...cat,
    sites: links.value.filter(link => link.categoryId === cat.id).slice(0, 3)
  }))
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

function handleImgError(e) {
  // Fallback for missing favicons
  e.target.style.display = 'none'
}
</script>

<template>
  <div class="app">
    <!-- Navigation -->
    <AppHeader />

    <!-- Hero Section - AI Coding -->
    <section class="hero">
      <div class="hero-bg">
        <div class="orb orb-1"></div>
        <div class="orb orb-2"></div>
        <div class="orb orb-3"></div>
      </div>
      <div class="container hero-content" :class="{ visible: isVisible }">
        <div class="hero-badge">
          <span>🆕 最新更新</span>
        </div>
        <h1 class="hero-title">
          AI Coding<br />
          <span class="highlight">实战笔记</span>
        </h1>
        <p class="hero-desc">
          探索 AI 编程的最佳实践。从 Claude Code、Cursor 到 OpenClaw，记录最实用的 AI 编码技巧，
          让 AI 成为你的得力助手。
        </p>
        <div class="hero-actions">
          <a href="#tutorials" class="btn btn-primary">
            开始学习
            <span class="btn-arrow">→</span>
          </a>
          <a href="#toptools" class="btn btn-secondary">探索工具</a>
        </div>
      </div>
    </section>

    <!-- Top AI Tools Section -->
    <section id="toptools" class="top-tools section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">热门工具</span>
          <h2>🔥 Top 20 AI 工具</h2>
          <p>当前最火的AI工具一网打尽，快速访问提升效率</p>
        </div>
        <div class="tools-grid">
          <a
            v-for="tool in topAiTools"
            :key="tool.name"
            :href="tool.url"
            target="_blank"
            class="tool-card"
          >
            <div class="tool-logo">
              <img :src="tool.logo" :alt="tool.name" @error="handleImgError" />
            </div>
            <div class="tool-info">
              <span class="tool-name">{{ tool.name }}</span>
              <span class="tool-desc">{{ tool.desc }}</span>
            </div>
          </a>
        </div>
      </div>
    </section>

    <!-- Tutorials Section -->
    <section id="tutorials" class="tutorials section">
      <div class="container">
        <div class="section-header">
          <span class="section-tag">学习路径</span>
          <h2>AI 实战笔记</h2>
          <p>从入门到进阶，系统学习 AI 编程工具的使用技巧</p>
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
                      <stop offset="0%" style="stop-color:#14B8A6" />
                      <stop offset="100%" style="stop-color:#2DD4BF" />
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
                  <circle cx="50" cy="50" r="6" fill="#14B8A6" class="node node-1"/>
                  <circle cx="100" cy="80" r="6" fill="#2DD4BF" class="node node-2"/>
                  <circle cx="150" cy="110" r="6" fill="#14B8A6" class="node node-3"/>
                  <circle cx="50" cy="140" r="6" fill="#2DD4BF" class="node node-4"/>
                  <circle cx="100" cy="110" r="4" fill="#14B8A6" class="node node-5"/>
                  <circle cx="150" cy="50" r="4" fill="#2DD4BF" class="node node-6"/>
                  <!-- Chip center -->
                  <rect x="60" y="60" width="80" height="60" rx="8" fill="none" stroke="#14B8A6" stroke-width="2" class="chip-border"/>
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
            <h2>探索 AI Coding 的无限可能</h2>
            <p>
              我是ITLK，一个热爱技术和创新的开发者。这个网站记录了我学习和使用各种 AI 编程工具的过程，
              希望能够帮助更多想要入门 AI Coding 的朋友。
            </p>
            <p>
              从 Claude Code、Cursor 到 OpenClaw，这些 AI 工具正在改变我们写代码的方式。让我们一起探索 AI 编程的奥秘！
            </p>
            <div class="about-features">
              <div class="about-feature">
                <span class="check">✓</span>
                <span>持续更新AI实战笔记</span>
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
    <AppFooter />
  </div>
</template>

<style scoped>
.app {
  overflow-x: hidden;
}

/* Hero */
.hero {
  min-height: 90vh;
  display: flex;
  align-items: center;
  position: relative;
  padding: 120px 0 60px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-primary-bg) 0%, white 50%, var(--color-bg-secondary) 100%);
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
  opacity: 0.6;
}

.orb-1 {
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.2) 0%, transparent 70%);
  top: -250px;
  right: -150px;
}

.orb-2 {
  width: 400px;
  height: 400px;
  background: radial-gradient(circle, rgba(45, 212, 191, 0.15) 0%, transparent 70%);
  bottom: -100px;
  left: -100px;
}

.orb-3 {
  width: 350px;
  height: 350px;
  background: radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%);
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
  background: rgba(20, 184, 166, 0.1);
  border: 1px solid rgba(20, 184, 166, 0.2);
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
  background: linear-gradient(135deg, var(--color-accent-primary), var(--color-accent-secondary));
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

/* Top AI Tools */
.top-tools {
  background: white;
  padding: 80px 0;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 20px;
}

.tool-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 16px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  text-decoration: none;
  transition: var(--transition-base);
  cursor: pointer;
}

.tool-card:hover {
  border-color: var(--color-accent-primary);
  box-shadow: 0 8px 24px rgba(20, 184, 166, 0.15);
  transform: translateY(-4px);
}

.tool-logo {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.tool-logo img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  border-radius: 8px;
}

.tool-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 4px;
}

.tool-name {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text-primary);
}

.tool-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
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
  background: rgba(20, 184, 166, 0.1);
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
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
  animation: fadeInUp 0.6s ease forwards;
  opacity: 0;
  cursor: pointer;
}

.article-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.article-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.article-category {
  padding: 4px 10px;
  background: rgba(20, 184, 166, 0.1);
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
  color: var(--color-primary);
}

/* Navigation */
.navigation {
  background: white;
}

.nav-categories-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.nav-category-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
  border-radius: var(--radius-xl);
  padding: 24px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: var(--shadow-md);
  transition: var(--transition-base);
}

.nav-category-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: var(--shadow-xl);
  transform: translateY(-4px);
}

.category-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
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
  background: rgba(79, 70, 229, 0.08);
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
  background: linear-gradient(135deg, var(--color-primary-bg) 0%, white 100%);
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
  border-radius: var(--radius-2xl);
  overflow: hidden;
  background: linear-gradient(145deg, #1e1b4b 0%, #312e81 50%, #1e1b4b 100%);
  box-shadow:
    0 25px 60px rgba(79, 70, 229, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.chip-layer {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-2xl);
}

.chip-layer.layer-1 {
  background: linear-gradient(135deg, rgba(79, 70, 229, 0.3), transparent);
  animation: layer-rotate 20s linear infinite;
}

.chip-layer.layer-2 {
  background: radial-gradient(circle at 30% 30%, rgba(99, 102, 241, 0.2), transparent);
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
  background: var(--color-primary-light);
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
  background: var(--color-accent-primary);
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
  background: var(--color-primary);
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
  background: var(--color-bg-secondary);
}

.cta-card {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--radius-2xl);
  padding: 80px;
  text-align: center;
  box-shadow: 0 25px 50px -12px rgba(79, 70, 229, 0.25);
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
  background: radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 50%);
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
  color: var(--color-primary);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
}

.cta-actions .btn-primary:hover {
  background: var(--color-bg-secondary);
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

/* Back to Top Button */
.back-to-top {
  position: fixed;
  bottom: 40px;
  right: 40px;
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  color: white;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
  transition: all 0.2s ease;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.back-to-top:hover {
  box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
  transform: translateY(-2px);
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
