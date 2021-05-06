'use strict';

class Enum {
    constructor(obj) {
        for (const key in obj) {
            this[key] = obj[key]
        }
        return Object.freeze(this)
    }
    has = (key) => {
        return this.hasOwnProperty(key)
    }
}