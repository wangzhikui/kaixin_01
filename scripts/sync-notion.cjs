// Notion 同步脚本
// 使用方法: node scripts/sync-notion.js
// 需要设置环境变量 NOTION_API_KEY

const fs = require('fs')
const path = require('path')
const { Client } = require('@notionhq/client')

// 配置
const NOTION_API_KEY = process.env.NOTION_API_KEY
const AI_PAGE_ID = '2ff6bc4f-2121-804d-95ef-fa4013bf1be7' // AI 页面 ID

// 文章分类（从 AI 页面下获取）
const ARTICLE_IDS = [
  { id: '3126bc4f-2121-80ba-845f-f7614b817ea6', title: 'openclaw' },
  { id: '3196bc4f-2121-8099-8846-e3f5f423287b', title: 'openclaw全新安装' },
  { id: '31d6bc4f-2121-803b-eb5b5da8e6938de19', title: 'openclaw配置USER.MD等文件' },
  { id: '31e6bc4f-2121-8082-b86b-e2ec9a11c157', title: 'openclaw推荐装的10个skills' },
  { id: '31c6bc4f-2121-800f-8117-ccf948c3558e', title: 'openclaw集成notion' },
  { id: '31f6bc4f-2121-8082-a884-d04a6b93bc76', title: 'openclaw安装tavily-search网页搜索' },
  { id: '31c6bc4f-2121-8033-af99-d8defceb5b8e', title: 'openclaw多agents实战' },
  { id: '31e6bc4f-2121-807c-868b-f11b75c0e286', title: 'openclaw之安装git' },
  { id: '31e6bc4f-2121-80de-b79b-d90ae4a0f4aa', title: 'openclaw实用问题集' },
  { id: '31e6bc4f-2121-80b6-837d-eb901e121416', title: 'openclaw集成企微渠道' }
]

const ARTICLES_DIR = path.join(__dirname, '../src/articles')
const DATA_DIR = path.join(__dirname, '../src/data')

// 辅助函数：slugify
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// 辅助函数：提取纯文本
function extractText(block) {
  if (block.type === 'paragraph') {
    return block.paragraph.rich_text.map(t => t.plain_text).join('')
  } else if (block.type === 'heading_1') {
    return '# ' + block.heading_1.rich_text.map(t => t.plain_text).join('')
  } else if (block.type === 'heading_2') {
    return '## ' + block.heading_2.rich_text.map(t => t.plain_text).join('')
  } else if (block.type === 'heading_3') {
    return '### ' + block.heading_3.rich_text.map(t => t.plain_text).join('')
  } else if (block.type === 'bulleted_list_item') {
    return '- ' + block.bulleted_list_item.rich_text.map(t => t.plain_text).join('')
  } else if (block.type === 'numbered_list_item') {
    return '1. ' + block.numbered_list_item.rich_text.map(t => t.plain_text).join('')
  } else if (block.type === 'code') {
    const lang = block.code.language || ''
    const code = block.code.rich_text.map(t => t.plain_text).join('')
    return '```' + lang + '\n' + code + '\n```'
  } else if (block.type === 'quote') {
    return '> ' + block.quote.rich_text.map(t => t.plain_text).join('')
  } else if (block.type === 'divider') {
    return '---'
  } else if (block.type === 'to_do') {
    const checked = block.to_do.checked ? '[x]' : '[ ]'
    return checked + ' ' + block.to_do.rich_text.map(t => t.plain_text).join('')
  }
  return ''
}

// 辅助函数：转换块为 Markdown
async function blocksToMarkdown(notion, blocks) {
  let markdown = ''

  for (const block of blocks) {
    // 处理嵌套的子块
    if (block.has_children) {
      const children = await notion.blocks.children.list({ block_id: block.id })
      const childrenMarkdown = await blocksToMarkdown(notion, children.results)
      markdown += extractText(block) + '\n' + childrenMarkdown + '\n'
    } else {
      markdown += extractText(block) + '\n'
    }
  }

  return markdown
}

// 主函数：同步文章
async function syncArticles() {
  if (!NOTION_API_KEY) {
    console.error('请设置 NOTION_API_KEY 环境变量')
    console.log('使用方法: NOTION_API_KEY=xxx node scripts/sync-notion.js')
    process.exit(1)
  }

  const notion = new Client({ auth: NOTION_API_KEY })

  // 确保目录存在
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  }

  console.log('开始同步 Notion 文章...\n')

  const articlesList = []

  for (let i = 0; i < ARTICLE_IDS.length; i++) {
    const article = ARTICLE_IDS[i]
    console.log(`[${i + 1}/${ARTICLE_IDS.length}] 正在同步: ${article.title}`)

    try {
      // 获取页面元数据
    const page = await notion.pages.retrieve({ page_id: article.id })

    // 提取页面属性
    const props = page.properties
    let title = article.title
    let category = 'OpenClaw'
    let date = new Date().toISOString().split('T')[0]
    let excerpt = ''

    // 尝试从属性中提取更多信息
    try {
      if (props.Category?.select?.name) {
        category = props.Category.select.name
      }
      if (props.Date?.date?.start) {
        date = props.Date.date.start
      }
      if (props.Excerpt?.rich_text?.[0]?.plain_text) {
        excerpt = props.Excerpt.rich_text[0].plain_text
      }
      // 尝试从 Name 或 Title 属性获取标题
      if (props.Name?.title?.[0]?.plain_text) {
        title = props.Name.title[0].plain_text
      } else if (props.title?.title?.[0]?.plain_text) {
        title = props.title.title[0].plain_text
      }
    } catch (e) {
      // 属性可能不存在，使用默认值
    }

    // 获取页面内容
    const blocks = await notion.blocks.children.list({ block_id: article.id })

    // 转换为 Markdown
    const content = await blocksToMarkdown(notion, blocks.results)

    // 计算阅读时间（基于内容字数）
    const wordCount = content.split(/\s+/).length
    const readTime = Math.max(1, Math.ceil(wordCount / 200))

      // 生成文件路径
      const order = String(i + 1).padStart(2, '0')
      const filename = `${order}-${slugify(article.title)}.md`
      const filepath = path.join(ARTICLES_DIR, filename)

      // 写入文件
      fs.writeFileSync(filepath, content, 'utf-8')
      console.log(`  ✓ 已保存: ${filename}`)

      // 添加到列表
      articlesList.push({
        id: i + 1,
        title: title,
        filename: filename,
        order: i + 1,
        category: category,
        date: date,
        excerpt: excerpt,
        readTime: readTime + ' min'
      })

    } catch (error) {
      console.error(`  ✗ 同步失败: ${error.message}`)
    }
  }

  // 生成 articles-list.js
  const listContent = `// 文章列表索引 - 由同步脚本自动生成
// 不要手动修改此文件，请修改 Notion 中的内容后重新运行 npm run sync

export const articlesList = ${JSON.stringify(articlesList, null, 2)}
`

  fs.writeFileSync(path.join(DATA_DIR, 'articles-list.js'), listContent, 'utf-8')

  console.log('\n同步完成!')
  console.log(`共同步 ${articlesList.length} 篇文章`)
  console.log(`文章索引已生成: src/data/articles-list.js`)
}

syncArticles().catch(console.error)
