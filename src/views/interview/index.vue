<template>
  <div class="interview">
    <h1>性能优化（重绘和回流）</h1>
    <h3>浏览器渲染机制</h3>
    <li>浏览器采用流式布局模型（Flow Based Layout）</li>
    <li>浏览器会把HTML解析成DOM，把CSS解析成CSSOM，DOM和CSSOM合并就产生了渲染树（Render Tree）。</li>
    <li>有了RenderTree，我们就知道了所有节点的样式，然后计算他们在页面上的大小和位置，最后把节点绘制到页面上。</li>
    <li>由于浏览器使用流式布局，对Render
      Tree的计算通常只需要遍历一次就可以完成，但table及其内部元素除外，他们可能需要多次计算，通常要花3倍于同等元素的时间，这也是为什么要避免使用table布局的原因之一。</li>
    <h3>回流</h3>
    <p>
      当renderTree中的一部分(或全部)因为元素的规模尺寸，布局，隐藏等改变而需要重新构建。这就称为回流(reflow)。每个页面至少需要一次回流，就是在页面第一次加载的时候，这时候是一定会发生回流的，因为要构建render
      tree。 在回流的时候，浏览器会使渲染树中受到影响的部分失效，并重新构造这部分渲染树，完成回流后，浏览器会重新绘制受影响的部分到屏幕中，该过程成为重绘。
    </p>
    <h3>重绘</h3>
    <p>当renderTree中的一些元素需要更新属性，而这些属性只是影响元素的外观，风格，而不会影响布局的，比如background-color。则就叫称为重绘</p>
    <h3>区别</h3>
    回流必将引起重绘，而重绘不一定会引起回流。比如：只有颜色改变的时候就只会发生重绘而不会引起回流
    当页面布局和几何属性改变时就需要回流
    比如：添加或者删除可见的DOM元素，元素位置改变，元素尺寸改变——边距、填充、边框、宽度和高度，内容改变
    <h3>优化（减少重绘和回流）</h3>
    <h4>css</h4>
    <p>
      尽量使用transform而不是几何属性来做元素的变换
      visibility 替换 display: none
      避免使用table布局，可能很小的一个小改动会造成整个 table 的重新布局。
      尽可能在DOM树的最末端改变class，这样回流的范围最小，
      HTML 来说也尽量少的添加无意义标签，保证层级扁平这样可以使css选择器的层数不至于过多
    </p>
    <h4>js</h4>
    <li>避免频繁操作样式：最好一次性重写style对象，而不是一个属性一个属性更改。或者将样式列表定义为class并一次性更改class属性。</li>
    <li>避免频繁操作DOM，创建一个documentFragment，在它上面应用所有DOM操作，最后再把它添加到文档中。</li>
    <li>对具有复杂动画的元素使用绝对定位，使它脱离文档流，否则会引起父元素及后续元素频繁回流。</li>
    <h1>node 有三大特性：单线程、非阻塞I/O、事件驱动</h1>
    <p>
      传统的服务器语言大多是多线程、阻塞式 I/O。对于传统的服务器语言，在与用户建立连接时，每一个连接都是一个线程。 当有十万个用户连接时，服务器上就会有十万个线程。而阻塞式 I/O
      是指，当一个线程在执行 I/O 操作时，这个线程会阻塞，等待 I/O 操作完成后继续执行。传统服务器的优点是各个线程之间互不影响，如果其中某个线程崩了并不会影响其他线程。
      node采用的是单线程、非阻塞式I/O。当node执行文件操作或者处理客户端发起的请求时，线程会继续向下执行，直到文件操作结束或者处理的函数处理完了再继续加入线程中，
      node的优势是性能好，在cpu一样的情况下能处理更多的请求，缺点是一旦线程中某个请求崩溃了，整个服务器就崩溃了。
    </p>
  </div>
</template>

<script>

export default {
  created() {
    // this.toStringFun()
    this.instanceOfFun()
  },
  methods: {
    /* 测试toString方法 Object.prototype.toString.call() 常用于判断浏览器内置对象。*/
    toStringFun() {
      console.log(['a'].toString());
      //call前面是一个函数，call（）中是函数的作用域，即call执行时this指向（）中的内容
      console.log(Object.prototype.toString.call(['a']));
      //数组本身的toString方法会输出数组内的内容，但是对象本身的toString方法会输出[object + 类型]
      let num = 100
      let null1 = null
      let undefined1 = undefined
      console.log(num.toString());
      console.log(Object.prototype.toString.call(num));
      //null 和 undefined本身是没有toString方法的，会报错。
      //但是用Object的toString方法还是可以判断出类型
      console.log(Object.prototype.toString.call(null1));
      console.log(Object.prototype.toString.call(undefined1));
    },
    //instanceOf方法
    instanceOfFun() {
      /* 使用 instanceof判断一个对象是否为数组，
      instanceof 会判断这个对象的原型链上是否会找到对应的 Array 的原型，找到返回 true，否则返回 false。 */
      console.log([] instanceof Array);
      console.log([] instanceof Object);
      //null和undefined是单独的类型，并不是对象
      console.log(null instanceof Object);
      //instanceOf只能判断引用类型，不能用来判断基本类型。不会报错，但是判断是错误的
      console.log(1 instanceof Number);
      console.log('1' instanceof String);
      //若要判断数组，isArray优先，toString次之，最后用instanceOf
    }
  }
}
</script>

<style>
</style>
