/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/

class MyPromise {
    constructor(executor) {
        executor(this._resolve, this._reject)
    }

    callbacks = []
    state = 'pending' // 状态
    value = null

    static resolve(value) {
        if (value instanceof MyPromise) return value // 是promise对象时，直接返回该对象
        return new MyPromise(resolve => resolve(value))
    }

    static reject() {
        if (value instanceof MyPromise) {
            return new Promise((resolve, reject) => {
                value.then(reject)
            })
        }
        return new Promise((resolve, reject) => reject(value))
    }

    static all(promisesArr) {
        return new MyPromise((resolve, reject) => {
            let count = 0
            const arrLength = promisesArr.length
            const results = []
            promisesArr.forEach((promise, index) => {
                MyPromise.resolve(promise).then(res => {
                    count ++
                    results[index] = res
                    if (count === arrLength) {
                        resolve(results)
                    }
                }, reason => reject(reason))
            })
        })
    }

    then(successCallback, failCallback) {
        return new MyPromise((resolve, reject) => {
            this._handle({
                successCallback,
                failCallback,
                resolve,
                reject,
            })
        })
    }

    _handle = (callbackObj) => {
        if (this.state === 'pending') { // pending状态，加入队列
            this.callbacks.push(callbackObj)
        }

        let callbackFn = this.state === 'fullfilled' ? callbackObj.successCallback : callbackObj.failCallback

        const ret = callbackFn(this.value)
        callbackFn = this.state === 'fullfilled' ? callbackObj.resolve : callbackObj.reject
        callbackFn(ret)
    }

    _resolve = (value) => {
        if (value && (typeof value === 'function' || typeof value === 'object')) { // 判断是否promise对象
            const then = value.then // 调用传入promise的then方法
            then.call(value, this._resolve.bind(this), this._reject.bind(this))
            return
        }
        this.state = 'fullfilled' // 改变状态
        this.value = value
        this.callbacks.forEach(callback => this._handle(callback))
    }

    _reject = (reason) => {
        this.state = 'rejected'
        this.value = reason
        this.callbacks.forEach(callback => this._handle(callback))
    }

    catch(errorFn) {
        return this.then(null, errorFn)
    }

    finally(callbackFn) {
        if (typeof callbackFn !== 'function') return this.then() // 确保finally后 可以继续链式调用promise方法
        const _promise = this
        return this.then(
            value => _promise.resolve(callbackFn()).then(() => value),
            reason => _promise.resolve(callbackFn()).then(() => { throw reason })
        )
    }
}

