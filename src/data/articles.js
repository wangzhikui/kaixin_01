// OpenClaw 实战笔记文章列表 - 按照Notion排序（包含完整内容）
export const articles = [
  {
    id: 1,
    title: 'openclaw全新安装',
    excerpt: '在一台全新的mac电脑上安装openclaw包括配套的开发环境，从Node.js安装到配置飞书渠道',
    date: '2026-03-09',
    category: '安装教程',
    readTime: '15 min',
    content: `在一台全新的mac电脑上安装openclaw包括配套的开发环境

## nodejs

官方建议安装方式之一是nodejs安装

\`\`\`bash
# Install OpenClaw
npm i -g openclaw
# Meet your lobster
openclaw onboard
\`\`\`

先下载nodejs安装

[Node.js — 在任何地方运行 JavaScript](https://nodejs.org/zh-cn)

找到符合本电脑的版本，mac有intel芯片和苹果芯片两个。网站会自动检测，基本上直接下载即可。当前版本是v24.14.0

1，可以下载安装包安装
2，按照nodejs给出的安装方式使用nvm安装

\`\`\`bash
# 下载并安装 nvm：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 代替重启 shell
\\. "$HOME/.nvm/nvm.sh"

# 下载并安装 Node.js：
nvm install 24

# 验证 Node.js 版本：
node -v
\`\`\`

提示：官方提示使用nvm安装，社区方案也有使用brew。很多mac上的应用都是用brew安装和管理，建议使用brew

\`\`\`bash
# 下载并安装 Homebrew
curl -o- https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash
# 下载并安装 Node.js：
brew install node@24
\`\`\`

## 安装openclaw

[OpenClaw — Personal AI Assistant](https://openclaw.ai/)

使用官方推荐方式之一：npm安装

安装之前建议提前准备：
1. 大模型APIkey：这里选择MiniMax
2. 消息渠道：这里选择飞书

[MiniMax-与用户共创智能](https://platform.minimaxi.com/user-center/payment/coding-plan)
[Feishu Open Platform](https://open.feishu.cn/app/cli_a9142b002bf9dbc9/auth)
[飞书 - OpenClaw](https://docs.openclaw.ai/zh-CN/channels/feishu)

以上，参考minimax和openclaw + 飞书官方文档操作即可

\`\`\`bash
# Install OpenClaw
npm i -g openclaw

# Meet your lobster
openclaw onboard
\`\`\`

## 可能会遇到错误

\`\`\`bash
run error: HTTP 401 authentication_error: invalid api key
\`\`\`

这个是因为配置minimax的时候不是选择的oauth。应该先选择第一项会跳转到minimax的网站做登录验证。

\`\`\`bash
openclaw configure
\`\`\`

重新配置模型，选在MiniMax OAuth配置，网页先登录MiniMax

安装成功：

\`\`\`bash
# 重启网关
openclaw gateway restart
# 查询一下gateway运行状态
openclaw gateway status
\`\`\`

## 调试飞书渠道

打开飞书找到我们创建的机器人发送任意信息，飞书会返回提示需要配对，复制最后一段在网关终端运行即可：

\`\`\`bash
openclaw pairing approve feishu <code>
\`\`\`

## skills安装工具clawhub

[ClawHub](https://clawhub.ai/)

\`\`\`bash
npm install -g clawhub
\`\`\``
  },
  {
    id: 2,
    title: 'openclaw实用问题集',
    excerpt: '解决openclaw使用过程中遇到的常见问题，包括设备配对、网关连接等',
    date: '2026-03-10',
    category: '问题解决',
    readTime: '8 min',
    content: `## 问题一

终端配置好了，网关也启动了，tui以及web都可以访问，安装了openclaw的client端，mac电脑。配置之后提示无法连接上网关。

**问题原因**：新的客户端请求网关，需要在终端允许配对

\`\`\`bash
# 查询有哪些设备配对了网关
openclaw devices list

# 找到需要配对的，pending分类，使用如下命令配对
openclaw devices approve cb54c7f6-0e67-4482-ad24-f0b99f5723a7

# 返回如下，则配对成功
Approved xxx (cb54c7f6-0e67-4482-ad24-f0b99f5723a7)
\`\`\``
  },
  {
    id: 3,
    title: 'openclaw集成企微渠道',
    excerpt: '将OpenClaw与企业微信集成，实现更便捷的团队协作和消息通知',
    date: '2026-03-09',
    category: '集成教程',
    readTime: '10 min',
    content: `## openclaw集成企微渠道

直接在企微工作台找到机器人创建即可，需要升级到最新版本，否则看不到长连接方式。

以API方式创建机器人，链接方式：长连接

**bot ID**：aibmqfvgJQr3XOlkXJl0guHmnPaK5SJQIwX
**secret**：HX1iSqFRL3VjVlyJsSo1toi5EoGFSovMHRRWLnOGjZw

当前openclaw暂时没有默认集成企微的消息渠道配置，需要本地安装插件：

\`\`\`bash
openclaw plugins install @wecom/wecom-openclaw-plugin
\`\`\`

安装成功后，添加渠道：

\`\`\`bash
openclaw channels add
\`\`\`

测试发现之前配置的其他渠道也没有了，问一下openclaw原因，提示因为对应的插件缺少依赖。让openclaw帮我修复这个问题。
`
  },
  {
    id: 4,
    title: 'openclaw集成notion',
    excerpt: '通过MCP方式集成Notion，实现笔记和任务的无缝同步',
    date: '2026-03-09',
    category: '集成教程',
    readTime: '12 min',
    content: `## 集成notion

openclaw默认已经集成notion相关的skills。需要到notion开放平台申请api key

[Notion—The AI workspace](https://www.notion.so/profile/integrations/public)

1. 登录开放平台创建"内部集成"
2. 进入notion开发者平台→内部集成→创建集成→配置内容访问权限→配置完成
3. 当前时间生成的apikey是ntn开头的

## 配置步骤

### 方式一：MCP方式

安装：

\`\`\`bash
npm install -g notion-mcp-server
\`\`\`

配置文件 \`~/.mcporter/mcporter.json\`：

\`\`\`json
{
  "mcpServers": {
    "notion": {
      "command": "notion-mcp-server",
      "env": {
        "NOTION_TOKEN": "你的ntn_开头的token"
      }
    }
  }
}
\`\`\`

### 常见问题

1. 之前是secret_开头，现在是ntn_开头（新版变化）
2. 配置变量名是NOTION_TOKEN而不是NOTION_API_KEY
`
  },
  {
    id: 5,
    title: 'openclaw多agents实战',
    excerpt: '深入理解OpenClaw的多Agent架构，学习如何配置SOUL.md、AGENTS.md等核心文件',
    date: '2026-03-07',
    category: '进阶教程',
    readTime: '10 min',
    content: `## 技术实现

### 1. 每个Agent一个独立Workspace

OpenClaw支持多Agent架构。每个Agent有自己的：
- SOUL.md（人格）
- AGENTS.md（工作手册）
- MEMORY.md（记忆）

墨知只知道知乎的事，墨推只管Twitter的活，互不干扰。

### 2. Agent之间通过sessions_send通信

墨知需要墨笔写稿时，直接调用\`sessions_send\`发任务过去。墨笔写完，结果自动返回。

跨Agent通信是OpenClaw的核心能力之一。

### 3. 定时任务通过cron系统调度

27个cron任务，分布在早、中、晚三个时段。OpenClaw的cron支持独立会话执行，结果自动推送到Telegram。

### 4. VNC远程浏览器操作平台

这是最硬核的部分。很多自媒体平台没有开放API，只能用浏览器操作。

在服务器上跑VNC远程桌面，Agent通过CDP（Chrome DevTools Protocol）直接操作Chrome——登录、发文、采数据，全部是真实浏览器行为。
`
  },
  {
    id: 6,
    title: 'openclaw之安装git',
    excerpt: '安装git并不是必须的，但建议先安装，因为很多skills都发布在github上',
    date: '2026-03-09',
    category: '安装教程',
    readTime: '8 min',
    content: `## 安装git（可跳过）

安装git并不是必须得，可以先安装openclaw。建议先安装git，因为很多skills都发布在github上，可能会需要从git上下东西。

[Git](https://git-scm.com/)

官方推荐使用brew：

\`\`\`bash
# 安装 homebrew
$ brew install git

# 查询版本
$ git version
git version 2.53.0

# 配置全局用户名和邮箱
$ git config --global user.name "Your Name"
$ git config --global user.email "your.email@example.com"
\`\`\`

## 常用命令

### 创建版本库

\`\`\`bash
$ git clone <url>    #克隆远程版本库
$ git init           #初始化本地版本库
\`\`\`

### 修改和提交

\`\`\`bash
$ git status        #查看状态
$ git add <file>    #跟踪修改
$ git commit -m "description"
\`\`\`

### 分支管理

\`\`\`bash
$ git branch                #查看分支
$ git branch <name>         #创建分支
$ git checkout <name>       #切换分支
\`\`\``
  },
  {
    id: 7,
    title: 'openclaw推荐装的10个skills',
    excerpt: '精选ClawHub上最受欢迎的Skills，包含self-improving-agent、tavily-search、notion等',
    date: '2026-03-10',
    category: 'Skills推荐',
    readTime: '6 min',
    content: `## 推荐 Skills

ClawHub 上有丰富的 Skills 可以扩展 OpenClaw 的功能。

## Top 10 Skills

| 排名 | 名称 | 下载量 | Stars | 用途 |
|------|------|--------|-------|------|
| 1 | self-improving-agent | 87,617 | 1,061 | 自动学习改进 |
| 2 | gog | 77,673 | 607 | Google Workspace |
| 3 | tavily-search | 76,313 | 345 | AI优化的网页搜索 |
| 4 | find-skills | 72,257 | 320 | 发现和安装新skills |
| 5 | summarize | 66,425 | 309 | 总结URL/PDF/YouTube |
| 6 | github | 61,618 | 208 | GitHub操作 |
| 7 | agent-browser | 61,126 | 321 | 浏览器自动化 |
| 8 | weather | 52,195 | 185 | 天气查询 |
| 9 | polymarketodds | 50,735 | 128 | 预测市场 |
| 10 | proactive-agent | 49,228 | 327 | 主动式AI代理 |

## 安装方式

### 方式一：对话安装

> "请帮我安装 tavily-search skill"

### 方式二：手动安装

1. 访问 ClawHub 下载
2. 解压后拷贝到 \`~/.openclaw/workspace/skills/\`
3. 让 OpenClaw 重新加载
`
  },
  {
    id: 8,
    title: 'openclaw安装tavily-search网页搜索',
    excerpt: '安装tavily-search技能，实现AI优化的网页搜索功能',
    date: '2026-03-10',
    category: 'Skills推荐',
    readTime: '5 min',
    content: `## 安装tavily-search

### 方式一：对话安装

通过官方的clawhub安装，通过跟openclaw对话即可：

> "请帮我安装 tavily-search skill"

当前大概率失败，返回错误是调用api频次太多，等一段时间再试。

### 方式二：手动安装

1. 上官方clawhub.ai网站去找
2. 手动下载，解压后拷贝到 \`~/.openclaw/workspace/skills/\`
3. 跟openclaw对话告诉他已经下载了这个skills

### 配置Key

去tavily官方网站申请：

[Tavily](https://www.tavily.com/)

申请后可以让他用环境变量的方式配置，放置key暴露在openclaw里边。
`
  },
  {
    id: 9,
    title: 'openclaw配置USER.MD等文件',
    excerpt: '配置OpenClaw核心个性文件，理解AI助手灵魂的三件套',
    date: '2026-03-09',
    category: '配置教程',
    readTime: '5 min',
    content: `## 配置USER.MD等文件

理解 AI 助手「灵魂」的三件套：

- **SOUL.md** - 定义Agent的"灵魂"和人格特征
- **USER.md** - 用户配置文件
- **AGENTS.md** - 定义Agent的工作手册

这些文件位于 \`~/.openclaw/agents/\` 目录下。
`
  },
  {
    id: 10,
    title: 'openclaw',
    excerpt: 'OpenClaw常用命令汇总、配置文件位置、参考学习资源',
    date: '2026-03-04',
    category: '命令手册',
    readTime: '10 min',
    content: `## 参考学习

[OpenClaw 101 - Master Your AI Assistant in 7 Days](https://openclaw101.dev/)

## 开放平台

- [智谱AI开放平台](https://open.bigmodel.cn/)
- [MiniMax](https://platform.minimaxi.com/user-center/payment/coding-plan)
- [飞书开放平台](https://open.feishu.cn/app/cli_a9142b002bf9dbc9/auth)
- [飞书 - OpenClaw](https://docs.openclaw.ai/zh-CN/channels/feishu)

## 常用命令

\`\`\`bash
# 查看整体状态
openclaw status

# 查看Gateway运行状态
openclaw gateway status

# 健康检查
openclaw health

# 重新配置
openclaw configure

# 重启后台服务
openclaw daemon restart
\`\`\`

## 网关管理

\`\`\`bash
openclaw gateway install
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway uninstall
\`\`\`

## 模型管理

\`\`\`bash
openclaw models status
openclaw models list
openclaw models set <model-or-alias>
openclaw models scan
\`\`\`

## 会话控制

\`\`\`bash
openclaw sessions
openclaw sessions --active 120
openclaw sessions --json
\`\`\`

## 配置文件位置

- **~/.openclaw/openclaw.json** - 模型配置/密钥配置
- **~/.openclaw/agents/main/agent/auth-profiles.json** - 认证配置
`
  }
]

// 快速链接
export const quickLinks = [
  { name: 'OpenClaw官网', url: 'https://openclaw.ai/', icon: '🦞' },
  { name: 'ClawHub市场', url: 'https://clawhub.ai/', icon: '📦' },
  { name: 'OpenClaw文档', url: 'https://docs.openclaw.ai/', icon: '📚' },
  { name: 'MiniMax开放平台', url: 'https://platform.minimaxi.com/', icon: '🧠' }
]
