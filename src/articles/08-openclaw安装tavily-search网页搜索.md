1，通过官方的clawhub安装，通过跟openclaw对话即可
当前大概率失败，返回错误是调用api频次太多，原因是当前大量用户访问，官方限流了，等一段时间再试也可以
2，上官方clawhub.ai网站去找，手动下载，解压后拷贝的你的workspace，默认是(mac)~/.openclaw/workspace/skills/下。然后跟openclaw对话告诉他你已经自己下载了这个skills并且拷贝到了对应的文件夹下，请帮忙安装
3，安装成功，自动重启，提示你需要key
这个时候去tavily官方网站去申请
https://www.tavily.com/
不像自己配就把key扔给openclaw。可以让他用环境变量的方式配置，放置key暴露在openclaw里边。不了解的就不用关心了
