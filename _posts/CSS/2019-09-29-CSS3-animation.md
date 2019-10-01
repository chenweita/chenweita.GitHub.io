---
layout: post
title: CSS3动画
data: 2019-09-29
tags: [css3]
---

今天起了个大早，下楼洗衣服去了，等衣服的时间里更新一条博文好了。

## 形状变换  —   高级动画基础

transform  可以实现元素的形状、角度、位置等的变化。属性值：

1.rotate(); 以x/y/z为轴进行旋转，默认为z

	rotatex(), rotatey(), rotatez(), rotate3d(x, y, z, angle) x, y, z --->
	
rotateZ()：正值顺时针转，rotateY: 绕着Y轴开始旋转，rotateX():绕着X轴开始旋转。

rotate3D(x,y,z.angle),三个轴一起转。对应轴上可填写1或0，表示是否参与旋转。

2.scale(); 以x/y为轴进行缩放

scale(x, y) 接受两个值，如果第二参数未提供，则第二个参数使用第一个参数的值

scalex(),scaley() 值是数字表示倍数，不加任何单位，如果是赋值会发生倒立或反转。（x轴倒立，y轴翻转）

scalez()

scale3d()  scale3d(sx,sy,sz)


3.skew(); 对元素进行倾斜扭曲

skew(x, y);接受两个值，第一个参数对应X轴，第二个参数对应Y轴。如果第二个参数未提供，则默认值为0

skewx(), skewy()

4.translate(); 可以移动距离,相对于自身位置。

    translate(x, [y])

translatex(),translatey(),translatez(),translate3d(x, y, z)。利用这个可以实现居中展示：
	
	div{	
		position:absolute;
		left:50%;
		top:50%;
		background: orange;
		transform: translate(-50%,-50%);
	}

5.transform-orgin 变换旋转原点

任何一个元素都有一个中心点，默认情况下，其中心点是居于元素x轴和y轴的50%处，如图为

<img src="http://outu8mec9.bkt.clouddn.com/css12.png">

关键字：
	
<img src="http://outu8mec9.bkt.clouddn.com/css13.png">

	transform-origin：top;//以顶部50%的位置作为旋转原点。

## transition  过渡动画

### hover 

	div{
		width: 100px;
		height: 100px;
		background: red;
	}
	div:hover{
		width: 400px;
		height: 200px;
	}

当我们使用这个的时候，是发生的突变，变化很快，给人感觉很不好，于是就出来了一个叫过渡动画的概念，我们可以实现让div hover的时候慢慢变化。

### 过渡动画

transition  属性是css3的一个复合属性，主要包括一下几个子属性

transition-property:指定过渡或动态模拟的css属性

transition-duration:指定过渡所需要的时间

transition-timing-function:指定过渡函数

transition-delay:指定开始出现的延迟时间

  transition: width(如果高度也要实现渐变需要写all) 3000ms linear 20;

但是有些内容不能使用过度，如下图：

能参与过渡的属性：

<img src="http://outu8mec9.bkt.clouddn.com/css14.png">


这个是在使用animation之前设定的，它会按照定义的状态发生相应的改变，例如：
	
	@keyframes demoMove{//每一个keyframes都要设定一个关键帧，用来以后调用
		0%{ background-color:red;} //初始颜色为红色
		10%{ background-color:green;}//动画到10%的时候，颜色是绿色
		20%{ background-color:blue;}//动画到20%的时候，颜色为蓝色
		50%{ width:200px;}         //50%时间宽度是200
		100%{ height:200px;}		//最终状态高度变为蓝色
	}

帧频里面如果只有 0% 和 100%两个关键帧，那么可以用 from to 代替

### animation 动画

animation 属性为css3的复合属性，主要包括以下子属性：

1.animation-name:  此属性为执行动画的 keyframe 名，就是设定关键帧的时候设定的名字。

2.animation-duration:此属性为动画执行的时间，对应的是关键帧里面设定百分数

3.animation-timing-function:指定过渡函数速率（linear，）

4.animation-delay: 执行延迟时间，跟过渡动画是一个意思

