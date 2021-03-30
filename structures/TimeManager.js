const UpdateTimer = require("./UpdateTimer");

class TimeManager {
    constructor(client) {
        this.client = client;
        this.timers = new Map();
    }

    update() {
        this.timers.forEach((t) => {
            t.update();
        });
    }

    createTimer(time) {
        const uid = this.client.utility.createUUID("timr-*x*x*x-*x*x*x");
        this.timers.set(uid, new UpdateTimer(time, uid));
        return this.timers.get(uid);
    }

    getTimer(uid) {
        return this.timers.get(uid);
    }

    deleteTimer(uid) {
        const t = this.timers.get(uid);
        if(t) {
            t.cancel();
            this.timers.delete(uid);
        }
    }
}

module.exports = TimeManager;