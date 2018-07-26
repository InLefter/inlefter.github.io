---
title: Git简单操作
key: 20151105
tags: Git
---

这段时间特别需要Git，但并没有牢记，每次都是搜索找命令==，
于是大致整理了下关于Git操作的指令。

五个远程操作：
* git clone
* git remote
* git fetch
* git pull
* git push

<!--more-->

#### 一、git clone
顾名思义，克隆嘛，从远程主机clone一个版本库
`$ git clone <版本库地址>`
该命令会生成一个目录，名字和远程主机相同，若有不同的需求，可附加参数，如：
`$ git clone <版本库地址> <目录>`

当然，支持的地址协议有很多，比如HTTPS、SSH等等。SSH应该是大部分用户选择的吧。

#### 二、git remote
管理远程主机。
添加本地主机：
`$ git remote add <主机名> <网址>`
删除本地主机：
`$ git remote rm <主机名>`
列出本地主机：  (可附加`-v`参数，用以查看详细信息。)
`$ git remote (-v)`
查看指定主机：
`$ git remote show <主机名>`
修改主机名：
`$ git remote rename <主机名>`

#### 三、git fetch
更新版本库，去更新到本地
`$ git fetch <主机名>`
可指定分支：
`$ git fetch <主机名> <分支>`

在这里，顺便扯到`git branch`，参数`-r`查看当前分支，`-a`查看所有分支。**直接加分支名就是切换分支**

`git checkout`创建或者切换分支，比如`git checkout -b NewBranch`就是创建的同时并且切换到新的分支NewBranch。

`git merge`和`git rebase`用作合并分支，具体区别日后有空，再详细的写一下。
`git merge master dev_main`----合并master和dev_main


#### 四、git pull
`git pull`取回分支的更新，并与本地合并。

格式：`git pull <origin> <master>:<master>`
origin的master分支和本地的master合并。
如果默认是当前分支，可省略冒号后面的部分。

若存在追踪关系，可更加省略：
`git pull <origin>`

只有一个分支的话，主机名也可去掉。

#### 五、git push
推送本地更新至远程主机。其实各式和`git pull`相类似
省略分支名：`git pull <origin> <master>`
本地的master推到origin远程的master。

若存在追踪关系，可更加省略：
`git pull <origin>`

只有一个分支的话，主机名也可去掉
