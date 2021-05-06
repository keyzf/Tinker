'use strict';

const find_nested = require("./fs/findNested");

module.exports.setup = (dir, pattern) => {
    const files = find_nested(dir, pattern);
    const obj = files.reduce((o, key) => ({...o, [key.split('\\').pop().split('/').pop().replace(pattern, "")]: require(key).setup ? require(key).setup() : require(key) }), {});
    return obj;
}