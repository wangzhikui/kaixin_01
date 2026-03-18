在一台全新的mac电脑上安装openclaw包括配套的开发环境
## nodejs
官方建议安装方式之一是nodejs安装
```bash
# Install OpenClaw
npm i -g openclaw
# Meet your lobster
openclaw onboard
```
先下载nodejs安装
https://nodejs.org/zh-cn
找到符合本电脑的版本，mac有intel芯片和苹果芯片两个，本人是intel芯片。网站会自动检测，基本上直接下载即可。当前版本是v24.14.0
1，可以下载安装包安装
2，按照nodejs给出的安装方式使用nvm安装
```bash
# 下载并安装 nvm：
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash

# 代替重启 shell
\. "$HOME/.nvm/nvm.sh"

# 下载并安装 Node.js：
nvm install 24

# 验证 Node.js 版本：
node -v # Should print "v24.14.0".

# 验证 npm 版本：
npm -v # Should print "11.9.0".

```
提示：官方提示使用nvm安装，社区方案也有使用brew。很多mac上的应用都是用brew安装和管理，建议使用brew
```bash
# 下载并安装 Homebrew
curl -o- https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh | bash
# 下载并安装 Node.js：
brew install node@24
# 验证 Node.js 版本：
node -v # Should print "v24.14.0".
# 验证 npm 版本：
npm -v # Should print "11.9.0".
```
如果想安装多个nodejs版本，可以使用n或者nvm工具来管理，nvm是官方，n是社区。安装方式这里不赘述
## 安装openclaw
https://openclaw.ai/
使用官方推荐方式之一：npm安装
安装之前建议提前准备
1，大模型APIkey：这里选择minimax
打开Minimax开放平台，购买code plan，最便宜的套餐一个月29块钱，有需要其他平台的自行申请

2，消息渠道：这里选择飞书
打开飞书开放平台创建机器人，拿到appid和app secret

https://platform.minimaxi.com/user-center/payment/coding-plan
https://open.feishu.cn/app/cli_a9142b002bf9dbc9/auth
https://docs.openclaw.ai/zh-CN/channels/feishu
以上，参考minimax和openclaw + 飞书官方文档操作即可
```bash
# Install OpenClaw
npm i -g openclaw

# Meet your lobster
openclaw onboard
```
minima的apikey
```json
{
  "version": 1,
  "profiles": {
    "minimax-portal:default": {
      "type": "oauth",
      "provider": "minimax-portal",
      "access": "你的minimax api key",
      "refresh": "cSFtuGlOYEeyFnjtLSmp2k5yhhsTFTYJbglw7gEfPGU=",
      "expires": 1803523264210
    }
  },
  "lastGood": {
    "minimax-portal": "minimax-portal:default"
  },
  "usageStats": {
    "minimax-portal:default": {
      "lastUsed": 1772591858658,
      "errorCount": 0
    }
  }
}
```
按照向导安装，中间除了选择模型和消息渠道飞书意外其他都可以skip now跳过
最后让选择以什么方式链接gateway
openclaw默认提供了两种ui方式，tui，和webui
tui是在终端。webui则是浏览器打开的web界面。选择一种即可

可能会遇到一个错误提示
```bash
run error: HTTP 401 authentication_error: invalid api key (request_id: 05f72007a60043c3627694d9807482ca)
```
这个是因为配置minimax的时候不是选择的oauth。如下图，当时我选择的是第二项。应该先选择第一项会跳转到minimax的网站做登录验证。具体可以参考minimax文档
https://platform.minimaxi.com/docs/guides/text-ai-coding-tools#%E5%AE%89%E8%A3%85-openclaw

```bash
openclaw configure
```
重新配置模型，选在MiniMax OAuth配置，网页先登录MiniMax
安装成功，快捷键Ctrl+C退出安装向导，回到命令行
```bash
# 重启网关
openclaw gateway restart
# 查询一下gateway运行状态
openclaw gateway status
# 输出如下部分信息
Service: LaunchAgent (loaded)
File logs: /tmp/openclaw/openclaw-2026-03-04.log
Command: /usr/local/bin/node /usr/local/lib/node_modules/openclaw/dist/index.js gateway --port 18789
Service file: ~/Library/LaunchAgents/ai.openclaw.gateway.plist
Service env: OPENCLAW_GATEWAY_PORT=18789

Config (cli): ~/.openclaw/openclaw.json
Config (service): ~/.openclaw/openclaw.json

Gateway: bind=loopback (127.0.0.1), port=18789 (service args)
Probe target: ws://127.0.0.1:18789
Dashboard: http://127.0.0.1:18789/
Probe note: Loopback-only gateway; only local clients can connect.

Runtime: running (pid 28880)
RPC probe: ok
```
直接通过web ui链接http://127.0.0.1:18789访问可能会提示缺少token

按照网页上的提示
```bash
openclaw dashboard --no-open
openclaw doctor --generate-gateway-token
```
使用带token的网页访问即可

调试飞书渠道
打开飞书找到我们创建的机器人发送任意信息
飞书会返回提示
```bash
OpenClaw: access not configured.
Your Feishu user id: ou_aa47cba14653da59df6b06dca5303eaa
Pairing code: 8B9RFJ69
Ask the bot owner to approve with:
openclaw pairing approve feishu 8B9RFJ69
```
提示需要配对，复制最后一段在网关终端运行即可
## skills安装工具clawhub
https://clawhub.ai/
clawhub官方的skills市场及安装工具，使用npm全局安装，方便安装特定的skills
你也可以跟openclaw对话让他安装。这里我通过手动安装，是想明确管理技能列表，避免openclaw乱安装skills造成混乱
```bash
npm install -g clawhub
```
## 参考学习
https://chatglm.cn/studyBuddy/detail/68f0b8c110eea3e78b0e0e5e?id=69a7ef380a9726018b429fe9&lang=zh
