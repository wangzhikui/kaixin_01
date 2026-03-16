// AI 网址导航数据 - 从Notion获取
export const navigationData = [
  {
    id: 'overseas-vps',
    name: '海外VPS',
    icon: '🌍',
    sites: [
      { name: 'DigitalOcean', url: 'https://cloud.digitalocean.com/', desc: '开发者云服务，支持google账号登录' },
      { name: 'Hetzner', url: 'https://www.hetzner.com/', desc: '德国服务器提供商' }
    ]
  },
  {
    id: 'llm-apps',
    name: '大模型应用',
    icon: '🤖',
    sites: [
      { name: 'AnyGen', url: 'https://www.anygen.io/home?invitation_code=4QMBAUQNUJXCXLZ', desc: 'AI工作平台' },
      { name: '即梦AI', url: 'https://jimeng.jianying.com/ai-tool/home?type=video', desc: '字节剪映AI工具' },
      { name: '讯飞绘文', url: 'https://turbodesk.xfyun.cn/', desc: '科大讯飞AI写作平台' },
      { name: 'Readdy', url: 'https://readdy.ai/zh', desc: 'AI网站生成器' }
    ]
  },
  {
    id: 'openclaw',
    name: 'OpenClaw',
    icon: '🦞',
    sites: [
      { name: 'awesome-openclaw-skills', url: 'https://github.com/VoltAgent/awesome-openclaw-skills/tree/main', desc: 'OpenClaw Skills集合' },
      { name: 'OpenClaw 101', url: 'https://openclaw101.dev/', desc: '7天掌握OpenClaw教程' }
    ]
  },
  {
    id: 'platforms',
    name: '平台',
    icon: '☁️',
    sites: [
      { name: 'Anthropic', url: 'https://www.anthropic.com/', desc: 'Claude官方网站' },
      { name: 'Google Gemini', url: 'https://gemini.google.com/', desc: '谷歌Gemini AI助手' },
      { name: 'NVIDIA NIM', url: 'https://build.nvidia.com/', desc: 'NVIDIA NIM APIs' },
      { name: 'Moonshot AI', url: 'https://platform.moonshot.cn/', desc: 'Kimi大模型开放平台' },
      { name: '智谱AI', url: 'https://bigmodel.cn/', desc: '智谱GLM大模型' }
    ]
  },
  {
    id: 'api-gateway',
    name: '大模型接口网关',
    icon: '🔌',
    sites: [
      { name: 'YutoAPI', url: 'https://gptapi.asia/', desc: 'API网关服务' }
    ]
  },
  {
    id: 'design',
    name: '原型设计',
    icon: '🎨',
    sites: [
      { name: '墨刀', url: 'https://modao.cc/workspace/team/splpmqzz20pqoxoi', desc: '在线产品设计协作平台' },
      { name: 'Figma', url: 'https://www.figma.com/', desc: '协作界面设计工具' },
      { name: '星流', url: 'https://www.xingliu.art/', desc: '新一代设计Agent' },
      { name: 'Pixso', url: 'https://pixso.cn/', desc: 'AI原生UI设计工具' },
      { name: 'Mixboard', url: 'https://mixboard.google.com/projects', desc: 'Google AI设计工具' },
      { name: 'Excalidraw', url: 'https://excalidraw.com/', desc: '手绘风格协作白板' },
      { name: 'UI UX Pro Max', url: 'https://ui-ux-pro-max-skill.nextlevelbuilder.io/', desc: 'Claude Code设计技能' },
      { name: 'Pencil', url: 'https://www.pencil.dev/', desc: '设计到代码的工具' },
      { name: 'Paper Website', url: 'https://paperwebsite.com/', desc: '从日志创建小型博客' }
    ]
  },
  {
    id: 'agent-mcp',
    name: 'AI & Agent & MCP',
    icon: '🔗',
    sites: [
      { name: 'Agent Skills Directory', url: 'https://skills.sh/', desc: 'Agent技能目录' },
      { name: 'Agent Skills Overview', url: 'https://agentskills.io/home', desc: 'Agent技能概览' },
      { name: 'FastMCP', url: 'https://gofastmcp.com/getting-started/welcome', desc: 'FastMCP 2.0文档' },
      { name: 'MCP Market', url: 'https://mcpmarket.cn/', desc: 'MCP服务器商店' },
      { name: 'AiPPT', url: 'https://www.aippt.cn/', desc: '全智能AI一键生成PPT' },
      { name: 'Futurepedia', url: 'https://www.futurepedia.io/', desc: 'AI工具和软件最佳选择' },
      { name: 'PulseMCP', url: 'https://www.pulsemcp.com/servers', desc: 'MCP服务器目录' },
      { name: 'Skillhub', url: 'https://skillhub.ai/', desc: 'AI技能中心' }
    ]
  },
  {
    id: 'solutions',
    name: '应用解决方案',
    icon: '💼',
    sites: [
      { name: 'Qoder', url: 'https://qoder.com/', desc: 'Agentic编程平台' },
      { name: 'Claude', url: 'https://claude.ai/', desc: 'Claude AI助手' },
      { name: 'MD2Card', url: 'https://md2card.com/zh', desc: 'Markdown转知识卡片' },
      { name: 'Clawdbot', url: 'https://clawd.bot/', desc: '个人AI助手' },
      { name: 'Moltbot', url: 'https://molt.bot/', desc: '个人AI助手' },
      { name: 'OpenClaw', url: 'https://openclaw.ai/', desc: '个人AI助手' },
      { name: 'Moltbook', url: 'https://www.moltbook.com/', desc: 'Agent互联网首页' },
      { name: 'Perplexity', url: 'https://www.perplexity.ai/', desc: 'AI搜索，Wikipedia替代' },
      { name: 'Firecrawl', url: 'https://www.firecrawl.dev/', desc: 'AI网页数据API' },
      { name: '墨问', url: 'https://mowen.cn/', desc: '记录即创作' },
      { name: 'Bohrium', url: 'https://www.bohrium.com/', desc: '数据科学平台' },
      { name: 'OpenCode', url: 'https://opencode.ai/', desc: '开源AI编码助手' },
      { name: 'Google AI Studio', url: 'https://aistudio.google.com/', desc: 'Google AI开发工具' },
      { name: 'Readdy', url: 'https://readdy.ai/zh', desc: 'AI网站生成器' }
    ]
  },
  {
    id: 'development',
    name: '研发',
    icon: '💻',
    sites: [
      { name: '腾讯云微搭', url: 'https://weda.cloud.tencent.com.cn/index', desc: '低代码平台' },
      { name: 'DCloud', url: 'https://www.dcloud.io/', desc: 'HBuilderX、uni-app' },
      { name: 'uni-app', url: 'https://uniapp.dcloud.net.cn/', desc: '跨平台应用框架' },
      { name: 'Apifox', url: 'https://apifox.com/', desc: 'API文档调试Mock测试' },
      { name: 'Cursor', url: 'https://cursor.com/cn', desc: 'AI驱动的代码编辑器' },
      { name: 'Latent Box', url: 'https://latentbox.com/zh', desc: 'AI产品和项目集合' },
      { name: 'CrewAI', url: 'https://crewai.org.cn/', desc: '多Agent协作框架' },
      { name: 'AutoGen', url: 'https://microsoft.github.io/autogen/stable/', desc: '微软AutoGen框架' },
      { name: 'LangChain', url: 'https://www.langchain.com/', desc: 'LLM应用框架' },
      { name: 'Ollama', url: 'https://ollama.com/', desc: '本地运行大模型' }
    ]
  },
  {
    id: 'paas-workflow',
    name: 'PaaS平台 & 工作流',
    icon: '⚙️',
    sites: [
      { name: '火山引擎', url: 'https://www.volcengine.com/', desc: '字节跳动AI云' },
      { name: '飞桨AI Studio', url: 'https://aistudio.baidu.com/overview', desc: '百度AI学习社区' },
      { name: '秒哒', url: 'https://www.miaoda.cn/', desc: '生成式应用开发平台' },
      { name: '扣子', url: 'https://www.coze.cn/', desc: 'AI智能体开发平台' },
      { name: 'Dify', url: 'https://dify.ai/zh', desc: '生产级Agentic工作流平台' },
      { name: 'n8n', url: 'https://n8n.io/', desc: 'AI工作流自动化工具' },
      { name: 'Streamlit', url: 'https://streamlit.io/', desc: '快速构建数据应用' }
    ]
  },
  {
    id: 'community',
    name: '社区',
    icon: '🌐',
    sites: [
      { name: '智源社区', url: 'https://hub.baai.ac.cn/', desc: '人工智能实验室' },
      { name: 'Reddit', url: 'https://www.reddit.com/', desc: '社交新闻聚合' },
      { name: 'TensorFlow', url: 'https://www.tensorflow.org/?hl=zh-cn', desc: '机器学习框架' },
      { name: '三个皮匠报告', url: 'https://www.sgpjbg.com.cn/', desc: '行业研究报告分享' },
      { name: 'Instagram', url: 'https://www.instagram.com/explore/', desc: '图片视频社交平台' },
      { name: 'Facebook', url: 'https://www.facebook.com/', desc: '社交媒体平台' },
      { name: 'AI Weekly', url: 'https://ai-weekly.ai/', desc: '每周AI新闻' },
      { name: 'Discord', url: 'https://discord.com/', desc: '社区聊天平台' }
    ]
  },
  {
    id: 'browser',
    name: '浏览器',
    icon: '🌐',
    sites: [
      { name: '夸克', url: 'https://www.quark.cn/', desc: 'AI搜索电脑版' },
      { name: 'ima.copilot', url: 'https://ima.qq.com/download/', desc: '腾讯AI工作台' },
      { name: 'Browserbase', url: 'https://www.browserbase.com/', desc: 'AI代理浏览器' },
      { name: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/', desc: 'AI学习和职业发展' },
      { name: 'Bright Data', url: 'https://brightdata.com/', desc: '代理和数据平台' },
      { name: 'Atlas浏览器', url: 'https://atlasbrowser.net/zh-CN', desc: '智能浏览' }
    ]
  },
  {
    id: 'meeting',
    name: '会议',
    icon: '📹',
    sites: [
      { name: 'Granola', url: 'https://www.granola.ai/', desc: 'AI会议笔记工具' }
    ]
  },
  {
    id: 'virtual-desktop',
    name: '虚拟桌面',
    icon: '🖥️',
    sites: [
      { name: 'Apache Guacamole', url: 'https://guacamole.apache.org/', desc: 'H5远程桌面网关' }
    ]
  },
  {
    id: 'knowledge-graph',
    name: '图谱',
    icon: '🗺️',
    sites: [
      { name: '炬图', url: 'https://vip.joinmap.ai/index', desc: '图解价值' }
    ]
  },
  {
    id: 'blog',
    name: '博客',
    icon: '📝',
    sites: [
      { name: "Zara's AI learning", url: 'https://zara.faces.site/ai', desc: 'AI学习库' },
      { name: 'Creator Economy', url: 'https://creatoreconomy.so/', desc: '创作者经济' }
    ]
  }
]

// 首页显示的导航分类（部分数据）
export const navigationPreview = navigationData.slice(0, 6)
