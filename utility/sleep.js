'use strict';

module.exports = (time) => {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, time)
    });
}