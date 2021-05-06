'use strict';

const fs = require("fs");
const path = require("path")

module.exports = (dir, pattern) => {
    let results = [];
    fs.readdirSync(dir).forEach(inner_dir => {
        inner_dir = path.resolve(dir, inner_dir);
        const stat = fs.statSync(inner_dir);
        if (stat.isFile() && inner_dir.endsWith(pattern)) {
            results.push(inner_dir);
        }
    });

    return results;
}