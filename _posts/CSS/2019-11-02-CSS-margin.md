---
layout: post
date: 2019-11-02
title: margin塌陷和margin合并
categories: blog
tags: [CSS]
---

今天楼上的装修声一样的吵啊，还没睡着就又被吵得不行，今天下雨，实在不想去肯德基了。今天的复习内容是关于CSS的一些典型的bug。那我们先从一些概念入手，然后发现问题，解决问题。

## css盒模型

1.content：内容区，大小为width x height。

2.padding：内边距，用来进行分隔边框和content，可以理解为缓冲位置。分上下左右四部分，设定的时候可以这样写

    padding:30px;(表示上下左右全部为30px;);

    padding:30px 20px 10px 20px;(顺序为 上右下左，进行设定内边距）;

    padding:50px 20px 30px;(顺序为 上 左右 下）;

也可以通过 padding-left 这样的形式进行单独的设定。
    

3.border：边框。

    border-width:15px;
    border-style:solid;
    border-color:balck;

这里有一点要注意style表示的是边框的样式为实线，颜色为黑色，边框粗细为15像素，border设定粗细的时候顺序问题跟padding是一样的。另外有一点要注意的是，当分别为border设定粗细的时候，要这样写：

    border-left-width:90px;
    
要先确定方向，在设定粗细。

4.margin：外边距，设定盒子与盒子之间的距离。可以单独设置。

那么当我们设置完成，这个结构就是一个又一个长方体嵌套，最里面是content,然后是padding，border，最后是margin。其实当设置一个盒子的时候，打开这个页面右键检查，就能看到盒子的结构图了，这个结构很重要，希望大家能记住。

ok,那么现在就开始讲一讲一个盒子究竟包含的哪些部分呢？

    <div>12345</div>
      div{
      width:100px;
      height:100px;
      background:red;
      padding:50px;
      margin:50px;
      border:10px solid;
    }
    
运行以上代码，我们可以看到，变红色是padding和content，border为黑色。现在的浏览器都是这样的样式，要注意的是，在IE6设置的话，border也是红色。这是一个很重要的兼容性例子。大家平常开发的时候就要注意了。

## margin塌陷问题和合并问题

到目前为止，css都有一个很大的bug没有被修复，它们就是著名的margin塌陷和margin合并。

### margin塌陷 
举个例子：
设置两个盒子，大盒子里有小盒子
        #wrapper{
            width:500px;
            height:500px;
            background: red;
            margin-top: 10px; 
            margin-right: 10px;
        
        #box1{
            width:100px;
            height:100px;
            background: red;
            margin-top: 10px;
            margin-right: 10px;
            float:left;
            } 
        }
设置 margin-top的时候，如果小于大盒子的margin-top，小盒子不动。大于大盒子的margin-top，会连带大盒子一起往下移。
    


#### 解决方法


触发bfc机制
--------------------------------------------------------------


## margin合并

margin合并讨论的就不是父子结构了，讨论的是兄弟结构。这时候我们需要在其中一个兄弟元素中套上一个父级标签，对父级标签触发bfc即可解决这个问题。但是通常我们不会通过这种方法解决margin合并的问题，因为这样会带来其他的反效果。我们会通过通过再次设定margin的方法解决这个问题。

设置两个盒子，两个盒子的垂直方向上的margin-top或是margin-bottom谁大，两盒子距离就为多少
        #box1{
            width:100px;
            height:100px;
            background-color: aqua;
            margin-bottom: 10px; 
            margin-left: 10px;
       
       
        #box2{
            width:100px;
            height:100px;
            background: red;
            margin-top: 10px; 
            margin-right: 10px;
        }


## 层模型

说道层模型，大家可能就会想到盒模型，但是层模型根盒模型真的不是一回事，听我慢慢给你介绍吧。

1.首先来了解一下定位。position，它有以下几个值，static，absolute，relative。

当一个元素设定了
    
    position:absolute；
    
 表示它已经成为一个定位元素了，它的特点就是，脱离原来的位置，相对于最近的有定位的父级元素进行定位，如果没有有定位的元素，它就会相对于浏览器进行定位。
 
 当然啦，一个它还要结合left/right ，和top/bottom ，来进行设置才能出现咱们想要的页面效果。那为什么要称之为层模型呢？请看下面例子。
 
        <div class='first'></div>
        <div class='second'></div>
     
     .first{
        position:absolute;
        left:100px;
        top:
        width:100px;
        height:100px;
        background:yellow;
        }
     .second{
         position:absolute;
         left:50px;
         top:50px;
         width:100px;
         height:100px;
         background:green;
         }
 
 来看一下效果，
 
 <img src="http://os310ujuc.bkt.clouddn.com/first.PNG">
 
 现在是绿色的在上层，黄色在下层，这主要是跟他们的编码顺序有关系，简单来说，left和top就相当于X轴Y轴，怎样设定z轴？通过z-index来进行设定，
 就好比z-index=0就是在地下，z-index=1就是上面一层。我们来操作一下。
 
 其他属性保持不变，进行z-index设置。
 
     .first{
        z-index:1;
        }
     .second{
         z-index:0;
         }

于是就出现这种情况：

<img src="http://os310ujuc.bkt.clouddn.com/second.PNG">

这时候黄色就变成在绿色上方了。所以称之为层模型。真的挺形象的有么有。哈哈哈。

2.OK,继续来介绍relative，这个地位跟absolute定位就有很大差异了，首先它不会脱离原来的文档流，并且，它是想对他自己原来的位置进行定位。当使用了

position:relative;进行定位的时候，元素首先会出现在自己的位置上，然后再根据left，top的值，以自己原来的位置进行定位。

3.position:fixed,相对于可是窗口进行定位，典型的例子就是顽皮的小广告，窗口无论怎样往下走，他都是固定的位置，不会动弹。

OK，最后介绍一下， 在我们进行定位的时候，要使用relative作为参照物，利用absolute进行定位。这样可以使参照物保留原来位置不动。

今天的博客就完事啦，记得点赞哦。








    
