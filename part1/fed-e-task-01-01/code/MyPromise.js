/*
尽可能还原 Promise 中的每一个 API, 并通过注释的方式描述思路和原理.
*/

class MyPromise {
    callbacks = []
    state = 'pending' // 状态
    value = null

    constructor(fn) {
        fn(this._resolve.bind(this), this._reject.bind(this))
    }

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

    then(fullfilledFn, rejectedFn) {
        return new MyPromise((resolve, reject) => {
            this._handle({
                fullfilledFn,
                rejectedFn,
                resolve,
                reject,
            })
        })
    }

    _handle(callback) {
        if (this.state === 'pending') { // pending状态，加入队列
            this.callbacks.push(callback)
        }

        let cb = this.state === 'fullfilled' ? callback.fullfilledFn : callback.rejectedFn

        const ret = cb(this.value)
        cb = this.state === 'fullfilled' ? callback.resolve : callback.reject
        cb(ret)
    }

    _resolve(value) {
        if (value && (typeof value === 'function' || typeof value === 'object')) { // 判断是否promise对象
            const then = value.then // 调用传入promise的then方法
            then.call(value, this._resolve.bind(this), this._reject.bind(this))
            return
        }
        this.state = 'fullfilled' // 改变状态
        this.value = value
        this.callbacks.forEach(callback => this._handle(callback))
    }

    _reject(error) {
        this.state = 'rejected'
        this.value = error
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

