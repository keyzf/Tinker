async function start() {
    let hrstart = process.hrtime();

    const chalk = require('chalk');
    const clear = require('clear');
    const figlet = require('figlet');
    // clear();

    console.log(
        chalk.magenta(
            figlet.textSync("Tinker", { horizontalLayout: 'full' })
        )
    );

    require("dotenv").config();

    require("./lib/logger.js").setup();
    const logger = require("./lib/logger.js");

    logger.info("Starting");

    await require("./lib/prototypeModification").setup()

    require("./lib/pm2Metrics").setup();

    logger.debug("connecting to SQLite database");
    await require("./lib/db").setup();

    // Get discord.js
    const Discord = require('discord.js');

    logger.debug("creating new client");
    const intents = new Discord.Intents([
        Discord.Intents.PRIVILEGED,
        Discord.Intents.NON_PRIVILEGED
    ])
    const bot = new Discord.Client({
        autoReconnect: true,
        retryLimit: Infinity,
        presence: {
            status: "idle",
        },
        fetchAllMembers: false, // should be turned off when in multiple guilds (it automatically caches all members from all guilds in startup)
        ws: intents
    });
    module.exports.bot = bot;

    logger.debug("setting up bot");
    await require("./lib/botSetup").setup(bot);

    // logger.debug("setting up dashboard http server")
    // await require("./dashboard/server").setup(bot);
    // logger.debug("starting dashboard http server")
    // await require("./dashboard/server").start();

    logger.debug(`logging in bot with token`);
    try {
        await bot.login(process.env.BOT_TOKEN);
        logger.debug(`Live token found under BOT_TOKEN, logging in`);
    } catch {
        try {
            await bot.login(process.env.BOT_TOKEN_PRE);
            logger.debug(`Pre-Release token found under BOT_TOKEN_PRE, logging in`);
        } catch {
            logger.error("No token could be used")
            process.exit()
        }
    }

    // setup error case logging for client
    logger.debug("setting up error cases for the bot");
    bot.on('debug', m => logger.debug(m));
    bot.on('warn', m => logger.warn(m));
    bot.on('error', m => logger.error(m));

    logger.debug("setting up clean exit");
    require("./lib/cleanExit").setup();

    logger.debug("setting up child process manager");
    require("./lib/child").setup();

    require("./lib/updateLoop").start();

    let hrend = process.hrtime(hrstart);
    logger.info(`Startup took ${hrend[0]}s ${hrend[1] / 1000000}ms to complete`);

}
start();


// TODO OAuth2 https://youtu.be/r_tXkzBgmFc?list=PL_cUvD4qzbkwRMmqlviY0FXL54dEYRNbz