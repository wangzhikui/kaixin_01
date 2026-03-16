<script setup>
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { articles } from '../data/articles'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const route = useRoute()
const router = useRouter()

// 页面加载时滚动到顶部
onMounted(() => {
  window.scrollTo({ top: 0, behavior: 'auto' })
})

// 根据ID获取文章
const article = computed(() => {
  const id = parseInt(route.params.id)
  return articles.find(a => a.id === id) || articles[0]
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!article.value) return ''
  return md.render(article.value.content)
})

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="article-page">
    <!-- 导航 -->
    <nav class="navbar">
      <div class="container nav-content">
        <div class="logo" @click="goBack" style="cursor: pointer;">
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
              <rect x="10" y="40" width="80" height="50" rx="8" fill="url(#chipGrad)" opacity="0.9"/>
              <rect x="15" y="45" width="70" height="40" rx="4" fill="#0f0f23"/>
              <line x1="25" y1="55" x2="75" y2="55" stroke="#00D4FF" stroke-width="1.5" opacity="0.8"/>
              <line x1="25" y1="65" x2="75" y2="65" stroke="#00D4FF" stroke-width="1.5" opacity="0.6"/>
              <line x1="25" y1="75" x2="75" y2="75" stroke="#00D4FF" stroke-width="1.5" opacity="0.4"/>
              <circle cx="25" cy="55" r="3" fill="#00D4FF"/>
              <circle cx="75" cy="55" r="3" fill="#00D4FF"/>
              <path d="M30 28 Q35 15, 50 18 Q65 12, 75 25 Q82 35, 78 42 Q72 48, 65 45 Q58 42, 55 48 Q50 55, 45 52 Q38 48, 35 38 Q32 32, 30 28" fill="url(#dolphinGrad)" opacity="0.95"/>
              <circle cx="58" cy="28" r="2.5" fill="#0f0f23"/>
            </svg>
          </div>
          <span class="logo-text">AI老魁</span>
        </div>
        <div class="nav-links">
          <a href="/#tutorials">OpenClaw实战笔记</a>
          <a href="/#navigation">AI网址导航</a>
          <a href="/#about">关于</a>
          <a href="/#contact" class="btn btn-primary nav-btn">联系我</a>
        </div>
      </div>
    </nav>

    <!-- 文章内容 -->
    <article class="article-container">
      <div class="container">
        <a class="back-link" @click="goBack">← 返回教程列表</a>

        <header class="article-header">
          <div class="article-meta">
            <span class="article-category">{{ article.category }}</span>
            <span class="article-date">{{ article.date }}</span>
            <span class="read-time">{{ article.readTime }} 阅读</span>
          </div>
          <h1>{{ article.title }}</h1>
          <p class="article-excerpt">{{ article.excerpt }}</p>
        </header>

        <div class="article-content" v-html="renderedContent"></div>
      </div>
    </article>

    <!-- 底部 -->
    <footer class="footer">
      <div class="container">
        <div class="footer-bottom">
          <p>&copy; {{ new Date().getFullYear() }} AI老魁. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.article-page {
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

.article-container {
  padding: 120px 0 60px;
  min-height: calc(100vh - 200px);
}

.back-link {
  display: inline-block;
  color: var(--color-accent-primary);
  font-weight: 500;
  margin-bottom: 32px;
  cursor: pointer;
}

.back-link:hover {
  text-decoration: underline;
}

.article-header {
  margin-bottom: 40px;
}

.article-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
  align-items: center;
}

.article-category {
  padding: 4px 12px;
  background: rgba(255, 103, 0, 0.1);
  color: var(--color-accent-primary);
  border-radius: 50px;
  font-size: 0.8rem;
  font-weight: 500;
}

.article-date, .read-time {
  font-size: 0.9rem;
  color: var(--color-text-muted);
}

.article-header h1 {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 16px;
  line-height: 1.3;
}

.article-excerpt {
  font-size: 1.15rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
}

.article-content {
  background: white;
  border-radius: var(--radius-lg);
  padding: 48px;
  border: 1px solid var(--color-border-light);
}

.article-content :deep(h2) {
  font-size: 1.75rem;
  font-weight: 600;
  margin: 40px 0 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-light);
}

.article-content :deep(h3) {
  font-size: 1.35rem;
  font-weight: 600;
  margin: 32px 0 16px;
}

.article-content :deep(p) {
  margin: 16px 0;
  line-height: 1.8;
  color: var(--color-text-primary);
}

.article-content :deep(ul), .article-content :deep(ol) {
  margin: 16px 0;
  padding-left: 24px;
}

.article-content :deep(li) {
  margin: 8px 0;
  line-height: 1.7;
}

.article-content :deep(code) {
  background: var(--color-bg-secondary);
  padding: 2px 8px;
  border-radius: 4px;
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
}

.article-content :deep(pre) {
  background: #1a1a2e;
  color: #e0e0e0;
  padding: 20px;
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin: 20px 0;
}

.article-content :deep(pre code) {
  background: none;
  padding: 0;
  color: inherit;
}

.article-content :deep(a) {
  color: var(--color-accent-primary);
  text-decoration: none;
}

.article-content :deep(a:hover) {
  text-decoration: underline;
}

.article-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
}

.article-content :deep(th), .article-content :deep(td) {
  padding: 12px 16px;
  border: 1px solid var(--color-border-light);
  text-align: left;
}

.article-content :deep(th) {
  background: var(--color-bg-secondary);
  font-weight: 600;
}

.article-content :deep(blockquote) {
  border-left: 4px solid var(--color-accent-primary);
  padding-left: 20px;
  margin: 20px 0;
  color: var(--color-text-secondary);
  font-style: italic;
}

.footer {
  background: var(--color-text-primary);
  color: white;
  padding: 32px 0;
}

.footer-bottom {
  text-align: center;
}

.footer-bottom p {
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.875rem;
}

@media (max-width: 768px) {
  .article-header h1 {
    font-size: 1.75rem;
  }

  .article-content {
    padding: 24px;
  }

  .nav-links a:not(.nav-btn) {
    display: none;
  }
}
</style>
