---
layout: post
title: 牛客网一些http题目的掌握
date: 2019-09-30
tags: [HTML]
---

1.http和https的区别：
- https需要ca证书，费用较高
- http是超文本传输协议，而https是具有安全性的能进行加密传输的协议
- http默认端口为80，而https的默认端口为443
- http的连接是无状态的，但https是http和ssl构成的能进行加密传输和身份认证的网络协议，比http安全

2.https的优点
- https能认证用户和服务器，将数据准确的发送到正确的客户机和服务器
- https是http和ssl构成的能进行加密传输和身份认证的网络协议，比http安全，能保证数据在传输的过程中不被窃取，改变，确保了数据的完整性
- https是先行架构下最安全的解决方案，虽然不是绝对安全，但大大增加了攻击人的成本
- 谷歌曾在2014年8月调整搜索引擎算法，发现相比同等http网站，https网站的搜索结果排名更前

3.https的缺点
- https握手时间较长，使页面加载时间延长了50%，增加了10%-20%的耗电
- https需要ca证书，功能越强大的证书越贵
- https不如http缓存高效，会增加数据开销
- https需要绑定ip，一个ip不能绑定多个域，ipv4资源不能支持这种消耗

4.tcp和udp的区别
- tcp是面向连接的，而udp不是，即在发送数据前不需要先建立连接
- tcp提供可靠的服务，保证数据在传输的过程中无差错，不丢失，不重复，且按序到达。udp尽最大努力交付，即不保证可靠交付，所以在大数据的交换中，一般使用tcp
- tcp面向字节流，udp面向报文，所以在网络拥塞是发送速率不会减慢
- tcp是一对一的，而udp是一对多
- tcp的首部较大，为20字节，而udp是8字节
- tcp提供可靠的传输，udp不可靠

5.http的请求方式
head:类似于get请求，只不过返回的响应中没有具体的内容，用户获取报头
options:允许客户端查看服务器的性能，比如服务器支持的请求方式

6.一个图片url访问后直接下载怎么实现
请求的返回头里，用于服务器解析的重要参数就是oss的API文档里的返回http头，决定用户下载行为的参数
下载的情况下：
x-oss-object-type:Normal
x-oss-request-id:
x-oss-storage-class:Standard

7.web quality(无障碍)
能够被残障人士使用的网站才能称得上是一个易用的网站
残障人士指的是带有残疾或者身体不嘉健康的用户
比如说alt属性，有时候浏览器会无法显示图像，具体的原因有：
用户关闭了图像显示
浏览器是不支持图像显示的迷你浏览器
浏览器是语音浏览器，（供盲人和弱视人群使用）如果使用了alt属性，至少浏览器可以显示或者读出关图像的显示。

8.BOM属性对象方法：
- location
location.href:返回或设置当前文档的url
location.hash:返回url#后面的内容
location.host:返回url的域名
location.hostname:返回url的主域名
location.search:返回url中的查询字符串部分，？后的部分（包括？）
location.pathname:返回url的域名后的部分
location.port:返回url的端口
location.protocol:返回url的协议部分
location.assign:设置当前文档的url
location.replace():设置当前文档的url，并在history对象的地址列表中删除这个url
location.reload():重载当前页面

- history
history.go(num) 前进或后退指定的页面数
history.back() 后退一页
history.forword() 前进一页

- Navigitor对象
navigitor.cookieEnabled 返回当前浏览器是否支持（启用）cookie
navigitor.userAgent 返回用户代理头的字符串表示（包括浏览器版本的字符串）

9.HTML drag api
- 事件主体是被拖放元素
dragstart 在开始拖动时触发
drag 在拖动时触发
dragend 在整个拖动过程结束后触发

- 事件主体是目标元素
dragenter 拖放元素进入目标元素后触发
dragover 拖放元素在目标元素中移动触发
dragleave 拖放元素脱离目标元素后触发
drop 目标元素完全接收被拖放元素后触发

10.http2.0

11.状态码
- 400 请求无效
- 401 当前请求需要用户验证
- 403 服务器已经得到请求，但是拒绝执行

12.fetch发送两次请求的原因
用fetch的post请求时，导致第一次发送了options请求，询问是否支持修改的请求头，如果服务器支持，则在第二次发送真正的请求

13.html语义化标签的理解
正确的标签包含了正确的内容，结构良好，易于阅读，比如nav表示导航条，类似的还有article,header,footer等标签

14.iframe是什么，有什么优点
会创建包含另一个文档的内联框架。
提示：可以将提示文字放在<iframe></iframe>之间，来提示某些不支持iframe的浏览器
缺点：
- 会阻塞页面的onload事件
- 搜索引擎无法解读这种页面，不利于SEO
- iframe与主页面共享连接池，而浏览器对相同的区域有限制所以会影响性能。

15.Doctype作用，严格模式与混杂模式如何区分，有什么意义
Doctype声明在文档的最前面，告诉浏览器以何种方式渲染页面，这里有两种模式，严格模式和混杂模式
严格模式的排版和JS运作模式是以该浏览器支持的最高标准运行
混杂模式，向后兼容，模拟老式浏览器，防止浏览器无法兼容页面

16.cookie如何防范XSS攻击3
XSS（跨站脚本攻击），是指攻击者在返回的HTML中嵌入js脚本，为为了减轻这些攻击，需要在HTTP头部配上set-cookie
httponly 这个属性可以防止XSS，他会禁止js脚本来访问cookie
secure 这个属性告诉浏览器仅在请求为https的时候发送cookie

17.cookie和session的区别
http是一个无状态协议，因此cookie的最大作用就是存储sessionID用来唯一标识用户

18.用一句话概括restful
用url定位资源，用http描述操作

19.click在ios上有300ms的延迟，原因是什么，怎么解决
- 禁用缩放 
<meta name="viewport" content="width=device-width,user-scalable=no">
- 利用FastClick,原理是
检测到touchend事件后，立刻触发模拟click事件，并且把浏览器300ms后真正触发的事件给阻断掉

20.addEventListener参数
addEventListener(event,function,useCapture)
event指定事件名，function指定要事件触发时执行函数，useCapture指定事件是否在捕获或者冒泡阶段执行



