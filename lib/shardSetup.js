const path = require("path")
const logger = require("./logger.js");
const { find_nested } = require("./utilFunctions");
const Discord = require("discord.js");

module.exports.setup = async(shard) => {

    logger.debug("creating shard variables");
    logger.debug("1: commands");
    shard.commands = new Discord.Collection();
    logger.debug("2: aliases");
    shard.aliases = new Discord.Collection();
    logger.debug("3: cooldowns");
    shard.cooldowns = new Discord.Collection();
    logger.debug("4: afk");
    shard.afk = new Map();
    logger.debug("5: recentMessages");
    shard.recentMessages = [];
    logger.debug("6: shardFunctions");
    shard.shardFunctions = new Discord.Collection();
    logger.debug("7: AudioQueue");
    shard.audioQueue = new Map();

    const event_files = find_nested("./events/", ".js")
    if (event_files.length <= 0) return logger.log("warn", "There are no events to load...");
    logger.debug(`Loading ${event_files.length} events...`);
    event_files.forEach((file, i) => {
        this.addEvent(shard, file)
    });

    const cmd_files = find_nested("./commands/", ".js");
    if (cmd_files.length <= 0) return logger.log("warn", "There are no commands to load...");
    logger.debug(`Loading ${cmd_files.length} commands...`);
    cmd_files.forEach((file, i) => {
        this.addCommand(shard, file);
    });

    const shardFunction_files = find_nested("./shardFunctions", ".js");
    if (shardFunction_files.length <= 0) return logger.log("warn", "There are no shard functions to load...");
    logger.debug(`Loading ${shardFunction_files.length} shard functions...`)
    shardFunction_files.forEach(async(file, i) => {
        this.addShardFunction(shard, file)
    });

    // TODO: put active reaction roles into memory
    // TODO: put active polls into memory

};

module.exports.addEvent = (shard, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            if(props.setup) await props.setup(shard);
            shard.on(props.help.name, props.run.bind(null, shard));
            logger.debug(`Event ${props.help.name} loaded!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.removeEvent = (shard, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file)
            delete require.cache[require.resolve(file)];
            shard.removeListener(props.help.name, props.run);
            logger.debug(`Event ${props.help.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.addShardFunction = (shard, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            if (props.setup) await props.setup(shard);
            props.run = props.run.bind(null, shard);
            shard.shardFunctions.set(props.help.name, props);
            logger.debug(`ShardFunction ${props.help.name} loaded!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.removeShardFunction = (shard, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file)
            if (!shard.shardFunctions.has(props.help.name)) { reject(Error("ShardFunction does not exist")); }
            delete require.cache[require.resolve(file)];
            shard.shardFunctions.delete(props.help.name);
            logger.debug(`ShardFunction ${props.help.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.addCommand = (shard, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            if (props.setup) await props.setup(shard);
            props.help.category = path.dirname(file).split(path.sep).pop();
            props.run = props.run.bind(null, shard);
            shard.commands.set(props.help.name, props);
            props.help.aliases.forEach((alias) => {
                shard.aliases.set(alias, props.help.name);
            });
            logger.debug(`Command ${props.help.name} loaded!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

module.exports.removeCommand = (shard, file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const props = require(file);
            if (!shard.commands.has(props.help.name)) { reject(Error("Command does not exist")); }
            delete require.cache[require.resolve(file)];
            shard.commands.delete(props.help.name);
            logger.debug(`Command ${props.help.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}