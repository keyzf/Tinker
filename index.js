async function start() {
    const logger = require("./lib/logger.js");
    process.send = process.send || function (msg) { logger.log("debug", msg) };

    logger.log("info", "setting up environment variables")
    require("dotenv").config();

    // Get discord.js
    const Discord = require('discord.js');

    logger.log("info", "creating new client")
    const bot = new Discord.Client({
        disableEveryone: true
    });

    logger.log("info", "connecting to MongoDB")
    await require("./lib/db").setup();

    logger.log("info", "creating bot variables")
    logger.log("info", "1: commands")
    bot.commands = new Discord.Collection();
    logger.log("info", "2: aliases")
    bot.aliases = new Discord.Collection();
    logger.log("info", "3: cooldowns")
    bot.cooldowns = new Discord.Collection();
    logger.log("info", "4: afk")
    bot.afk = new Map();
    logger.log("info", "5: recentMessages")
    bot.recentMessages = [];

    logger.log("info", "setting up bot")
    await require("./lib/botSetup").setup(bot);

    module.exports.bot = bot;

    logger.log("info", "setting up dashboard hhtp server")
    await require("./dashboard/server").setup(bot);
    logger.log("info", "starting dashboard http server")
    await require("./dashboard/server").start();


    logger.log("info", "logging in bot")
    await bot.login(process.env.BOT_TOKEN);

    // setup error case logging for client
    logger.log("info", "setting up error cases for the bot")
    bot.on('debug', m => logger.log('debug', m));
    bot.on('warn', m => logger.log('warn', m));
    bot.on('error', m => logger.log('error', m));

    process.on('uncaughtException', error => logger.log('error', error.stack));

    logger.log("info", "getting pm2 process")
    var pmx = require('@pm2/io');

    logger.log("info", "setting up clean exit")
    process.on('SIGINT', async () => {
        await bot.destroy()
        process.exit();
    });
    logger.log("info", "setting up clean exit finished")


    // pmx.action('hello', function(param, reply) {
    //   reply({answer: "world " + param})
    // });

    pmx.init({
        transactions: true, // will enable the transaction tracing
        http: true // will enable metrics about the http server (optional)
    });
}
start();