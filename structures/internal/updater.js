const cron = require("node-cron")

module.exports.setup = (client) => {

    return cron.schedule('*/60 * * * * *', () => {
        if(client.operations.update){ client.operations.update.run(); }
    }, {
        scheduled: false
    });
}