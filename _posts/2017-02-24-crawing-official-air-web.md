---
title: 爬取全国城市空气质量发布平台数据
key: 20170224
tags: Python
---

### 前言

> 爬取网页的内容现在已经很简单了，然而某些动态刷新的页面却不是那么简单了，比如接下来所说的[全国城市空气质量发布平台](http://106.37.208.233:20035/)

<!--more-->

### 记录

在SRTP的项目中，有爬取空气质量平台数据的需求，打开这个网站，发现是这么一个提示：

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/Air-Crawling/171806@2x.png)

原来是基于微软的Silverlight开发的，一个几乎已经淘汰的产品，现在竟然还在使用。

安装好对应的版本后使用IE或者Safari打开（Chrome很早就停止了对它的支持，Safari中会出现中文显示不出的问题，建议用IE）

万变不离其宗，打开Fiddler进行网络分析，惊呆，全是乱码！

![](https://git.oschina.net/iLefter/PublicScreenshots/raw/master/Air-Crawling/17286.png)

可仔细看看还是xml的结构啊，后来在CSDN的博客上找打了这篇文章[c#爬取Silverlight网页 2](http://blog.csdn.net/kangrydotnet/article/details/45038527)

博主的经历简直和我相似，也是爬取的空气质量网站的数据，文章中介绍了在传输格式为`Application/msbin1`的情况下，可以使用[WCF-Binary-Message-Inspector](https://github.com/waf/WCF-Binary-Message-Inspector)的插件，然后对wcfbin的数据进行解析，最终转化为明文。 

然而事情并不是那么简单，POST请求的body数据虽然经过WCF-BIN的转换后可以正常的显示成XML的数据了，但是其中的主要信息还是一串加密过的字符串。类似base64加密的字串，但是利用在线base64解密的网站却无响应。

于是再回头来看博主的文章，发现有一个前系列[C#爬取Silverlight网页](http://blog.csdn.net/kangrydotnet/article/details/43987835)，其中介绍了关于加密解密的分析过程，然而在实践的过程中，并没有找到dll文件中关于任何加密和解密的函数，更不用提加密的密钥和盐值了。

实在无解，便请教了博主，过了差不多一个月，得到博主的回复，但是情况并不怎么乐观，博主对于这个网站的加密也没有任何办法，初步认为还是根据密钥和盐值加密的，并且通过配置文件得到，顿时觉得绝望，而那段时间面临期末考试，课程也多，事就搁住了。

寒假回家，发现了又有**路人大神**回复了，并且给出了新的方向：

> 回复wangshaner1：是这样的，他那个加密的字符串是一个人工Gzip的deflate方式压缩的串，可以转换成16进制看到，里面有个幻数，将整个他的整个二进制向右做4个位置偏移就可以正常解压，最后转成utf-8格式就可以了

于是再回来看，经过多次抓包发现，的确有可能是这样，二进制右移4位，相当于16进制右移1位，但是幻数的概念却不是很清楚，上网搜了下，有如下解释：

> 幻数（外语：magic number），它可以用来标记文件或者协议的格式，很多文件都有幻数标志来表明该文件的格式。

可到底是几位字节的呢？维基上有解释：

> "gzip" is often also used to refer to the gzip file format, which is:
>
> - a 10-byte header, containing a [magic number](https://en.wikipedia.org/wiki/Magic_number_(programming)) (1f 8b), a version number and a timestamp
> - optional extra headers, such as the original file name,
> - a body, containing a DEFLATE-compressed [payload](https://en.wikipedia.org/wiki/Payload_(communication_and_information_technology))
> - an 8-byte footer, containing a [CRC-32](https://en.wikipedia.org/wiki/CRC-32) checksum and the length of the original uncompressed data, modulo 2^32.

然而好像这串字符串16进制的前几位是`654a7a`，并不是`1f 8b`经过移位得到的。
试试强制移位解压，提示头字节错误。再次谷歌，在[IETF](https://tools.ietf.org/html/rfc6713)上找到关于zlib和gzip的协议解释，其中有一段关于magic number的解释：

> ```
> Additional information:
>       Magic number(s): first byte is usually 0x78 but can also be 0x08,
>       0x18, 0x28, 0x38, 0x48, 0x58, or 0x68.  The first two bytes, when
>       interpreted as an unsigned 16-bit number in big-endian byte order,
>       contain a value that is a multiple of 31.
> ```

字符串开头的16进制都不符合上述的条件，所以路人大神的建议已放弃。

迫于无奈实在是无解，暂时放弃了。

### 解决

最终在误打误撞的情况下，发现了的确是按照刚开始想的那样，base64加密的，但是加密的不是原始数据，而是deflate方式压缩过后的二进制。过程如下：
```
data = base64.b64decode(data)
data = zlib.decompress(data)
```
base64强制解密，再gzip解压就可以了

### 总结
关于[全国城市空气质量发布平台](http://106.37.208.233:20035/)的爬取数据过程可谓是不简单的，最终是以误打误撞的结局收尾，可谓是惊喜。反过来再想想，国家对于空气质量数据的开放虽说可以通过网站查询，但是便捷性和可读性却不是那么高，这也是我最初开始做这个SRTP项目的原因了。

### 后记
2017-03-09
最终在爬虫的部分可以说完成了大部分的工作，放在了Github上便于分享。
[InLefter/Air_Of_China](https://github.com/InLefter/Air_Of_China)

#### # 配合Mysql v5.7版本，便于数据的分区和查询

#### # 配合Redis，减轻服务器请求的频繁访问数据库的压力