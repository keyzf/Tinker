async function start() {
    let hrstart = process.hrtime();

    // Get discord.js
    const Discord = require('discord.js');

    await require("./lib/prototypeModification").setup();

    const intents = new Discord.Intents([
        Discord.Intents.PRIVILEGED,
        Discord.Intents.NON_PRIVILEGED
    ])
    const shard = new Discord.Client({
        autoReconnect: true,
        retryLimit: Infinity,
        presence: {
            status: "idle",
        },
        fetchAllMembers: false, // should be turned off when in multiple guilds (it automatically caches all members from all guilds in startup)
        ws: intents
    });

    require("./lib/logger.js").setup(shard);
    const logger = require("./lib/logger.js");

    logger.debug("setting up shard");
    await require("./lib/shardSetup").setup(shard);

    require("./lib/updateLoop").start(shard);

    logger.debug(`logging in shard with token`);
    try {
        await shard.login(process.env.BOT_TOKEN);
        logger.debug(`Live token found under BOT_TOKEN, logging in`);
    } catch {
        try {
            await shard.login(process.env.BOT_TOKEN_PRE);
            logger.debug(`Pre-Release token found under BOT_TOKEN_PRE, logging in`);
        } catch {
            logger.error("No token could be used");
            process.exit();
        }
    }

    // setup error case logging for client
    logger.debug("setting up error cases for the shard");
    shard.on('debug', m => logger.debug(m));
    shard.on('warn', m => logger.warn(m));
    shard.on('error', m => logger.error(m));

    process.on("exit", await shard.shardFunctions.get("cleanExit").run);
    process.on("SIGINT", await shard.shardFunctions.get("cleanExit").run);

    let hrend = process.hrtime(hrstart);
    logger.info(`Startup took ${hrend[0]}s ${hrend[1] / 1000000}ms to complete`);

}
start();


// TODO OAuth2 https://youtu.be/r_tXkzBgmFc?list=PL_cUvD4qzbkwRMmqlviY0FXL54dEYRNbz