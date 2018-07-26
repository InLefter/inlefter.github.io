---
title: 利用Swift试写的一个简单天气App
key: 20160428
tags: Swift
---

这段时间零零碎碎的学了关于iOS开发的知识，由于只有Swift的简单基础，接触Xcode的时间不长，还不知道怎么更好的使用它，所以成果也显得简陋很多。

<!--more-->

#### 结果

#### 效果

主界面截图：

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/Wea-OK/2.png)

#### 总历程

最开始选择做的天气App，是因为免费开源的天气API借口有很多，同时也能实战网络请求与网络返回信息的处理解析。

整个框架设计，最初模仿的整体大致是iOS自带的天气APP，随着一步一步的实现，大部分都很简单的，都是UITableVIew或是UIScrollVIew的使用，当然这个小App可能还不能称得上App，因为设计模式什么的都没有考虑，完全是新手摸索的第一步。日后有时间会回来修改的，立下flag。。

最后归纳来说还是实现了自带天气App80%的相似功能。让人最头疼的是自带的天气动态背景效果，由于刚接触iOS开发，所以并没有很好地头绪*(又在此挖下坑)*。

#### 问题&解决方法

* 获取当地的城市信息（如城市名字）：最初一开始所想的是使用iOS自带的反向地理编码，但是效果似乎不是很好，之后便使用了百度地图的API，借助于它的服务器做了反编的工作。
* 合适的天气API：想做这个APP的时候本已经选定了[OpenWeatherMap](http://openweathermap.org/)，开源的天气数据提供商，后来为了适合需求，改成了国内的每日免费3000次请求的提供商[和风天气](http://www.heweather.com/)。
* 天气信息的解析：轻量级的互联网交互数据格式----JSON，采用了开源的解析框架-SwiftyJSON。（*推荐*）
* 其他：关于UIView的使用，一开始官方文档读的不是很多，并不清楚View的多种生成方式。待日后不断实践解决吧！

#### The Last

最后再放几张图吧。。。

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/Wea-OK/1.png)

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/Wea-OK/3.png)

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/Wea-OK/4.png)

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/Wea-OK/5.png)
