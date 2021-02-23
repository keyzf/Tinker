const { Client, Collection, Intents } = require("discord.js");
const logger = require("./internal/logger");

const client = new Client({
    autoReconnect: true,
    retryLimit: Infinity,
    presence: {
        status: "idle",
    },
    ws: {
        intents: new Intents([
            Intents.PRIVILEGED,
            Intents.NON_PRIVILEGED
        ])
    }
});

client.cleanExit = async(exitCode) => {
    if (client.user) await client.user.setStatus("invisible");
    console.log(exitCode)
    process.exit(exitCode);
}

client.logger = logger.setup(client);

client.utility = require("./UtilityManager.js").setup(client);

client.on('debug', m => client.logger.debug(m));
client.on('warn', m => client.logger.warn(m));
client.on('error', m => client.logger.error(m));

client.on("shardReady", (id, _) => {
    client.logger.info(`Shard Ready #${id}`)
    client.operations.get("updateActivity")();
});
client.on("shardError", (err, id) => client.logger.error(`Shard #${id} Error ${client.utility.inspect(err)}`));
client.on("shardReconnecting", (id) => client.logger.info(`Shard #${id} Attempting Reconnect`));
client.on("shardResume", (replayed) => client.logger.info(`Connection resumed, replaying ${client.utility.inspect(replayed)} events`));
client.on("shardDisconnect", (event, id) => client.logger.info(`Shard #${id} Disconnected`));

process.on("SIGINT", client.cleanExit);

client.on("rateLimit", m => client.logger.info(`Hit rate limit ${client.utility.inspect(m)}`));

client.logger.debug("Setting skeleton store (volatile)");
// internal stuff
client.commands = new Collection();
client.aliases = new Collection();
client.cooldowns = new Collection();
client.operations = new Collection();
client.afk = new Map();

// fun stuff
client.audioQueue = new Map();

client.config = {};

client.logger.debug("Setup database");
client.data = require("./internal/db").setup(client);

client.logger.debug("Setup time interval manager");
client.updater = require("./internal/updater").setup(client);

client.logger.debug("Setup Emoji Helper");
client.emojiHelper = require("./internal/emojiHelper").setup(client);

// client.permissionsManager = {} // for custom perms system

/**
 * 
 * @param {String} path Path to command directory
 */
client.registerCommandDir = (path) => {
    client.commandDir = path;
    const cmd_files = client.utility.find(path, ".js");
    if (cmd_files.length <= 0) return client.logger.info(`No commands to load`);
    client.logger.info(`Loading ${cmd_files.length} commands from dir ${client.commandDir}...`);
    cmd_files.forEach((file, i) => {
        client.registerCommand(require(file));
    });
    return;
}

const Command = require("../structures/Command");
/**
 * 
 * @param {Command} command 
 */
client.registerCommand = (command) => {
    command._registerClient(client);
    client.commands.set(command.info.name, command);
    command.info.aliases.forEach((alias) => {
        client.aliases.set(alias, command.info.name);
    });
    client.logger.debug(`Command ${command.info.name} added!`);

    // log all subcommands
    client.utility.recursive.loopObjArr(command, "subcommands", (elts) => {
        const reqPath = elts.reduce(
            (acc, cur) => { return acc += ` > ${cur.info.name}`; },
            `${command.info.name}`
        );
        client.logger.debug(reqPath);
    });

    return;
}

client.removeCommand = (file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const command = require(file);
            if (!client.commands.has(command.info.name)) { reject(Error("Command does not exist")); }
            delete require.cache[require.resolve(file)];
            client.commands.delete(command.info.name);
            client.logger.debug(`Command ${command.info.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 
 * @param {String} path Path to events directory
 */
client.registerEventDir = (path) => {
    client.eventDir = path;
    const event_files = client.utility.findNested(path, ".js");
    if (event_files.length <= 0) return client.logger.info(`No events to load`);
    client.logger.info(`Loading ${event_files.length} events from dir ${client.eventDir}...`);
    event_files.forEach((file, i) => {
        client.registerEvent(require(file));
    });
}

const DiscordEvent = require("../structures/DiscordEvent");
/**
 * 
 * @param {DiscordEvent} discordEvent 
 */
client.registerEvent = (discordEvent) => {
    discordEvent._registerClient(client);
    client.on(discordEvent.info.name, (...args) => {
        return discordEvent.run(...args);
    });
    client.logger.debug(`Event ${discordEvent.info.name} added!`);
}

client.removeEvent = (file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const discordEvent = require(file)
            delete require.cache[require.resolve(file)];
            client.removeAllListeners(discordEvent.info.name);
            client.logger.debug(`Event ${discordEvent.info.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

/**
 * 
 * @param {String} path Path to operations directory
 */
client.registerOperationsDir = (path) => {
    client.operationsDir = path;
    const operation_files = client.utility.findNested(path, ".js");
    if (operation_files.length <= 0) return client.logger.info(`No operations to load`);
    client.logger.info(`Loading ${operation_files.length} operations from dir ${client.operationsDir}...`);
    operation_files.forEach((file, i) => {
        client.registerOperation(require(file));
    });
}

const Operation = require("../structures/Operation");
/**
 * 
 * @param {Operation} Operation 
 */
client.registerOperation = (operation) => {
    operation._registerClient(client);
    client.operations.set(operation.info.name, (...args) => {
        return operation.run(...args);
    });
    client.logger.debug(`Operation ${operation.info.name} added!`);
}

client.removeOperation = (file) => {
    return new Promise(async(resolve, reject) => {
        try {
            const operation = require(file)
            if (!client.operations.has(operation.info.name)) { reject(Error("Operation does not exist")); }
            delete require.cache[require.resolve(file)];
            client.operations.delete(operation.info.name);
            client.logger.debug(`Operation ${operation.info.name} removed!`);
            resolve();
        } catch (err) {
            reject(err);
        }
    });
}

client.applyConfig = (name, config) => {
    client.logger.debug(`Config ${name} applied`);
    client.config[name] = config;
}

client.addData = (name, config) => {
    client.logger.debug(`Data ${name} applied`);
    client.data[name] = config;
}

module.exports = client;