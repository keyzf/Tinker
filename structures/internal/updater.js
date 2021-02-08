const cron = require("node-cron")

module.exports.setup = (client) => {

    return cron.schedule('*/60 * * * * *', () => {
        if(client.operations.get("update")){ client.operations.get("update")(); }
    }, {
        scheduled: false
    });
}