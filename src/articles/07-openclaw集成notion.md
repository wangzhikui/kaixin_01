## 集成notion
openclaw默认已经集成notion相关的skills。需要到notin开放平台申请api key
Notion—The AI workspace that works for you.
### 操作步骤
1，登录开放平台创建“内部集成”：
- 进入noton开发者平台→内部集成→创建集成→配置内容访问权限→配置完成

2，当前时间生成的apikey是ntn开头的（openclaw过程中一直提示我应该是secret_开头的，实际是notion已经修改了，最新的是用ntn开头）
3，之后就跟openclaw对话让他帮我尝试连接notion。
4，对话过程大概是
```plain text
你有notion操作的skills
答：已经集成了
帮我在notion创建一篇文章，标题是这是openclaw创建的，内容是创建成功
答：需要提供key
这里不管安装问题，直接提供上面的key
答：提供的key有问题，401错误API调不通，请确认key是否正确，你提供的是ntn_开头的key，
实际的key应该是secret_开头
这个地方反复查各种资料搞了很久，notion上有两种集成，一种是集成，一种是内部集成。实际上notion
新的版本做来变更，集成（外部）使用secret_开头的key，内部集成使用ntn_开头，来区分。但是问题依旧
查资料提示使用mcp。安装openclaw内置的mcpoter工具，让openclaw自己安装，安装好之后对话让
openclaw帮我安装notion的mcp服务（虽然他说自己已经集成了）。提示安装成功
问：你现在可以连接notion了吗
答：我有notion的mcp服务且能做10几项操作功能，但是api还是无法连接，需要key
问：还是直接把key贴进去（这里openclaw有提示，建议不要直接把key方进入配置文件，可以放在环境
变量里面，这里是测试就直接放了）
答：问题还是提供的key有问题，401错误API调不通，请确认key是否正确，你提供的是ntn_开头的key，
实际的key应该是secret_开头
这里来来回回折腾了很久，最后
问：最新的notion就是以ntn开头的，最新版本已经去掉了secret_不要再纠结这个问题，如果还是不通
分析一下其他原因
然后就是一顿操作之后提示

Notion MCP 信息汇总：
安装方式：npm install -g notion-mcp-server
配置文件：~/.mcporter/mcporter.json
API Token：ntn_ 开头的 OAuth Token

打开配置文件
{
  "mcpServers": {
    "notion": {
      "command": "notion-mcp-server",
      "env": {
        "NOTION_TOKEN": "你自己的token"
      }
    }
  },
  "imports": []
}
测试：帮我在notion创建一篇文章，标题是这是openclaw创建的，内容是创建成功
确实创建成功了。
```
5，经过上面各种折腾最后成功了
6，通过飞书测试也成功
### 疑问
最开始用openclaw自带的mcpoter skills去安装notion，配置文件是在~/.openclaw/workspace/config/mcpprter.json中看路径知道这是opencalw工作空间中安装和生效
但是最后openclaw实用的npm install去装，而且是-g的全局安装，所有配置文件在~/.mcporter/mcporter.json。
这样就成功了，所以很有可能是之前的方式工作区域设置有问题。
第二个，看过配置文件，之前的配置有问题
新的ntn的配置方式是
NOTION_TOKEN
之前是
NOTION_API_KEY
所以还有一种可能是notion的接口方式改了，但是openclaw对接的模型并没有找最新的配置方式。或者原来mcpoter命令去安装的notion-mcp对应的skills就是老的配置，没有更新。npm -g的安装是从官方发布的最近包获取，通常比mcppoter这些维护要及时。
