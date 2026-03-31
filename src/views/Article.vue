<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import MarkdownIt from 'markdown-it'
import { articlesList } from '../data/articles-list'
import AppHeader from '../components/AppHeader.vue'
import AppFooter from '../components/AppFooter.vue'

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
})

const route = useRoute()
const router = useRouter()
const articleContent = ref('')
const loading = ref(true)

// 页面加载时滚动到顶部
onMounted(async () => {
  window.scrollTo({ top: 0, behavior: 'auto' })
})

// 根据ID获取文章
const article = computed(() => {
  const id = parseInt(route.params.id)
  return articlesList.find(a => a.id === id) || articlesList[0]
})

// 动态加载 Markdown 文件
const loadContent = async () => {
  if (!article.value) {
    loading.value = false
    return
  }

  try {
    // 使用动态 import 加载 Markdown 文件
    const modules = import.meta.glob('../articles/*.md', { query: '?raw', import: 'default', eager: true })
    const filename = article.value.filename
    const content = modules[`../articles/${filename}`]
    articleContent.value = content || ''
  } catch (e) {
    console.error('加载文章内容失败:', e)
    articleContent.value = ''
  }
  loading.value = false
}

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!articleContent.value) return ''
  return md.render(articleContent.value)
})

// 加载内容
loadContent()

function goBack() {
  router.push('/')
}
</script>

<template>
  <div class="article-page">
    <!-- 导航 -->
    <AppHeader />

    <!-- 文章内容 -->
    <article class="article-container">
      <div class="container">
        <a class="back-link" @click="goBack">← 返回教程列表</a>

        <header class="article-header">
          <div class="article-meta">
            <span class="article-category">{{ article?.category || 'OpenClaw' }}</span>
            <span class="article-date">{{ article?.date }}</span>
            <span class="read-time">{{ article?.readTime }} 阅读</span>
          </div>
          <h1>{{ article?.title }}</h1>
          <p class="article-excerpt">{{ article?.excerpt }}</p>
        </header>

        <div v-if="loading" class="loading">加载中...</div>
        <div v-else class="article-content" v-html="renderedContent"></div>
      </div>
    </article>

    <!-- 底部 -->
    <AppFooter />
  </div>
</template>

<style scoped>
.article-page {
  min-height: 100vh;
  background: var(--color-bg-secondary);
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
  background: rgba(79, 70, 229, 0.1);
  color: var(--color-primary);
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

.loading {
  text-align: center;
  padding: 60px;
  color: var(--color-text-muted);
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
