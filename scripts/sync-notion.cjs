/**
 * Notion 文章同步脚本
 * 运行方式: NOTION_API_KEY=xxx npm run sync
 * 支持从 Notion 数据库或页面下动态获取文章列表
 */

const fs = require('fs')
const path = require('path')
const { Client } = require('@notionhq/client')

// 配置
const NOTION_API_KEY = process.env.NOTION_API_KEY
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID // 可选：直接指定数据库ID
const AI_PAGE_ID = '2ff6bc4f-2121-804d-95ef-fa4013bf1be7' // AI 页面/数据库 ID

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
    return block.paragraph.rich_text?.map(t => t.plain_text).join('') || ''
  } else if (block.type === 'heading_1') {
    return '# ' + (block.heading_1.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'heading_2') {
    return '## ' + (block.heading_2.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'heading_3') {
    return '### ' + (block.heading_3.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'bulleted_list_item') {
    return '- ' + (block.bulleted_list_item.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'numbered_list_item') {
    return '1. ' + (block.numbered_list_item.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'code') {
    const lang = block.code.language || ''
    const code = block.code.rich_text?.map(t => t.plain_text).join('') || ''
    return '```' + lang + '\n' + code + '\n```'
  } else if (block.type === 'quote') {
    return '> ' + (block.quote.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'divider') {
    return '---'
  } else if (block.type === 'to_do') {
    const checked = block.to_do.checked ? '[x]' : '[ ]'
    return checked + ' ' + (block.to_do.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'callout') {
    const icon = block.callout.icon?.emoji || ''
    return '> ' + icon + ' ' + (block.callout.rich_text?.map(t => t.plain_text).join('') || '')
  } else if (block.type === 'toggle') {
    const text = block.toggle.rich_text?.map(t => t.plain_text).join('') || ''
    return `<details>\n<summary>${text}</summary>\n\n</details>`
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

// 从 Notion 页面获取所有子页面
async function getChildPages(notion, parentId) {
  const pages = []
  let cursor

  do {
    const response = await notion.blocks.children.list({
      block_id: parentId,
      start_cursor: cursor
    })

    // 过滤出页面类型的块
    for (const block of response.results) {
      if (block.type === 'child_page') {
        pages.push({
          id: block.id,
          title: block.child_page.title
        })
      }
    }

    cursor = response.has_more ? response.next_cursor : null
  } while (cursor)

  return pages
}

// 从 Notion 数据库获取所有页面
async function getDatabasePages(notion, databaseId) {
  const pages = []
  let cursor

  do {
    const response = await notion.databases.query({
      database_id: databaseId,
      sorts: [
        {
          property: 'Order',
          direction: 'ascending'
        }
      ],
      start_cursor: cursor
    })

    for (const page of response.results) {
      // 获取标题
      let title = 'Untitled'
      const titleProp = page.properties.Name || page.properties.title
      if (titleProp?.title?.length > 0) {
        title = titleProp.title[0].plain_text
      }

      // 获取排序号
      let order = pages.length + 1
      if (page.properties.Order?.number) {
        order = page.properties.Order.number
      }

      pages.push({
        id: page.id,
        title,
        order,
        properties: page.properties
      })
    }

    cursor = response.has_more ? response.next_cursor : null
  } while (cursor)

  return pages
}

// 主函数：同步文章
async function syncArticles() {
  if (!NOTION_API_KEY) {
    console.error('请设置 NOTION_API_KEY 环境变量')
    console.log('使用方法: NOTION_API_KEY=xxx npm run sync')
    console.log('或创建 .env 文件写入: NOTION_API_KEY=xxx')
    process.exit(1)
  }

  const notion = new Client({ auth: NOTION_API_KEY })

  // 确保目录存在
  if (!fs.existsSync(ARTICLES_DIR)) {
    fs.mkdirSync(ARTICLES_DIR, { recursive: true })
  }

  console.log('开始同步 Notion 文章...\n')

  let articlePages = []

  // 优先使用数据库ID（如果指定了 NOTION_DATABASE_ID）
  if (NOTION_DATABASE_ID) {
    console.log(`从数据库获取文章: ${NOTION_DATABASE_ID}`)
    articlePages = await getDatabasePages(notion, NOTION_DATABASE_ID)
  } else {
    // 尝试从 AI_PAGE_ID 获取（可能是数据库或页面）
    try {
      console.log(`尝试从 AI 页面/数据库获取: ${AI_PAGE_ID}`)
      // 先尝试作为数据库查询
      articlePages = await getDatabasePages(notion, AI_PAGE_ID)

      // 如果没有数据，作为页面处理
      if (articlePages.length === 0) {
        console.log('作为页面处理，获取子页面...')
        const childPages = await getChildPages(notion, AI_PAGE_ID)
        articlePages = childPages.map((p, i) => ({
          ...p,
          order: i + 1
        }))
      }
    } catch (error) {
      console.log('作为页面处理，获取子页面...')
      const childPages = await getChildPages(notion, AI_PAGE_ID)
      articlePages = childPages.map((p, i) => ({
        ...p,
        order: i + 1
      }))
    }
  }

  console.log(`找到 ${articlePages.length} 篇文章\n`)

  const articlesList = []

  for (let i = 0; i < articlePages.length; i++) {
    const article = articlePages[i]
    console.log(`[${i + 1}/${articlePages.length}] 正在同步: ${article.title}`)

    try {
      // 获取页面元数据
      const page = await notion.pages.retrieve({ page_id: article.id })

      // 提取页面属性
      const props = page.properties || {}
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
      const order = String(article.order || i + 1).padStart(2, '0')
      const filename = `${order}-${slugify(title)}.md`
      const filepath = path.join(ARTICLES_DIR, filename)

      // 写入文件
      fs.writeFileSync(filepath, content, 'utf-8')
      console.log(`  ✓ 已保存: ${filename}`)

      // 添加到列表
      articlesList.push({
        id: i + 1,
        title: title,
        filename: filename,
        order: article.order || i + 1,
        category: category,
        date: date,
        excerpt: excerpt,
        readTime: readTime + ' min'
      })

    } catch (error) {
      console.error(`  ✗ 同步失败: ${error.message}`)
    }
  }

  // 按 order 排序
  articlesList.sort((a, b) => a.order - b.order)

  // 重新编号
  articlesList.forEach((article, index) => {
    article.id = index + 1
  })

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
