## 参考学习
https://openclaw101.dev/
## 开放平台
https://open.bigmodel.cn/
https://platform.minimaxi.com/user-center/payment/coding-plan
https://open.feishu.cn/app/cli_a9142b002bf9dbc9/auth
https://docs.openclaw.ai/zh-CN/channels/feishu
## 常用命令
```json
openclaw status          # 查看整体状态
openclaw gateway status  # 查看 Gateway 运行状态
openclaw health          # 健康检查
openclaw configure       # 重新配置（修改模型、频道等）
openclaw daemon restart  # 重启后台服务
openclaw daemon logs     # 查看运行日志

openclaw gateway install
openclaw gateway start
openclaw gateway stop
openclaw gateway restart
openclaw gateway uninstall

openclaw models status
openclaw models list
openclaw models set <model-or-alias>
openclaw models scan

openclaw sessions
openclaw sessions --active 120
openclaw sessions --json
```
## 配置文件位置
~/.openclaw/openclaw.json
模型配置文件/密钥配置
~/.openclaw/agents/main/agent/auth-profiles.json

## 安装skills&工具&第三方软件
https://clawhub.ai/
配置openclaw核心个性文件
理解 AI 助手「灵魂」的三件套：SOUL.md / USER.md / AGENTS.md
### 浏览器功能
https://brave.com/zh/search/api/
使用邮箱:wangzhikuia@126.com注册
密码谷歌浏览器自动生成并保存在谷歌账号体系中
### 虚拟组网工具
https://tailscale.com/download
## 问题一
终端配置好了，网关也启动了，tui以及web都可以访问，安装了openclaw的client端，mac电脑。配置之后提示无法连接上网关。
问题原因是新的客户端请求网关，需要在终端允许配对
```shell
查询有哪些设备配对了网关

openclaw devices list

找到需要配对的，pending分类，使用如下命令配对

openclaw devices approve cb54c7f6-0e67-4482-ad24-f0b99f5723a7

返回如下，则配对成功

Approved 2ef52109a69fa5d1272d35e57df8a0ddc6df929a38485a0ae0f6e662493a79d5 (cb54c7f6-0e67-4482-ad24-f0b99f5723a7)
```
如图所示