5.animation-direction（动画执行方向）:

	normal(0%--->100%)/
	reverse（100%---->0%）/
	alternate(奇数次正向，偶数次反向）/
	alternate-reverse（奇数次反向，偶数次反向）; 

6.animation-iteration-count:动画执行次数，infinite（无数次）/number（具体次数）;

7.animation-fill-mode:forwards/backwards/both/none;
是用于当动画不播放时（动画完成时，或是当动画有一个延迟未开始播放时），要应用到的元素的样式，即其动画效果是否可见。

8.animation-play-state:属性主要用来控制元素动画的播放状态。一开始默认是播放。

			running 播放
			paused  暂停

利用JavaScript动态改变animation-play-state的值，可以实现动画的动态变化。
			
9.animation-fill-mode:属性定义在动画开始之前和结束之后发生的操作。主要具有四个属性值：

			none:
				默认值，表示动画将按预期进行和结束，在动画完成其最后一帧时，动画会反转到初始帧处
				
			forwards:
			    表示动画在结束后继续应用最后的关键帧的位置，不会回到动画一开始的位置。
				
			backwards:
			    会在向元素应用动画样式时迅速应用动画的初始帧，例如初始位置是在0，初始帧是在150px，那么使用了backwards，会在150px处开始动画。
				
			both:
			    元素动画同时具有forwards和backwards效果

最后来个例子：

		animation: move 2s linear  infinite  alternate backwards;(选取move关键帧，总时长2秒，正常速率，运动无数次，奇数次正向，偶数次反向，开始在初始帧的位置）
		
		@keyframes move{
			0%{
				width: 300px;
				height:300px;
				background: red;
			}
			50%{
				width: 500px;
				height: 500px;
				background: blue;
				
			}
			100%{
				width: 1000px;
				height: 1000px;
				background: yellow;
			}

最后先上一个小转盘动画：

<img src="http://outu8mec9.bkt.clouddn.com/css16.PNG">

		<style>
		.wrapper{
			position: relative;
		}
		.wrapper .turn-table{
			position: absolute;
			left:500px;
			top:300px;
			width:100px;
			height:100px;
			border-radius: 50%;
			border: 60px solid black;
			background:green;
			text-align: center;
			animation: run 5s linear infinite;
			animation-play-state:paused;
		}
		.wrapper .turn-table span{
			color:#fff;
			font-size: 16px;
			margin-top: 30px;
			display: inline-block;
		}
		.wrapper .pin{
			width:8px;
			height:200px;
			display: inline-block;
			background: #ddd;
			border-bottom-left-radius: 50%;
			border-bottom-right-radius: 50%;
			position: absolute;
			left: 619px;
			top:150px;
			transform-origin: top;
			transform: rotateZ(-45deg);//针起始位置
			transition: all 1s linear;
		}
		@keyframes run{
			0%{
				transform: rotateZ(0deg);
			}
			100%{
				transform: rotateZ(360deg);
			}
		}//转盘转动
		.wrapper .pin-turn{
			transform: rotateZ(0deg);
		}
		</style>
		<body>
		<div class="wrapper">
			<div class="turn-table">
				<span>海阔天空</span>
			</div>
			<div class="pin">

			</div>
			<button>play/paused</button>
		</div>
		<script>
			var obtn = document.getElementsByTagName('button')[0];
			var otable = document.getElementsByClassName('turn-table')[0];
			flag = false;
			var timer = null;
			var opin = document.getElementsByClassName('pin')[0];
			obtn.onclick = function(){
				clearInterval(timer);//解决多次click的时候，定时器产生的问题
				flag = !flag;
				if(flag){
					timer = setTimeout(function(){
						 otable.style.animationPlayState = 'running';
					},1000)//多次点击的时候，animation延时不生效
					opin.className = 'pin pin-turn';//通过改变className来改变样式
				}else{
					otable.style.animationPlayState = "paused";
					opin.className = 'pin';
				}

			}


那么关于animation的内容就像讲到这。我们明天再见嗷
