 iObject.lineWidth = 50;
        iObject.strokeStyle = 'red';
        iObject.moveTo(100,100);
        iObject.lineTo(200,100);
        iObject.lineTo(200,200);
        iObject.lineTo(100,100);
        iObject.closePath();
        iObject.strokeStyle = "green";
        iObject.moveTo(300,100);
	iObject.lineTo(400,100);
	iObject.lineTo(400,200);
	iObject.closePath();
	 //第二个三角形为绿色 
     iObject.stroke();
        iObject.closePath();

        为什么把style颜色的设置放前面就没有了？

不是跟颜色的代码有关，是因为应该先闭合后描边

        
2	var canvas = document.getElementById('canvas');
	var cid = canvas.getContext('2d');
	var w = canvas.width,
		h = canvas.height，
		y = 50;
	function move(y){
		cid.clearRect(0,0,w,h)
		cid.fillRect(50,y,50,50);//注意如果这里是先rect然后fill，出现的是一连串的矩形，而不是单个矩形。因为他每一次都是一个旧的路径，即使每次clear了画布，路径上仍然存在轨迹，那么每次fill的时候，都是会把之前的都fill一次，所以会显示柱形，解决办法就是每次都手动地开辟一个新路径即可。
	}
	var timer = setInterval(function (){
		cid.clearRect(0,0,500,500);
		move(y);
		y += 20;
		if(y > 480){
			move(450);
		}
	},100)


move是什么意思？
cid.clearRect()怎么理解


cid.arcTo(250,250,350,350,100);
cid.closePath();
    cid.stroke();
    

是使用方法有问题吗，为什么画不出来圆角


画出一个圆角矩形ctx.beginPath();
	ctx.moveTo(150,50);
	ctx.arcTo(200,50,200,150,30);
	ctx.arcTo(200,150,100,50,30);
	ctx.arcTo(100,150,100,50,30);
	ctx.arcTo(100,50,200,50,30);
	ctx.closePath();
	ctx.stroke();


	.translate(dx, dy)   重新映射画布上的 (0,0) 位置,往x轴方向或者y方向平移。

	ctx.translate(200,200)//坐标系的零点就变成原来的200，200点

这个映射意思是画完后的平移还是画前把画点改了


如果canvas不报错，有什么比较好的途径去找错呢



2.lineJoin 线段尖角，对于上面的一种情况就是， 两条线结合的时候，如果角度很小，那么他们将会形成一个角度，当角度很小，尖叫就会伸到很长例如下图：

<img src="http://outu8mec9.bkt.clouddn.com/blogsPNG.PNG">

这个时候，浏览器可以使用lineJoin来尖角转化为圆角。

	ctx.lineJoin = "round";//还有bevel截断） miter尖角）属性值
	
<img src="http://outu8mec9.bkt.clouddn.com/bloog.png">

我们还可以对控制尖角长度控制（lineJoin为miter）用于控制斜街部分的长度。如果斜接部分长度超过miterLimit的值，就会变成bevel.
	
	ctx.miterLimit = 20;//实际运算是大于limit*lineWidth/2的值，了解就好


	### 合成

1.   ctx.globalCompositeOperation = 'source-over' ;新像素和原像素的合并方式 （层级类似）,以下是它的层叠方式：默认是source-over（根据画的顺序来显示层叠关系）；

<img src="http://outu8mec9.bkt.clouddn.com/%E5%9B%BE%E7%89%871.png">

	ctx.globalCompositeOperation = 'source-over' ;//先画的在下面
	ctx.globalCompositeOperation = 'destination-over' ;//先的在上面
	ctx.globalCompositeOperation = 'destination-out' ;//显示出第一画的减去重合的部分，做刮刮乐，利用获得鼠标的位置，然后动态的改变第二个图形的圆心位置，每移动一下，显示一个新的画面。
怎么用啊


### SVG渐变

svg中有个defs标签，用预定义留待将来使用的内容，其中又有use元素用于连接到defs元素定义的内容。借助这两个元素，可以重复用同一个元素，减少代码冗余。例如：
	
	<svg width='200' height='200'>	
		<defs>
			<g id="shapeGroup">
				<rect x="0" y="0" width="500" height="500"style="fill:url(#bg1)"/>
				<circle cx="200" cy="80" r="40" stroke="aaa" fill="none" stroke-width="8"/>
			</g>
		</defs>
		<use xlink:href="#shakeGroup" transform="translate(60,0) scale(0.5)"/>
		<use xlink:href="#shakeGroup" transform="translate(160,80) scale(0.5)"/>
		<use xlink:href="#shakeGroup" transform="translate(20,60) scale(0.25)"/>
	</svg>

这样就相当高于复制三次，但是定义组不可见，所以页面展示为三个图形。


2.preserveAspectRatio

	xMin xMid xMax -> x轴 左中右对齐
	yMin yMid yMax -> y轴 左中右对齐
	meet/slice/none -> 设置填充方式，按比例撑开/截断
	
可以通过，svg.setAttribute("preserveAspectRatio", "xMinYMin meet");来设定属性。
