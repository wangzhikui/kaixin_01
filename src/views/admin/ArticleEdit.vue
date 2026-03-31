<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { articlesApi, articleCategoriesApi } from '../../api'
import { ElMessage } from 'element-plus'
import MarkdownIt from 'markdown-it'

const router = useRouter()
const route = useRoute()
const articleId = route.params.id

const mdParser = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true
})

const form = ref({
  title: '',
  filename: '',
  categories: [],
  status: 'draft',
  order: 0,
  excerpt: '',
  readTime: '1 min',
  content: ''
})

const allCategories = ref([])
const loading = ref(false)
const saving = ref(false)
const editorRef = ref(null)

// 实时预览展开状态
const showPreview = ref(false)

// 全屏状态
const isFullscreen = ref(false)
const fullscreenContainer = ref(null)

// 分类管理弹框
const showCategoryManager = ref(false)
const catTabActive = ref('select')
const newCatName = ref('')
const newCatIcon = ref('')

defineOptions({
  name: 'ArticleEdit'
})

onMounted(async () => {
  try {
    const categoriesData = await articleCategoriesApi.getAll()
    allCategories.value = categoriesData || []
  } catch (error) {
    console.error('Failed to load categories:', error)
  }

  if (articleId && articleId !== 'new') {
    loading.value = true
    try {
      const article = await articlesApi.getById(articleId)
      if (article) {
        form.value = {
          title: article.title || '',
          filename: article.filename || '',
          categories: article.categories || (article.category ? [article.category] : []),
          status: article.status || 'draft',
          order: article.order || 0,
          excerpt: article.excerpt || '',
          readTime: article.readTime || '1 min',
          content: article.content || ''
        }
      }
    } catch (error) {
      ElMessage.error('加载文章失败')
    } finally {
      loading.value = false
    }
  }

  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

const renderedContent = computed(() => {
  if (!form.value.content) return ''
  return mdParser.render(form.value.content)
})

const selectedCategoryNames = computed(() => form.value.categories)

function removeCategory(catName) {
  form.value.categories = form.value.categories.filter(c => c !== catName)
}

function addCategory(catName) {
  if (!form.value.categories.includes(catName)) {
    form.value.categories.push(catName)
  }
}

function isCategorySelected(catName) {
  return form.value.categories.includes(catName)
}

function toggleCategorySelect(catName) {
  if (isCategorySelected(catName)) {
    removeCategory(catName)
  } else {
    addCategory(catName)
  }
}

async function handleCreateCategory() {
  const name = newCatName.value.trim()
  if (!name) {
    ElMessage.warning('请输入分类名称')
    return
  }

  try {
    const newCat = {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name: name,
      icon: newCatIcon.value || '📁',
      order: 999
    }
    await articleCategoriesApi.create(newCat)
    allCategories.value.push(newCat)
    newCatName.value = ''
    newCatIcon.value = ''
    ElMessage.success(`已创建分类「${name}」`)
    // Switch to select tab to show the new category
    catTabActive.value = 'select'
  } catch (error) {
    ElMessage.error('创建分类失败')
  }
}

async function handleUpdateCategory(cat) {
  try {
    await articleCategoriesApi.update(cat.id, { name: cat.name, icon: cat.icon })
    ElMessage.success('更新成功')
  } catch (error) {
    ElMessage.error('更新分类失败')
  }
}

async function handleDeleteCategory(catId) {
  try {
    await articleCategoriesApi.delete(catId)
    allCategories.value = allCategories.value.filter(c => c.id !== catId)
    // Remove from selected if it was selected
    const cat = allCategories.value.find(c => c.id === catId)
    if (cat) {
      removeCategory(cat.name)
    }
    ElMessage.success('删除成功')
  } catch (error) {
    ElMessage.error('删除分类失败')
  }
}

function togglePreview() {
  showPreview.value = !showPreview.value
}

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    fullscreenContainer.value?.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

function handleFullscreenChange() {
  isFullscreen.value = !!document.fullscreenElement
}

function insertMarkdown(type) {
  const textarea = editorRef.value
  if (!textarea) return

  const start = textarea.selectionStart
  const end = textarea.selectionEnd
  const text = form.value.content
  const selected = text.substring(start, end)

  let insert = ''
  let cursorOffset = 0

  switch (type) {
    case 'bold':
      insert = `**${selected || '粗体文本'}**`
      cursorOffset = selected ? 0 : -2
      break
    case 'italic':
      insert = `*${selected || '斜体文本'}*`
      cursorOffset = selected ? 0 : -1
      break
    case 'code':
      insert = `\`${selected || '代码'}\``
      cursorOffset = selected ? 0 : -1
      break
    case 'codeblock':
      insert = `\n\`\`\`\n${selected || '代码块'}\n\`\`\`\n`
      cursorOffset = selected ? 0 : -4
      break
    case 'link':
      insert = `[${selected || '链接文本'}](url)`
      cursorOffset = selected ? -1 : -4
      break
    case 'image':
      insert = `![${selected || '图片描述'}](imageUrl)`
      cursorOffset = selected ? -1 : -9
      break
    case 'quote':
      insert = `\n> ${selected || '引用文本'}\n`
      cursorOffset = selected ? 0 : -1
      break
    case 'ul':
      insert = `\n- ${selected || '列表项'}\n`
      cursorOffset = selected ? 0 : -1
      break
    case 'ol':
      insert = `\n1. ${selected || '列表项'}\n`
      cursorOffset = selected ? 0 : -1
      break
    case 'h1':
      insert = `\n# ${selected || '标题1'}\n`
      cursorOffset = selected ? 0 : -1
      break
    case 'h2':
      insert = `\n## ${selected || '标题2'}\n`
      cursorOffset = selected ? 0 : -1
      break
    case 'h3':
      insert = `\n### ${selected || '标题3'}\n`
      cursorOffset = selected ? 0 : -1
      break
    case 'hr':
      insert = '\n---\n'
      break
    default:
      return
  }

  form.value.content = text.substring(0, start) + insert + text.substring(end)

  setTimeout(() => {
    textarea.focus()
    const newPos = start + insert.length + cursorOffset
    textarea.setSelectionRange(newPos, newPos)
  }, 0)
}

async function handleSave() {
  if (!form.value.title) {
    ElMessage.warning('请输入标题')
    return
  }

  saving.value = true
  try {
    const saveData = {
      ...form.value,
      category: form.value.categories[0] || ''
    }

    if (articleId && articleId !== 'new') {
      await articlesApi.update(articleId, saveData)
      ElMessage.success('更新成功')
    } else {
      await articlesApi.create(saveData)
      ElMessage.success('创建成功')
    }
  } catch (error) {
    ElMessage.error('保存失败')
  } finally {
    saving.value = false
  }
}

function handleCancel() {
  router.push('/admin/articles')
}
</script>

<template>
  <div class="article-edit" v-loading="loading" ref="fullscreenContainer">
    <!-- 顶部导航 -->
    <header class="top-nav">
      <div class="nav-left">
        <el-button text @click="handleCancel" class="back-btn">
          返回
        </el-button>
        <div class="title-wrap">
          <div class="field-group">
            <label class="field-label">文章标题</label>
            <input
              v-model="form.title"
              type="text"
              class="title-input"
              placeholder="请输入文章标题"
            />
          </div>
          <div class="field-group">
            <label class="field-label">文件名</label>
            <input
              v-model="form.filename"
              type="text"
              class="filename-input"
              placeholder="01-文章.md"
            />
          </div>
        </div>
      </div>

      <div class="nav-right">
        <el-button
          :type="showPreview ? 'primary' : 'default'"
          text
          size="small"
          @click="togglePreview"
        >
          {{ showPreview ? '隐藏预览' : '显示预览' }}
        </el-button>
        <el-button text size="small" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '全屏' }}
        </el-button>
        <div class="status-toggle">
          <span
            class="status-btn"
            :class="{ active: form.status === 'draft' }"
            @click="form.status = 'draft'"
          >
            草稿
          </span>
          <span
            class="status-btn"
            :class="{ active: form.status === 'publish' }"
            @click="form.status = 'publish'"
          >
            发布
          </span>
        </div>
        <span class="save-btn" :class="{ loading: saving }" @click="handleSave">
          保存
        </span>
      </div>
    </header>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-group">
        <button class="tool-btn" @click="insertMarkdown('bold')" title="加粗">
          <strong>B</strong>
        </button>
        <button class="tool-btn" @click="insertMarkdown('italic')" title="斜体">
          <em>I</em>
        </button>
        <button class="tool-btn" @click="insertMarkdown('code')" title="行内代码">
          <code>&lt;/&gt;</code>
        </button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button class="tool-btn" @click="insertMarkdown('h1')" title="标题1">H1</button>
        <button class="tool-btn" @click="insertMarkdown('h2')" title="标题2">H2</button>
        <button class="tool-btn" @click="insertMarkdown('h3')" title="标题3">H3</button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button class="tool-btn" @click="insertMarkdown('quote')" title="引用">❝</button>
        <button class="tool-btn" @click="insertMarkdown('ul')" title="无序列表">•-</button>
        <button class="tool-btn" @click="insertMarkdown('ol')" title="有序列表">1.</button>
      </div>

      <div class="toolbar-divider"></div>

      <div class="toolbar-group">
        <button class="tool-btn" @click="insertMarkdown('link')" title="链接">🔗</button>
        <button class="tool-btn" @click="insertMarkdown('image')" title="图片">🖼</button>
        <button class="tool-btn" @click="insertMarkdown('hr')" title="分割线">—</button>
        <button class="tool-btn" @click="insertMarkdown('codeblock')" title="代码块">{ }</button>
      </div>

      <div class="toolbar-spacer"></div>

      <!-- 分类 -->
      <div class="toolbar-cats">
        <span
          v-for="cat in selectedCategoryNames"
          :key="cat"
          class="cat-chip selected"
          @click="removeCategory(cat)"
        >
          {{ cat }}
          <span class="remove">×</span>
        </span>

        <span class="cat-add-btn" @click="showCategoryManager = true">+ 添加分类</span>

        <el-dialog v-model="showCategoryManager" title="分类管理" width="500px">
          <el-tabs v-model="catTabActive">
            <el-tab-pane label="选择分类" name="select">
              <div class="cat-select-list">
                <div
                  v-for="cat in allCategories"
                  :key="cat.id"
                  class="cat-select-item"
                  :class="{ selected: isCategorySelected(cat.name) }"
                  @click="toggleCategorySelect(cat.name)"
                >
                  <span class="cat-icon">{{ cat.icon }}</span>
                  <span class="cat-name">{{ cat.name }}</span>
                  <span v-if="isCategorySelected(cat.name)" class="cat-check">✓</span>
                </div>
              </div>
            </el-tab-pane>
            <el-tab-pane label="新建分类" name="create">
              <div class="cat-create-form">
                <el-input v-model="newCatName" placeholder="输入分类名称" />
                <el-input v-model="newCatIcon" placeholder="图标（可选）" class="cat-icon-input" />
                <el-button type="primary" @click="handleCreateCategory">创建</el-button>
              </div>
            </el-tab-pane>
            <el-tab-pane label="管理分类" name="manage">
              <div class="cat-manage-list">
                <div v-if="allCategories.length === 0" class="cat-empty">暂无分类</div>
                <div
                  v-for="cat in allCategories"
                  :key="cat.id"
                  class="cat-manage-item"
                >
                  <span class="cat-icon">{{ cat.icon }}</span>
                  <el-input v-model="cat.name" size="small" class="cat-name-edit" @blur="handleUpdateCategory(cat)" />
                  <el-button type="danger" size="small" text @click="handleDeleteCategory(cat.id)">删除</el-button>
                </div>
              </div>
            </el-tab-pane>
          </el-tabs>
        </el-dialog>
      </div>
    </div>

    <!-- 编辑区域 -->
    <div class="editor-container" :class="{ 'with-preview': showPreview }">
      <div class="editor-pane">
        <textarea
          ref="editorRef"
          v-model="form.content"
          class="editor-textarea"
          placeholder="开始写作..."
        ></textarea>
      </div>

      <div v-if="showPreview" class="preview-pane">
        <div class="preview-header">
          <span>预览</span>
        </div>
        <div class="preview-content markdown-body" v-html="renderedContent"></div>
        <div v-if="!form.content" class="preview-empty">暂无内容</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.article-edit {
  background: #f5f5f5;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 顶部导航 */
.top-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-left {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn {
  color: #666;
  font-size: 14px;
  padding: 6px 12px;
}

.back-btn:hover {
  color: #333;
  background: #f5f5f5;
}

.title-wrap {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.field-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.field-label {
  font-size: 13px;
  color: #999;
  white-space: nowrap;
}

.title-input {
  font-size: 16px;
  font-weight: 600;
  border: none;
  outline: none;
  background: transparent;
  color: #1a1a1a;
  width: 300px;
}

.title-input::placeholder {
  color: #ccc;
}

.filename-input {
  border: none;
  outline: none;
  background: transparent;
  font-family: monospace;
  font-size: 13px;
  color: #1a1a1a;
  width: 150px;
}

.filename-input::placeholder {
  color: #ccc;
}

.status-toggle {
  display: flex;
  border: 1px solid #ddd;
  border-radius: 6px;
  overflow: hidden;
}

.status-btn {
  padding: 4px 12px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  background: #fafafa;
  transition: all 0.15s;
}

.status-btn:first-child {
  border-right: 1px solid #ddd;
}

.status-btn:hover {
  background: #f0f0f0;
}

.status-btn.active {
  background: #1a1a1a;
  color: white;
}

.save-btn {
  padding: 4px 16px;
  font-size: 12px;
  color: white;
  background: #1a1a1a;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.save-btn:hover {
  background: #333;
}

.save-btn.loading {
  opacity: 0.7;
  cursor: not-allowed;
}

.filename {
  font-family: monospace;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.draft {
  background: #f5f5f5;
  color: #666;
}

.status-badge.publish {
  background: #e6f7e6;
  color: #52c41a;
}

.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.nav-right .el-button {
  font-size: 13px;
}

/* 工具栏 */
.toolbar {
  display: flex;
  align-items: center;
  padding: 8px 24px;
  background: white;
  border-bottom: 1px solid #e5e5e5;
  gap: 8px;
}

.toolbar-group {
  display: flex;
  align-items: center;
  gap: 2px;
}

.tool-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #666;
  font-size: 13px;
  transition: all 0.15s;
}

.tool-btn:hover {
  background: #f0f0f0;
  color: #333;
}

.tool-btn:active {
  background: #e0e0e0;
}

.toolbar-divider {
  width: 1px;
  height: 20px;
  background: #e5e5e5;
  margin: 0 8px;
}

.toolbar-spacer {
  flex: 1;
}

/* 分类 */
.toolbar-cats {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.cat-chip {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  background: #f0f0f0;
  border-radius: 14px;
  font-size: 12px;
  color: #666;
  cursor: pointer;
  transition: all 0.15s;
}

.cat-chip:hover {
  background: #e0e0e0;
}

.cat-chip.selected {
  background: #1a1a1a;
  color: white;
}

.cat-chip .remove {
  font-size: 14px;
  opacity: 0.7;
}

.cat-chip .remove:hover {
  opacity: 1;
}

.cat-add-btn {
  font-size: 12px;
  color: #666;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 14px;
  background: #f5f5f5;
  transition: all 0.15s;
}

.cat-add-btn:hover {
  background: #e0e0e0;
  color: #333;
}

/* 编辑区域 */
.editor-container {
  flex: 1;
  display: flex;
  overflow: hidden;
  background: white;
}

.editor-pane {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.editor-container.with-preview .editor-pane {
  border-right: 1px solid #e5e5e5;
}

.editor-textarea {
  flex: 1;
  width: 100%;
  border: none;
  outline: none;
  padding: 40px;
  font-size: 16px;
  line-height: 1.8;
  font-family: 'Georgia', serif;
  resize: none;
  background: transparent;
  color: #333;
}

.editor-textarea::placeholder {
  color: #ccc;
}

/* 预览区域 */
.preview-pane {
  width: 50%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.preview-header {
  padding: 12px 20px;
  background: #fafafa;
  border-bottom: 1px solid #e5e5e5;
  font-size: 12px;
  font-weight: 500;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.preview-content {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  font-family: 'Georgia', serif;
  font-size: 16px;
  line-height: 1.8;
}

.preview-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ccc;
  font-size: 14px;
}

/* Markdown 样式 */
.markdown-body {
  color: #333;
}

.markdown-body :deep(h1) {
  font-size: 2em;
  font-weight: 700;
  margin: 0.67em 0 0.5em;
  padding-bottom: 0.3em;
  border-bottom: 1px solid #eee;
}

.markdown-body :deep(h2) {
  font-size: 1.5em;
  font-weight: 600;
  margin: 1em 0 0.5em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid #eee;
}

.markdown-body :deep(h3) {
  font-size: 1.25em;
  font-weight: 600;
  margin: 1em 0 0.5em;
}

.markdown-body :deep(p) {
  margin: 0 0 1em;
}

.markdown-body :deep(ul),
.markdown-body :deep(ol) {
  margin: 0 0 1em;
  padding-left: 2em;
}

.markdown-body :deep(li) {
  margin: 0.25em 0;
}

.markdown-body :deep(blockquote) {
  margin: 0 0 1em;
  padding: 0.5em 1em;
  border-left: 4px solid #ddd;
  background: #f9f9f9;
  color: #666;
}

.markdown-body :deep(code) {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.9em;
  padding: 0.2em 0.4em;
  background: #f5f5f5;
  border-radius: 3px;
  color: #e83e8c;
}

.markdown-body :deep(pre) {
  margin: 0 0 1em;
  padding: 1em;
  background: #1e1e1e;
  border-radius: 6px;
  overflow-x: auto;
}

.markdown-body :deep(pre code) {
  background: transparent;
  color: #d4d4d4;
  padding: 0;
}

.markdown-body :deep(a) {
  color: #2563eb;
  text-decoration: none;
}

.markdown-body :deep(a:hover) {
  text-decoration: underline;
}

.markdown-body :deep(hr) {
  border: none;
  border-top: 1px solid #ddd;
  margin: 2em 0;
}

.markdown-body :deep(img) {
  max-width: 100%;
  border-radius: 4px;
}

.markdown-body :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 0 0 1em;
}

.markdown-body :deep(th),
.markdown-body :deep(td) {
  border: 1px solid #ddd;
  padding: 8px 12px;
  text-align: left;
}

.markdown-body :deep(th) {
  background: #f5f5f5;
  font-weight: 600;
}

/* 分类管理弹框 */
.cat-select-list {
  max-height: 300px;
  overflow-y: auto;
}

.cat-select-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}

.cat-select-item:hover {
  background: #f5f5f5;
}

.cat-select-item.selected {
  background: #e8f5e9;
}

.cat-select-item .cat-icon {
  font-size: 16px;
}

.cat-select-item .cat-name {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.cat-select-item .cat-check {
  color: #52c41a;
  font-weight: bold;
}

.cat-create-form {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 8px 0;
}

.cat-create-form .cat-icon-input {
  margin-top: 0;
}

.cat-manage-list {
  max-height: 300px;
  overflow-y: auto;
}

.cat-empty {
  text-align: center;
  color: #999;
  padding: 40px 0;
  font-size: 14px;
}

.cat-manage-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.cat-manage-item:last-child {
  border-bottom: none;
}

.cat-manage-item .cat-icon {
  font-size: 16px;
  width: 24px;
  text-align: center;
}

.cat-manage-item .cat-name-edit {
  flex: 1;
}

/* 响应式 */
@media (max-width: 1024px) {
  .editor-container.with-preview .editor-pane,
  .editor-container.with-preview .preview-pane {
    width: 100%;
  }

  .editor-container.with-preview {
    flex-direction: column;
  }

  .preview-pane {
    height: 50vh;
    border-top: 1px solid #e5e5e5;
    border-right: none;
  }
}

@media (max-width: 768px) {
  .top-nav {
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
  }

  .nav-left,
  .nav-right {
    width: 100%;
    justify-content: space-between;
  }

  .title-input {
    width: 200px;
  }

  .toolbar {
    overflow-x: auto;
    padding: 8px 16px;
  }

  .editor-textarea {
    padding: 20px;
  }

  .preview-content {
    padding: 20px;
  }
}
</style>
