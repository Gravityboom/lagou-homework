const PENDING = 'pending'// 等待
const FULFILLED = 'fulfilled' // 成功
const REJECTED = 'rejected'// 失败

class MyPromise {
    constructor(exector) {
        try {
            exector(this.resolve, this.reject)
        } catch (e) {
            this.reject(e)
        }
    }

    // 实例对象的一个属性，初始为等待
    status = PENDING
    // 成功之后的值
    value = undefined
    // 失败之后的原因
    reason = undefined
    successCallback = []
    failCallback = []

    // resolve和reject为什么要用箭头函数？
    // 如果直接调用的话，普通函数this指向的是window或者undefined
    // 用箭头函数就可以让this指向当前实例对象
    resolve = value => {
        // 判断状态是不是等待，阻止程序向下执行
        if (this.status !== PENDING) return
        // 将状态改成成功
        this.status = FULFILLED
        // 保存成功之后的值
        this.value = value
        while (this.successCallback.length) this.successCallback.shift()()
    }

    reject = reason => {
        if (this.status !== PENDING) return
        // 将状态改为失败
        this.status = REJECTED
        // 保存失败之后的原因
        this.reason = reason
        while (this.failCallback.length) this.failCallback.shift()()
    }

    then(successCallback = value => value, failCallback = reason => { throw reason }) {
        let promise2 = new MyPromise((resolve, reject) => {
            //判断状态
            if (this.status === FULFILLED) {
                setTimeout(() => {//这里使用setTimeout是为了实现异步调用
                    try {
                        // 调用成功回调，并且把值返回
                        let x = successCallback(this.value)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else if (this.status === REJECTED) {
                setTimeout(() => {
                    try {
                        // 调用失败回调，并且把原因返回
                        let x = failCallback(this.reason)
                        resolvePromise(promise2, x, resolve, reject)
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            } else {
                this.successCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = successCallback(this.value)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
                this.failCallback.push(() => {
                    setTimeout(() => {
                        try {
                            let x = failCallback(this.reason)
                            resolvePromise(promise2, x, resolve, reject)
                        } catch (e) {
                            reject(e)
                        }
                    }, 0)
                })
            }
        });
        return promise2
    }

    finally(callback) {
        // 如何拿到当前的promise的状态，使用then方法，而且不管怎样都返回callback
        // 而且then方法就是返回一个promise对象，那么我们直接返回then方法调用之后的结果即可
        // 我们需要在回调之后拿到成功的回调，所以需要把value也return
        // 失败的回调也抛出原因
        // 如果callback是一个异步的promise对象，我们还需要等待其执行完毕，所以需要用到静态方法resolve
        return this.then(value => {
            // 把callback调用之后返回的promise传递过去，并且执行promise，且在成功之后返回value
            return MyPromise.resolve(callback()).then(() => value)
        }, reason => {
            // 失败之后调用的then方法，然后把失败的原因返回出去。
            return MyPromise.resolve(callback()).then(() => { throw reason })
        })
    }

    catch(failCallback) {
        return this.then(undefined, failCallback)
    }

    static all(array) {
        let result = []
        let index = 0
        return new Promise((resolve, reject) => {
            let addData = (key, value) => {
                result[key] = value
                index++
                if (index === array.length) {
                    resolve(result)
                }
            }
            for (let i = 0; i < array.lengt; i++) {
                let current = array[i]
                if (current instanceof MyPromise) {
                    current.then(value => addData(i, value), reason => reject(reason))
                } else {
                    addData(i, array[i])
                }
            }
        })
    }

    static resolve(value) {
        if (value instanceof MyPromise) return value
        return new MyPromise(resolve => resolve(value))
    }
}

function resolvePromise(promise2, x, resolve, reject) {

    if (promise2 === x) {
        return reject(new TypeError('Chaining cycle detected for promise #<Promise>'))
    }
    // 判断x是不是其实例对象
    if (x instanceof MyPromise) {
        // x.then(value => resolve(value), reason => reject(reason))
        x.then(resolve, reject)
    } else {
        // 普通值
        resolve(x)
    }
}

module.exports = MyPromise