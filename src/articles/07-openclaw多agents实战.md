技术实现
几个关键点：
1. 每个Agent一个独立workspace
OpenClaw支持多Agent架构。每个Agent有自己的SOUL.md（人格）、AGENTS.md（工作手册）、MEMORY.md（记忆）。墨知只知道知乎的事，墨推只管Twitter的活，互不干扰。
2. Agent之间通过sessions_send通信
墨知需要墨笔写稿时，直接调用sessions_send发任务过去。墨笔写完，结果自动返回。跨Agent通信是OpenClaw的核心能力之一。
3. 定时任务通过cron系统调度
27个cron任务，分布在早、中、晚三个时段。OpenClaw的cron支持独立会话执行，结果自动推送到Telegram。
4. VNC远程浏览器操作平台
这是最硬核的部分。很多自媒体平台没有开放API，只能用浏览器操作。我在服务器上跑了VNC远程桌面，Agent通过CDP（Chrome DevTools Protocol）直接操作Chrome——登录、发文、采数据，全部是真实浏览器行为。
不是API模拟，是真的在点按钮、填表单、截页面。

