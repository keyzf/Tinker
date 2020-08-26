const fs = require("fs");
const logger = require("./logger.js");
const { find_nested } = require("./utilFunctions");
// const { eventManager } = require("./eventManager")
const eventManager = require("./eventManager")
const Discord = require("discord.js");
const { Fields, db } = require("./db.js");

const cmd_files = find_nested("./commands/", ".js");
// console.log(cmd_files)

module.exports.setup = async(bot) => {

    bot.event = eventManager;

    logger.debug("creating bot variables")
    logger.debug("1: commands")
    bot.commands = new Discord.Collection();
    logger.debug("2: aliases")
    bot.aliases = new Discord.Collection();
    logger.debug("3: cooldowns")
    bot.cooldowns = new Discord.Collection();
    logger.debug("4: afk")
    bot.afk = new Map();
    logger.debug("5: recentMessages")
    bot.recentMessages = [];

    fs.readdir("./events/", (err, files) => {
        if (err) logger.log("error", err);
        let jsfiles = files.filter(f => f.split(".").pop() === "js");
        if (jsfiles.length <= 0) return logger.log("warn", "There are no events to load...");
        logger.debug(`Loading ${jsfiles.length} events...`);
        jsfiles.forEach((f, i) => {
            require(`../events/${f}`);
            logger.debug(`${i + 1}: ${f} loaded!`);
        });
        logger.info(`Loaded ${jsfiles.length} events`);
    });

    if (cmd_files.length <= 0) return logger.log("warn", "There are no commands to load...");
    logger.debug(`Loading ${cmd_files.length} commands...`)
    cmd_files.forEach((file, i) => {
        const props = require(file);
        bot.commands.set(props.help.name, props);
        props.help.aliases.forEach((alias) => {
            bot.aliases.set(alias, props.help.name);
        });
        logger.debug(`${i + 1}: ${props.help.name} loaded!`);
    });
    logger.info(`Loaded ${cmd_files.length} commands`);

    


};