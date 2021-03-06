# Part1-2 作业

( 请在当前文件直接作答 )

## 简答题

### 1. 请说出下列最终执行结果，并解释为什么?

```javascript
var a = [];
for(var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i)
  }
}
a[6]()
```
答：结果为10，数组a在for循环添加了10个函数，此时i变为10，在执行a[6]时，函数内查找到的i此时为10



### 2. 请说出此案列最终执行结果，并解释为什么?

```javascript
var tmp = 123;
if (true) {
  console.log(tmp);
  let tmp;
}
```

答：会报错，tmp开始声明为全局变量，在局部作用域内又使用了let重新声明tmp，导致tmp优先取作用域内部，但是let需要先声明再使用，所以会报错

　

### 3. 结合ES6语法，用最简单的方式找出数组中的最小值

```javascript
var arr = [12, 34, 32, 89, 4]
```
答：Math.min(...arr)

　

### 4. 请详细说明var、let、const三种声明变量的方式之间的具体差别

var: 1.存在变量提升；2.可以重复定义；3.没有块级作用域，其声明的变量在其他作用域中可以访问到；
let: 1.不存在变量提升；2.前作用域内可以使用 3.同一个作用域内let不能重复声明变量
const 1.声明基础类型不能修改 2.声明引用类型 引用的地址不能被改变


　

### 5. 请说出下列代码最终输出结果，并解释为什么？

```javascript
var a = 10;
var obj = {
  a: 20,
  fn() {
    setTimeout(() => {
      console.log(this.a)
    })
  }
}
obj.fn()
```
答： 20，箭头函数不会改变this的指向，它会继承自己作用域上一层的this，也就是指向obj对象
　

　

### 6. 简述Symbol类型的用途
答: 1.为对象创建独一无二的key值或是创建一个常量；2.可以模拟对象的私有属性；
　

　

### 7. 说说什么是浅拷贝，什么是深拷贝？
答：浅拷贝，只复制对象的内存地址，当一个对象内部的值发生改变时，两者内部的值都会发生改变；
深拷贝，复制对象内部的所有值，内存空间两者是独立的，互不影响。
　

　

### 8. 请简述TypeScript与JavaScript之间的关系？
答: TypeScript是JavaScript的超集，多了一些扩展特性，类型系统和es6+的支持，最终会被编译为最原始的JavaScript 
　

　

### 9. 请谈谈你所认为的typescript优缺点
答：
优点：1.更早的在编码过程中暴露错误，减少不必要的类型判断
2.即便不懂新概念也可以用JavaScript来开发
3.最终会被编译为最原始的JavaScript，所在任何JavaScript的运行环境下都支持
缺点： 1.多了很多概念，需要二次学习 2.增加开发了开发成本
　

　

### 10. 描述引用计数的工作原理和优缺点
答：设置引用数，当前引用数为0的被立即回收；当引用关系改变时加或者减引用数。
优点：发现垃圾立即回收，最大程度减少系统暂停
缺点：无法回收循环引用的对象，时间开销较大

　

### 11. 描述标记整理算法的工作流程
答：是标记清除算法的增强，标记所有活动对象，清除阶段会整理对象的空间，使内存地址连续，减少碎片化
　
　

### 12.描述V8中新生代存储区垃圾回收的流程
答：新生代存储区，存放存活时间较短的对象，新生代存储区分为两部分from（使用空间）和to（空闲空间）
使用标记整理 + 复制算法，将活动对象存储于from空间，标记整理后 拷贝到to空间，两者完成空间交换，
拷贝过程中存在晋升（新生代会移至老生代）：一轮GC还存活新生代对象需要晋升，to空间使用率超过25%的需要晋升

　

### 13. 描述增量标记算法在何时使用及工作原理
答：主要用于V8老生代存储区垃圾回收。老生代对象数据多，增量标记在遍历对象标记时，
不必一次性把所有对象标记，而是先找到直接可达对象后，让程序执行一会，再找间接可达对象并标记，程序和标记算法交替执行，减少程序阻塞。

　