---
title: MySQL启动失败
key: 2017-04-26
tags: MySQL
---

最近在服务器重启MySQL之后，发现报错了：

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/MySQL-error/1.png)

<!--more-->

于是`journalctl -xe`查看：

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/MySQL-error/2.png)

并没有查看到相关的错误信息，还是直接查看MySQL的日志吧

日志目录可以在MySQL配置文件里查看`/etc/my.cnf`

发现提示错误：`unknown variable 'default-character-seet=utf8'`

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/MySQL-error/3.png)

最后搜索了解，改成`character_set_server=utf8`就可以了