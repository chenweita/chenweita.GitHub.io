---
layout: post
title: 前端核心知识（14）————JavaScript预编译、作用域和闭包
date: 2017-07-19
tags: [JavaScript]
---

大家好，今天要讲的东西是JavaScript的预编译环节，JavaScript作用域和JavaScript一个很恶心的概念————闭包。事不宜迟，马上开讲。


## 预编译铺垫

首先，一个JavaScript称需要运行起来，要经历三个步骤：

    第一步：语法分析。通篇扫描一便，看一下有没有低级语法错误，例如有没有中文符号，低级语法错误。
    第二步：预编译。
    第三步：开始执行。

在介绍预编译的时候，要先铺垫一下一些知识。

### 暗示全局变量

任何地方的变量如果没有声明就赋值，就是全局变量。注意是！！任意的地方，这意味着如果在函数内部没用声明变量，就直接赋值，这个变量在全局都是被访问到。更进一步的意思就是，无论这个变量是否在局部作用域，它都能在全局作用域中被访问到。

另外，全局变量都是window的一个属性，可以通过属性名来进行访问：

      window.PropertyName

另外就是，暗示全局变量因为在全局也能访问到，因此，它也是window上面的一个属性，也能通过上述形式来进行访问。

要注意的是，未经声明就使用！！的变量是会报错！！

### 解析语法

JavaScript引擎解析语句的时候，是从左至右解析的，赋值的时候是从右向左的，这样就有一个问题产生了：

      var a = b =3;

首先，JavaScript引擎解析的时候，读到a的时候，因为它前面有一个var，声明了。但是对于b，它属于未经声明就赋值的变量，这样b就是一个暗示全局变量。

### 声明提升

先看这样一个例子：

      console.log(a);      //function a(){ }
      var a = 123;
      function a(){ }
      console.log(a);      //123

可能大家都会有这样的疑问，为什么会打印出东西，a都还没声明呢，对吧？因为这里存在声明提升。
      
声明提升就是，将变量声明和function声明提到顶部；

      函数声明提升 （相当于提升到程序最前）
      变量声明提升 （相当于把变量声明语句提升到程序最前）

而他们又有一些顺序，函数提升覆盖变量声明提升，执行变量赋值覆盖函数。

根据上面的代码，首先，var a ；会提升到函数顶部，但是还没完事，function又被提升了并覆盖，因此当地一句执行的时候，打印出的就是function那句，然后到a赋值了，于是a赋值之后，有吧function给覆盖了，所以最后打印出的是123。

于是，又有同学有问题了，最后不是有function语句吗？为什么不是函数？

注意啊，当function被提升之后，它不会再在执行阶段时候再次声明，因为已经声明过了，所以最后是123.

所以最后就打印出以上结果。

## 预编译正讲

好了，有了以上的铺垫之后，可以正式将预编译了。

首先预编译发生在执行的前一刻，它会有以下几步：

        第一步：产生执行上下文的对象（activition object）简称AO ，它存在于系统内部。

        第二步：找函数中的变量声明，找函数声明，直接提到函数顶部，并赋值undefined。

        第三步：函数中的形参和实参相统一，就是赋值。

        第四步：函数体赋值给对应的AO属性。

我们利用一个例子来进行讲解：

        function fn(a){
            console.log(a);        // undefined
            var a = 123;
            console.log(a);        // 123
            function a(){ }      
            console.log(a);        //123
            console.log(b);        //undefined
            var b = function(){};      
            console.log(b);          //function () {}
            console.log(d);         // function (){}
            function d(){}
        }
        fn(1);

