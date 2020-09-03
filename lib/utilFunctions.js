const fs = require("fs");
const path = require("path");


module.exports.create_UUID = () => {
    var dt = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (dt + Math.random() * 16) % 16 | 0;
        dt = Math.floor(dt / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
}

module.exports.arrayComparer = function comparer(otherArray) {
    return function(current) {
        return otherArray.filter(function(other) {
            return other.id == current.id
        }).length == 0;
    }
}

module.exports.find_nested = (dir, pattern) => {
    let results = [];
    fs.readdirSync(dir).forEach(inner_dir => {
        inner_dir = path.resolve(dir, inner_dir);
        const stat = fs.statSync(inner_dir);
        if (stat.isDirectory()) {
            results = results.concat(this.find_nested(inner_dir, pattern));
        }
        if (stat.isFile() && inner_dir.endsWith(pattern)) {
            results.push(inner_dir);
        }
    });

    return results;
}

/**
 * 
 * @param {array} arr - the array to compute on
 * @param {string} seperator - like ", "
 * @param {number} start - index in array to start at like 2
 * @param {number} end - index in array to stop at like 5
 */
module.exports.arrEndJoin = function(arr, seperator, start, end) {
    if (!start) start = 0;
    if (!end) end = arr.length - 1;
    end++;
    return arr.slice(start, end).join(seperator);
};