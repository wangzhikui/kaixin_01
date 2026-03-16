## 使用tui问答，答案不返回tui界面，只在web ui对话中显示
先new session一下，重新启动一个会话
因为是测试，所以就不管之前的会话了，用到这里有个疑问，session是有长度的，怎么能一直记录，各种消息看到好像是有一个memory类似的skills，要不然new session一下之前的对话就没了，很多不好处理。先不管
但是new了之后问题依旧。这里没有做任何多于的配置，就是默认，甚至链USER。md这些都没改

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

