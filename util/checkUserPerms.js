const { devs } = require("../config/devs")

module.exports.isDev = (id) => {
    return devs.includes(id)
}

module.exports.sendMessages = (member) => {
    
}