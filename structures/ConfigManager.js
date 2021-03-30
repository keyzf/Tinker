const find_nested = require("./utility/fs/findNested");

module.exports.setup = (client) => {
    const configFiles = find_nested("./config", ".json");
    const obj = configFiles.reduce((o, key) => ({...o, [key.split('\\').pop().split('/').pop().replace(".json", "")]: require(key).setup ? require(key).setup() : require(key) }), {});
    return obj;
}