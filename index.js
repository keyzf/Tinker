const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

async function start() {
    let hrstart = process.hrtime();
    // clear();

    console.log(
        chalk.magenta(
            figlet.textSync("Tinker", { horizontalLayout: 'full' })
        )
    );

    require("dotenv").config();

    const logger = require("./lib/logger.js");
    process.send = process.send || function(msg) { logger.log("debug", msg) };

    logger.info("Starting");

    process.on('uncaughtException', error => logger.log('error', error.stack));

    logger.debug("connecting to SQLite database");
    await require("./lib/db").setup();

    // Get discord.js
    const Discord = require('discord.js');

    logger.debug("creating new client");
    const bot = new Discord.Client({
        autoReconnect: true,
        retryLimit: Infinity,
        presence: {
            status: "idle",
        },
        fetchAllMembers: false, // should be turned off when in multiple guilds (it automatically caches all members from all guilds in startup)
        intents: Discord.Intents.NON_PRIVILEGED
    });
    module.exports.bot = bot;
    /* ws: {
        intents: [
            "GUILDS",
            "GUILD_MEMBERS",
            "GUILD_BANS",
            "GUILD_EMOJIS",
            "GUILD_INTEGRATIONS",
            "GUILD_WEBHOOKS",
            "GUILD_INVITES",
            "GUILD_VOICE_STATES",
            "GUILD_PRESENCES",
            "GUILD_MESSAGES",
            "GUILD_MESSAGE_REACTIONS",
            "GUILD_MESSAGE_TYPING",
            "DIRECT_MESSAGES",
            "DIRECT_MESSAGE_REACTIONS",
            "DIRECT_MESSAGE_TYPING"
        ]
    },
    */ // for verified bots only (apparently), sets api requests for these only to reduce strain on the bot

    logger.debug("setting up bot");
    await require("./lib/botSetup").setup(bot);

    // logger.debug("setting up dashboard http server")
    // await require("./dashboard/server").setup(bot);
    // logger.debug("starting dashboard http server")
    // await require("./dashboard/server").start();

    logger.debug(`logging in bot with token`);
    await bot.login(process.env.BOT_TOKEN_PRE);

    // setup error case logging for client
    logger.debug("setting up error cases for the bot");
    bot.on('debug', m => logger.debug(m));
    bot.on('warn', m => logger.warn(m));
    bot.on('error', m => logger.error(m));

    logger.debug("setting up clean exit");
    require("./lib/cleanExit").setup();

    logger.debug("setting up child process manager");
    require("./lib/child").setup();
    
    // setup the cli, old removed
    // require("./lib/cli").setup();

    require("./lib/updateLoop").start();

    let hrend = process.hrtime(hrstart);
    logger.info(`Startup took ${hrend[0]}s ${hrend[1] / 1000000}ms to complete`);

}
start();


// TODO OAuth2 https://youtu.be/r_tXkzBgmFc?list=PL_cUvD4qzbkwRMmqlviY0FXL54dEYRNbz