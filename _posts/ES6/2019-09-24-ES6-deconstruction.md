---
layout: post;
title: ES6d的解构;
tags: [ES6];
date: 2019-09-24;
---

我们首先说一下解构为什么产生，它是为了使数据访问更便捷。

在ES5及以前，为了从对象和数组中获取特定数据并赋值给变量，编写了许多同质化的代码。

    let options = {
        repeat:true;
        save:false;
    }//从对象中提取数据

    let repeat = option.repeat;
        save = option.save;

但是，如果我们要提取更多的变量，挖取更深层次的数据，就变得很麻烦。
在ES6中为数组和对象添加了解构功能，将数据结构打散的过程变得更简单了，可以从打散后更小的部分中获取所需信息

## 对象解构：

在一个赋值操作符左边放置一个对象字面量

        let node = {
            type:"indentifier",
            name:"foo"
        };
        let{ type,name } = node;
        console.log(type);    //"indentifier"
        console.log(name);    //"foo"

注：
不要忘记初始化程序
如果使用let,var,const解构声明变量，则必须要提供初始化程序，都会导致程序抛出错误

    var{ type,name };
    let{ type,name };
    const{ type,name };
    //语法错误

如果不使用解构功能，则var和let声明不强制要求提供初始化程序但是对于const声明，无论如何必须提供初始化程序

## 解构赋值：

    let node = {
        type:"indentifier",
        name:"foo"
    },
        type = "indentifier",
        name = 5;
    //使用解构语法为多个变量赋值
    let{ type,name } = node;
    console.log(type);    //"indentifier"
    console.log(name);    //"foo"

语法规定：代码块语句不允许出现在赋值语句左侧，所以赋值语句就相当于无效

解构赋值表达式的值与表达式右侧的值相等，在任何可以使用值的地方都可以使用解构赋值表达式，

    let node = {
        type:"indentifier",
        name:"foo"
    },
        type = "indentifier",
        name = 5;
    function outputInfo(value){
        console.log(value === node);  //true
    }
    outputInfo{ type,name } = node;
    console.log(type);    //"indentifier"
    console.log(name);    //"foo"
    // 调用outputInfo()函数时传入了一个解构表达式

注：解构赋值表达式右侧如果为null或undefined会导致程序抛出错误。

默认值：
使用解构赋值表达式时，如果指定的局部变量名称在对象中不存在，那么这个局部变量会被赋值为undefined

    let node = {
        type:"indentifier",
        name:"foo"
    };

    let{ type,name,value } = node;
    console.log(type);    //"indentifier"
    console.log(name);    //"foo"
    console.log(value);  //undefined

当指定的属性不存在时，可以随意定义一个默认值，在属性名称后添加一个等号（=）和相应的默认值即可

    let{ type,name,value = true } = node;
    console.log(value);  //true

为非同名局部变量赋值：
先看一个例子：

    let node = {
        type:"indentifier",
        name:"foo"
    };
    let{ type:localType,name:localName } = node;
    console.log(localtype);    //"indentifier"
    console.log(localname);    //"foo"

读取名为type的属性并将其储存在变量localType,这种语法实际上与传统对象字面量的语法相悖，值在左边，对象属性名在右边
当使用其他变量名进行赋值时也可以添加默认值

    let{ type:localType,name:localName = "bar"} = node;

嵌套对象解构：

    let node = {
        loc:{
            start:{
                line:1,
            }
        }
    };
    let{loc:{start}} = node;
    console.log(start.line)  //1
    也可以使用一个与对象属性名不同的局部变量名：
    let{loc:{start = localStart}} = node;
    console.log(localStart.line)  //1

值得注意的是：在使用嵌套结构功能时，你很有可能创造了一个无效表达式，虽然花括号在对象结构的语法中是合法的，但这条语句什么用都没有
    let{ loc:{}} = node;

## 数组解构：
使用的是数组字面量，且解构操作全部在数组内完成

    let colors = ["red","green","blue"];
    let[firstColor,secondColor] = colors;
    console.log(firstColor);   //red
    console.log(secondColor);   //green

在数组解构语法中，通过值在数组中的位置进行选取且可以将其储存在变量中，未显式声明的元素都会被直接忽略。如果你想选取数组中的第三个值，则不需要提供第一个和第二个

    let colors = ["red","green","blue"];
    let[,,thirdColor] = colors;
    console.log(thirdColor);   //blue
    //逗号是前方的占位符

## 解构赋值：

数组解构也可用于赋值上下文，但不需要用小括号包裹表达式

    let colors = ["red","green","blue"];
    firstColor = "black";
    secondColor = "purple";
    [firstColor,secondColor] = colors;
    console.log(firstColor);   //red
    console.log(secondColor);   //green

与对象的解构赋值情况一样，被定义后的变量即使重新赋值，结果也不会变

数组解构赋值的独特用例：
交换两个变量的值
举个例子：交换a和b的值

    let a = 1,
        b = 2,
        c;
        c = a;
        a = b;
        b = c;
        console.log(a);  //2
        console.log(b);   //1

使用解构赋值：（减少了中间变量）

    let a = 1,
        b = 2;
    [a,b] = [b,a];
    console.log(a);  //2
    console.log(b);   //1

默认值：与对象结构赋值类似

    let colors = ["red"];
    let[firstColor,secondColor = "green"] = colors;
    console.log(firstColor);   //red
    console.log(secondColor);   //green

嵌套数组解构：

    let colors = ["red",["green","lightgreen"],"blue"];
    let[firstColor,[secondColor]] = colors;
    console.log(firstColor);   //red
    console.log(secondColor);   //green

不定元素：在数组中，可通过...语法将数组中其余元素赋值给一个特定的变量

    let colors = ["red","green","blue"];
    let[firstColor,...restColors] = colors;
    console.log(firstColor);   //red
    console.log(restColors.length);   //2
    console.log(restColors[0]);   //green
    console.log(restColors[1]);   //blue

在ES5中，开发者经常用concat()克隆数组，但在ES6中，可用不定元素克隆数组

    let colors = ["red","green","blue"];
    let[...clonedColors] = colors;
    console.log(clonedColors);   //["red","green","blue"]

## 混合解构：

可使用数组解构和对象解构创建更多复杂的表达式

## 解构参数

### 必须传值的解构参数：

默认情况下，如果调用函数时不提供被解构的参数会导致程序抛出错误
