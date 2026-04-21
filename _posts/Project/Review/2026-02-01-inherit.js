/*
 * @Author: chenweita 1320673491@qq.com
 * @Date: 2026-02-01 00:26:59
 * @LastEditors: chenweita 1320673491@qq.com
 * @LastEditTime: 2026-02-01 19:49:34
 * @FilePath: /chenweita.GitHub.io/_posts/Project/Review/2026-02-01-inherit.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

// call
function myCall (obj, ...args) {
    if (obj === undefined || obj === null) {
        obj = window
    }
    let symbolFn = Symbol();
    obj[symbolFn] = this;
    let fn = obj[symbolFn](...args)
    delete obj[symbolFn]
    return fn
}

// apply
function myApply (obj, args = []) {
    if (obj === undefined || obj === null) {
        obj = window
    }
    let fnSymbol = Symbol();
    obj[fnSymbol] = this;
    let fn = obj[fnSymbol](...args)
    delete obj[fnSymbol]
    return fn;
}

// bind
Function.prototype.myBind = function(context) {
    // 判断是否是undefined 和 null
    if (typeof context === "undefined" || context === null) {
        context = window;
    }
    self = this;
    return function(...args) {
        return self.apply(context, args)
    }
}
    
// new
function objectFactory () {
    let obj = new Object();
    let Constructor = [].shift.call(arguments);
    obj.__proto__ = Constructor.prototype;
    var ret = Constructor.call(obj, ...arguments)
    return typeof ret === 'object' ? ret : obj
}



// 工厂模式
function Person(name) {
    var o = new Object();
    o.name = name;
    o.getName = function () {
        console.log(this.name)
    }
    return o
}
var person = new Person('huahua')

// 构建函数模式
function Person(name) {
    this.name = name;
    this.getName = function() {
        console.log(this.name)
    }
}
var person = new Person('huahua')

// 原型模式
function Person() {

}
Person.prototype.name = 'huahua'
Person.prototype.getName = function() {
    console.log(this.name)
}
var person = new Person('huahua')

// 组合模式
function Person (name) {
    this.name = name
}
Person.prototype = {
    constructor: Person,
    getName: function() {
        console.log(this.name)
    }
}
var person1 = new Person();

// 组合模式动态
function Person (name) {
    this.name = name;
    if (typeof this.getName !== 'function') {
        Person.prototype.getName = function() {
            console.log(this.name)
        }
    }
}
var person1 = new Person();

// 继承的多种形式
// 原型链继承
function Parent (name) {
    this.name = 'huahua'
}
Parent.prototype.getName = function () {
    console.log(this.name)
}
function Child (name) {
}
Child.prototype = new Parent
let child1 = new Child();


// 构造函数继承
function Parent (name) {
    this.name = name
}
function Child (name) {
    Parent.call(this, name)
}
let child2 = new Child('huahua');

// 组合继承
function Parent (name) {
    this.name = name
}
Parent.prototype.getName = function () {
    console.log(this.name)
}
function Child (name, age) {
    Parent.call(this, name)
    this.age = age
}
Child.prototype = new Parent
Child.prototype.constructor = Child
var child3 = new Child('kevin', '18');

// 原型继承
function Parent(o) {
    function F() {}
    F.prototype = o;
    return new F()
}

// 寄生式继承 某种形势增强
function createObj(o) {
    let obj = Object.create(o);
    o.getName = function () {
        console.log('hi');
    }
    return obj
}
