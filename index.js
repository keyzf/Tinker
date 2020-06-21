const logger = require("./lib/logger.js");
process.send = process.send || function (msg) { logger.log("debug", msg) };

process.on('uncaughtException', error => logger.log('error', error.stack));

logger.log("info", "setting up environment variables")
require("dotenv").config();

logger.log("info", "connecting to MongoDB")
require("./lib/db").setup();


// logger.log("info", "getting pm2 process")
// var pmx = require('@pm2/io');

logger.log("info", "setting up clean exit")
process.on('SIGINT', async () => {
    await bot.destroy()
    process.exit();
});
logger.log("info", "setting up clean exit finished")


// pmx.action('respawnshards', function(param, reply) {
    // await manager.respawnAll()
//   reply({answer: "Respanwed"})
// });

// pmx.init({
//     transactions: true, // will enable the transaction tracing
//     http: true // will enable metrics about the http server (optional)
// });

const { ShardingManager } = require('discord.js');
const manager = new ShardingManager('./bot.js', { token: process.env.BOT_TOKEN });

manager.spawn();
manager.on('shardCreate', shard => logger.log("info", ` - Launched shard ${shard.id}`));
