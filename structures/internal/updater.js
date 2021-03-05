const cron = require("node-cron")

module.exports.setup = (client) => {
    let count = 0;
    return cron.schedule('*/60 * * * * *', () => {
        count++;
        if (client.operations.update) { client.operations.update.run(count); }
    }, {
        scheduled: false
    });
}