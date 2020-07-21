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