以下是整个过程：

        AO = {

        a : undefined---- 1 ----function a () {} -----123 (后面的函数声明，因为已经被提升，执行阶段不再声明，所以最后值是123）

        b : undefined---- function () { }

        d : function d (){}

        }

以上各AO属性对应的最后值，就是打印结果，以下是分析：

首先，函数执行前一步，产生执行上下文AO（activition object），第二步，寻找变量声明，并赋值undefined，于是a和b被赋值为undefined。接着，形参实参相统一，这时候，a接收变量赋值，改变为1。然后，函数体赋值给对应的AO属性，最后function a() 和function b() 分别赋值，这时候d也被赋值为一个function。

最后到执行阶段，这时候，a被赋值为123，此时function被覆盖了，所以最后结果就是如代码注释所示。

为了加深理解，这里有两个例子，都是关于最后function语句和var 赋值之间覆盖的问题。

     function bar(){
        return foo;
        function foo(){ }
        var foo = 111
        }
        console.log(bar());   //一开始就被return，function bar (){} 还没到赋值!!就已经被覆盖。

     function bar(){
        foo = 10; 
        function foo(){ {;
        var foo = 11;
        return foo;
        }
        console.log(bar ());     //foo被赋值为11，最后才被return!!

这就是整个预编译的过程。


###　作用域精讲

首先，函数上面有一些东西是不提供操作的，其中有一个就是：scope属性，它存储的就是函数的真实的作用域，是函数执行期上下文的集合。

当一个函数执行的时候，会创建一个称为执行期上下文的内部对象。该执行期上下文定义了一个函数执行的环境，函数每次执行时对应的执行上下文都是独一无二的，所以多次调用一个函数会导致创建多个执行上下文，当函数执行完毕，它所产生的执行上下文就会被销毁。

传说中的作用域链：就是scope中所存储的执行期上下文的集合，这个集合成链式连接。就是作用域链。我们同样来个例子讲解：

      function a(){
         function b(){
             var b = 234;
         }
         var a = 123;
         b();
      }

      var glob = 100;
      a();

        a定义：a.[ [ scope ] ] ---> scope chain ---> 0:GO（全局作用域链）;如图一
        a执行：a.[ [ scope ] ] ---> scope chain ---> 0:aAO;   1：GO；如图二

图一：<img src="http://os310ujuc.bkt.clouddn.com/blog1.PNG">

图二: <img src="http://os310ujuc.bkt.clouddn.com/blog.PNG">


可以看到，当a定义的时候，已经拥有了GO，查找元素的时候，就是在scope里找，如果在自己的作用链就在自己的索取，如果不存在，就从顶往下寻找。
当函数执行完之后，会销毁a中产生的执行期上下文，回归到a定义的时候。这也可以跟我们之前所说的，只能里面访问外面的，不能外面访问里面的一样，具体到理论上，就是外面的作用链，没有局部的作用域链，所以不能找到所需要的变量。

同样，我们在分析一下b，当b定义的时候，已经又有了a的劳动成果，就是a的作用域。如图一。
然后当b执行的时候，又产生了自己的作用域链。如图二。

图一：<img src="http://os310ujuc.bkt.clouddn.com/blog3.PNG">

图二：<img src="http://os310ujuc.bkt.clouddn.com/blog4.PNG">

最后强调一下，当b执行完之后，意味着a也执行完了，意味着a和b的执行期上下文都被销毁，直接就恢复到a被定义的时候，只有全局的GO。

## 闭包初探

以上的所有铺垫，其实都是为了讲闭包。闭包是一个很重要的概念，无论是修复bug或者利用它的优点都是很常出现的。接下来讲讲究竟闭包是什么。。

老规矩，先来个例子：

    function a(){
       //AO = {  aaa:12 , b : function (){}}
       function b(){
       //AO = { bbb: 234}
       var bbb  = 234;
       console.log(aaa);
       }
       var aaa = 12;
       return b;
      }
      a();
      var glob = 100;
      var demo = a();
      demo();

先来说一下，当b执行完之后，就相当于a也执行完了，这样a都会把自己的执行上下文销毁，但是这时候，因为return b，把b保存给了外部的变量demo，这时候当demo执行的时候，可以正常打印出12，具体原因就是，虽然a把自己的执行期上下文删掉，但是这时候b仍然保存有a的劳动成果，当它返回给外部变量的时候，就相当于外部变量也有这个执行期上下文，所以就能够访问到aaa了。这就是我们经常听说的内存泄漏，就是因为原有的作用域链不释放所导致的。具体看下图。

a、b整个生命周期：<img src="http://os310ujuc.bkt.clouddn.com/blog5.PNG">

当a执行完成之后，a scope chain [0] 中的指向将会被删除，但是因为，b的指向仍然存在，所以仍能访问到所需要的变量。

这就是闭包的整个过程，函数保存到外部，但是仍然能够访问到里面的东西。


好吧，今天讲的够多的了，希望同学们能有所收获。晚安！！！























