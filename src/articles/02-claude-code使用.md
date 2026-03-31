npm安装方式
翻墙就不用使用镜像，如果使用国内ip要用镜像
镜像地址：https://registry.npmmirror.com
```bash
sudo npm install -g @anthropic-ai/claude-code
```

安装完成后输入claude命令报错，提示无法访问anthropic service。因为默认访问的事anthropic的claude模型api
我们配置国内的模型，配置方法可以修改配置文件或者使用如下可视化工具，他的原理也是修改对应的配置
为claude code 配置模型的工具（如：minimax api key）
https://github.com/farion1231/cc-switch/releases/tag/v3.10.3

1，使用官方安装命令报错
```json
curl -fsSL https://claude.ai/install.sh | bash
```
https://blog.csdn.net/huyuyang6688/article/details/157283719
Claude Code 使用踩坑总结：代理配置、额度不足与模型切换
2，mac使用brew安装提示claude-code不存在，提示去掉-code安装成功
安装后直接在应用中增加了claude，但是终端无法使用claude，没有在bin中增加claude。到此没有进行下一步了，因为即时安装成功使用的时候也需要claude账号，目前还没有对中国区域开放账号注册
3，vs code中试用claude code插件，配置智谱或者minimax的模型使用。
vs code配置claude code方法
https://blog.csdn.net/zooen2011/article/details/156657628
智谱配置
智谱开放平台申请API key
https://open.bigmodel.cn/
```json
"claudeCode.environmentVariables": [
      {
        "name": "ANTHROPIC_BASE_URL",
        "value": "https://open.bigmodel.cn/api/anthropic"
      },
      {
        "name": "ANTHROPIC_AUTH_TOKEN",
        "value": "YOUR_TOKEN"
      },
      {
        "name": "API_TIMEOUT_MS",
        "value": "3000000"
      },
      {
        "name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
        "value": "1"
      },
      {
        "name": "ANTHROPIC_MODEL",
        "value": "GLM-4.7"
      },
      {
        "name": "ANTHROPIC_SMALL_FAST_MODEL",
        "value": "GLM-4.7"
      },
      {
        "name": "ANTHROPIC_DEFAULT_SONNET_MODEL",
        "value": "GLM-4.7"
      },
      {
        "name": "ANTHROPIC_DEFAULT_OPUS_MODEL",
        "value": "GLM-4.7"
      },
      {
        "name": "ANTHROPIC_DEFAULT_HAIKU_MODEL",
        "value": "GLM-4.5-Air"
      }
      
    ]
```
MiniMax配置
https://platform.minimaxi.com/docs/guides/text-ai-coding-tools#%E5%9C%A8-trae-%E4%B8%AD%E4%BD%BF%E7%94%A8-minimax-m2-5
```json
"claudeCode.environmentVariables": [
	{
		"name": "ANTHROPIC_BASE_URL",
		"value": "https://api.minimaxi.com/anthropic"
	},
	{
		"name": "ANTHROPIC_AUTH_TOKEN",
		"value": "YOUR_TOKEN"
	},
	{
		"name": "API_TIMEOUT_MS",
		"value": "3000000"
	},
	{
		"name": "CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC",
		"value": "1"
	},
	{
		"name": "ANTHROPIC_MODEL",
		"value": "MiniMax-M2.5"
	},
	{
		"name": "ANTHROPIC_SMALL_FAST_MODEL",
		"value": "MiniMax-M2.5"
	},
	{
		"name": "ANTHROPIC_DEFAULT_SONNET_MODEL",
		"value": "MiniMax-M2.5"
	},
	{
		"name": "ANTHROPIC_DEFAULT_OPUS_MODEL",
		"value": "MiniMax-M2.5"
	},
	{
		"name": "ANTHROPIC_DEFAULT_HAIKU_MODEL",
		"value": "MiniMax-M2.5"
	}
]
```
