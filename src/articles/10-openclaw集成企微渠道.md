https://open.work.weixin.qq.com/help2/pc/cat?doc_id=21657&invite_source=19&invite_channel=6&invite_olduser=1&inviter_identity=2&version=5.0.6.91166&platform=mac
直接在企微工作台找到机器人创建即可，需要升级到最新版本，否则看不到长连接方式
以API方式创建机器人，链接方式：长连接
bot ID：你的飞书bot ID
secret：你的飞书bot ID

botId是你的飞书bot ID
secret是你的飞书app secret
当前openclaw暂时没有默认集成企微的消息渠道配置，需要本地安装插件
```bash
openclaw plugins install @wecom/wecom-openclaw-plugin
```
第一次安装失败
```bash
Downloading @wecom/wecom-openclaw-plugin…
Extracting /var/folders/kc/xrk0fybn4xj38hqg7xzymdqw0000gn/T/openclaw-npm-pack-TDMwX8/wecom-wecom-openclaw-plugin-1.0.5.tgz…
Installing to /Users/shuningwu/.openclaw/extensions/wecom-openclaw-plugin…
Installing plugin dependencies…
npm install failed:
```
原因可能是我有一个编辑器打开了openclaw的配置文件，关闭后重新运行命令，安装成功
```bash
openclaw channels add
```
按照命令添加，安装向导并没有像企微手册那样提示输入botid和key。只是提示下载成功。按照提示下载又提示
```bash
Plugin install failed: plugin already exists: /Users/shuningwu/.openclaw/extensions/wecom-openclaw-plugin (delete it first)
```
测试发现我之前配置的其他渠道也没有了，问一下openclaw什么原因，提示我因为对应的插件缺少依赖。可能是应为我在添加企微渠道之前先做了openclaw update更新操作
让openclaw帮我修复这个问题，然后让他帮我安装企微插件和渠道配置
把botid和secret都给他然后提示成功
openclaw status查看一下显示渠道添加成功
到机器人
