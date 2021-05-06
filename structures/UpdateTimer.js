'use strict';

const EventEmitter = require('events').EventEmitter

class UpdateTimer extends EventEmitter {

    constructor(time, uid) {
        super();
        this.uid = uid;
        this.waitTime = time;
        this.createdAt = Date.now();
        this.timeout = setTimeout(() => { this.emit("fire") }, this.waitTime);
    }

    cancel() {
        const timeSinceConstruction = Date.now() - this.createdAt;
        clearTimeout(this.timeout);
        this.emit("cancel", timeSinceConstruction);
    }

}

module.exports = UpdateTimer;