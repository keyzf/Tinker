const find_nested = require("./utility/fs/findNested");

module.exports.setup = (client) => {
    const util_files = find_nested("./structures/utility", ".js");
   
    const obj = util_files.reduce((o, key) => ({...o, [key.split('\\').pop().split('/').pop().replace(".js", "")]: (require(key).setup ? require(key).setup() : require(key)) }), {});
    return obj;
}