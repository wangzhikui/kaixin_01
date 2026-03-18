## 安装git（可跳过）
安装git并不是必须得，可以先安装openclaw。建议先安装git。因为很多skills都发布在gihub上，可能会需要从git上下东西，此处对于研发来说，其他普通用户可以跳过
https://git-scm.com/
官方推荐使用brew，brew是macos的一个包管理器，nodejs安装中有提到过
```bash
Homebrew
Install homebrew if you don't already have it, then:
$ brew install git
# 查询版本，能够正确返回版本信息则安装成功
$ git version
git version 2.53.0
# 配置全局用户名和邮箱
$ 
```
git常用命令
https://coding.net/help/docs/host/git/git%20commands.html
```bash
# 创建版本库
$ git clone <url>                  #克隆远程版本库
$ git init                         #初始化本地版本库
# 修改和提交
$ git status                       #查看状态
$ git diff                         #查看变更内容
$ git add .                        #跟踪所有改动过的文件
$ git add <file>                   #跟踪指定的文件
$ git mv <old><new>                #文件改名
$ git rm<file>                     #删除文件
$ git rm --cached<file>            #停止跟踪文件但不删除
$ git commit -m "commit messages"  #提交所有更新过的文件
$ git commit --amend               #修改最后一次改动
# 查看提交历史
$ git log                    #查看提交历史
$ git log -p <file>          #查看指定文件的提交历史
$ git blame <file>           #以列表方式查看指定文件的提交历史
# 撤销
$ git reset --hard HEAD      #撤销工作目录中所有未提交文件的修改内容
$ git checkout HEAD <file>   #撤销指定的未提交文件的修改内容
$ git revert <commit>        #撤销指定的提交
$ git log --before="1 days"  #退回到之前1天的版本
# 分支与标签
$ git branch                   #显示所有本地分支
$ git checkout <branch/tag>    #切换到指定分支和标签
$ git branch <new-branch>      #创建新分支
$ git branch -d <branch>       #删除本地分支
$ git tag                      #列出所有本地标签
$ git tag <tagname>            #基于最新提交创建标签
$ git tag -d <tagname>         #删除标签
# 合并与衍合
$ git merge <branch>        #合并指定分支到当前分支
$ git rebase <branch>       #衍合指定分支到当前分支
# 远程操作
$ git remote -v                   #查看远程版本库信息
$ git remote show <remote>        #查看指定远程版本库信息
$ git remote add <remote> <url>   #添加远程版本库
$ git fetch <remote>              #从远程库获取代码
$ git pull <remote> <branch>      #下载代码及快速合并
$ git push <remote> <branch>      #上传代码及快速合并
$ git push <remote\> :<branch/tag-name\>  #删除远程分支或标签
$ git push --tags                       #上传所有标签

```
工具推荐：github desktop
https://desktop.github.com/download/
GitHub Desktop 是免费的开放源代码应用程序，可帮助处理托管在 GitHub 或其他 Git 托管服务上的代码。 使用 GitHub Desktop，可以在图形用户界面中执行提交和推送更改等 Git 命令，而不是使用命令行
