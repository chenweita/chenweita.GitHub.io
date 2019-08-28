layout: post
date: 2019-08-29
title:  JavaScript的类型转换
tags: [JavaScript]
---

大家晚上好，今天要复习一下关于JavaScript的类型转化的知识。

## 编程形式的区别 

开始正式内容之前先讲一讲，一个小话题。

编程语言按照形式上分，有两类，第一种称之为面向过程，第二种称为面向对象。

面向过程编程：主要是按照步奏来来进行编程，考虑是怎么做。典型例子为C语言。

面向对象编程：包含面向过程编程，但是它主要考虑是处理方法，利用什么资源进行编程，更加的结构化。

## typeof 运算符

typeof()六种数据类型：

        typeof(1); //Number
        typeof(abc); //String
        typeof(ture);//Boolean
        typeof(undefined);//undefined

### 显示类型转换：

(1)Number("");


        var a=2*"2";
        document.write(typeof(a)); 

这个a的类型是字母还是数字呢？正确答案是数字，因为在进行2*"2"时，系统将字符串2转化为数字2，然后进行计算。这就是我们所说的显示类型转换。

那我们再看一道题：

        var num = Number("123");
        document.write(typeof(num)); 

这个打出来的结果是什么呢？跟上题一样，经过显示类型转换，字符串123变成数字123，所以类型是数字。

true，abc，undefined，NaN，""进行转换后，结果是什么。


首先看第一个，布尔值转化为数字，ture变成1，false变成0，第二个是字符串abc，系统转不了abc，但是它很负责任，不能转的就变成了NaN，第三个undefined结果也是NaN，第四个NaN，它对应的数字并不是NaN，而是0，第五个""空串也是变成0。


(2)parseInt()

        var num=parseInt();
        document.write(typeof(num)); 

这个跟上面的Number有些相似，但它的要求更高，它致力于将别的类型转换为整数类型的数字，所以字符串123变成整数类型123。

"abc"的结果也是NaN；ture，false，null，undefined NaN

如果是"123abc"转换的结果是什么？parseInt()会从第一位数字开始看，直到最后一位数字，截止于非数字类型，然后返回数字123

        num=parseInt(“);
        var num=parseInt("123",radix);


radix的意思是进制，取值范围为2-36。

0进制：认为成正常10进制，但不在所有浏览器里通用

(3)parseFloat()
会把数据转换成浮点型且只有一个参数。

        var num=parseFloat("10.234");
        document.write(typeof(num)); 

转换出来还是10.234

10abc跟parseInt()会截断数字和非数字，然后返回数字10。

10.123.123:10.123；只能识别第一个点之前的数。

(4)toString(radix)

        var str=123;
        var demo=str.toString()

结果是字符串123

值得注意的是：undefined,null不能用tostring方法，会报错

        var str=123;
        var demo=str.toString(radix)

以十进制为基底转换为radix进制

(5)toString() 

作用是转换为字符串

此时的undefined可以转换，结果是undefined

(6)Boolean()

undefined,空串，0，null的结果都是false

abc：1；

这里有一个问题，如何将11110000二进制转换为八进制：

        var num=parseInt("11110000",2);
        document.write(num.tostring(8));

### 隐式类型转换
(1)isNaN()

        isNaN(NaN) ture；
        var a = 2 == 1;
        doncument.write(a); //false

        var a = undefined == undefined;
        doncument.write(a);  //ture

        NaN == NaN;  //false

NaN非常特殊，NaN不等于任何东西，包括他自己。

"123" false "abc" ture 
var a = "abc" ;
doncument.write(a);  ture
系统会先调用一个Number(),判断为NaN，所以结果为ture
123abc 转化不了 NaN
求NaN等于NaN
doncument.write("NaN"="NaN");  ture字符串只要长得相同就行了
null 0；false
(2).++/--;+/-;
var a=123;
a++;
document.write(typeof(a)); number
字符串123； 先Number(a)后++
document.write(typeof(a++));
先typeof后a++
var a=123;
document.write(a++ + ":"+typeof(a)); 
先打印后++
但是无论++在前在后，一定会先转化为Number
"abc" NaN+1 NaN
var a="abc";
document.write(typeof(+a)); number
var a=-"abc";
document.write(typeof(a)); number
(3).+
var a=1+"2"; 先转换为字符串类型
(4).-*/%
var a=1-"2"; 先转换为number类型
(5).&&||!
先转换为boolean值
(6).<> <= >= 先转换为boolean值
var a=1>"2"; 一侧是数字另一侧转换为数字后比较
都是字符串 比较ASC值
var a=undefined，null==0; 无论是大于等于小于等于或是等于都不成立
var a=undefined==null；  ture 只有转换成布尔值才相等
(7).== != 先转换为boolean值
var a=1！="1"; false 
只有弱数据语言才有隐式类型转换
=== 绝对等于 不发生隐式类型转换，必须一样
var a=NaN ===NaN； false 


例题：var a=("11"*3+"2")/2; 注意数字+字符串 连着
先33，后332，最后166

var str=false+1；
document.write(str) 1

var str=false==1；
document.write(str) false
   undefined   -1+NaN+"" 字符串的NaN
if(typeof(a)&&-ture+ (+undefined)+""){
document.write('打印') 打印
}
未经声明访问 报错 但typeof(a)不会报错
typeof(typeof(123)) 最后结果是字符串

 ture+false=1|| 直接停，不打印
!!" " + !!" " - !!false||document.write('打印')
打印不了

练习：
alert(typeof(a));   string          
alert(typeof(undefined));    undefined  
alert(typeof(NaN));  undefined
alert(typeof(null));  object
var a="abc123";
alert(typeof(+a));  Number NaN
alert(typeof(!!a));  bollean 
alert(typeof(a+""));  string
alert(typeof(1=="1"));  bollean
alert(typeof(NaN=="NaN"));  bollean
alert(typeof(NaN==undefined));  bollean
alert(typeof("11"+11));1111
alert(typeof(1==="1"));  bollean false
alert(paresInt("123abc")); 整型数字 123
var num=123.123; 
alert(num.toFixed(3)); 保留3位有效数字，且四舍五入
typeof(typeof(a)); ！！！！string
 
