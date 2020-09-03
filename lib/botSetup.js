const path = require("path")
const fs = require("fs");
const logger = require("./logger.js");
const { find_nested } = require("./utilFunctions");
const Discord = require("discord.js");
const { Fields, db } = require("./db.js");

module.exports.setup = async(bot) => {

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
    logger.debug("6: cevents")
    bot.cevents = new Discord.Collection();

    const event_files = find_nested("./events/", ".js")
    if (event_files.length <= 0) return logger.log("warn", "There are no events to load...");
    logger.debug(`Loading ${event_files.length} events...`);
    event_files.forEach((file, i) => {
        this.addEvent(bot, file)
    });

    const cmd_files = find_nested("./commands/", ".js");
    if (cmd_files.length <= 0) return logger.log("warn", "There are no commands to load...");
    logger.debug(`Loading ${cmd_files.length} commands...`);
    cmd_files.forEach((file, i) => {
        this.addCommand(bot, file);
    });

    const cevent_files = find_nested("./custom_events", ".js");
    if (cevent_files.length <= 0) return logger.log("warn", "There are no cevents to load...");
    logger.debug(`Loading ${cevent_files.length} cevents...`)
    cevent_files.forEach(async(file, i) => {
        this.addCEvent(bot, file)
    });

};

module.exports.addEvent = (bot, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            bot.on(props.help.name, props.run);
            logger.debug(`Event ${props.help.name} loaded!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.removeEvent = (bot, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file)
            delete require.cache[require.resolve(file)];
            bot.removeListener(props.help.name, props.run);
            logger.debug(`Event ${props.help.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.addCEvent = (bot, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            if (props.setup) await props.setup();
            bot.cevents.set(props.help.name, props);
            logger.debug(`CEvent ${props.help.name} loaded!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.removeCEvent = (bot, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file)
            if (!bot.cevents.has(props.help.name)) { reject(Error("Cevent does not exist")); }
            delete require.cache[require.resolve(file)];
            bot.cevents.delete(props.help.name);
            logger.debug(`CEvent ${props.help.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.addCommand = (bot, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            props.help.category = path.dirname(file).split(path.sep).pop();
            bot.commands.set(props.help.name, props);
            props.help.aliases.forEach((alias) => {
                bot.aliases.set(alias, props.help.name);
            });
            logger.debug(`Command ${props.help.name} loaded!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.removeCommand = (bot, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            if (!bot.commands.has(props.help.name)) { reject(Error("Command does not exist")); }
            delete require.cache[require.resolve(file)];
            bot.commands.delete(props.help.name);
            logger.debug(`Command ${props.help.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}