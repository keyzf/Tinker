'use strict';

module.exports = (interval, count, cb) => {
    return new Promise(async (resolve, reject) => {
        for (let num = count; num > 0; num--) {
            await timeout(interval);
            cb(num);
        }
        resolve();
    });
}
function timeout(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}