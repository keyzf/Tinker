const setup = async() => {
    const { Client, Collection, Intents } = require("discord.js");
    const Operation = require("../structures/Operation");
    const DiscordEvent = require("../structures/DiscordEvent");

    const TimeoutManager = require("./TimeoutManager");
    const VoteManager = require("../structures/VoteManager");
    const CurrencyManager = require("./CurrencyManager");

    const logger = require("./internal/logger");

    const Statcord = require("statcord.js");

    const client = new Client({
        retryLimit: Infinity,
        presence: {
            status: "dnd",
            activity: {
                type: "COMPETING",
                name: "the loading challenge"
            }
        },
        ws: {
            intents: new Intents([
                Intents.PRIVILEGED,
                Intents.NON_PRIVILEGED
            ])
        }
    });

    client.statcord = new Statcord.Client({
        client,
        key: process.env.STATCORD_KEY,
        postCpuStatistics: true,
        postMemStatistics: true,
        postNetworkStatistics: true,
    });

    client.cleanExit = async(exitCode) => {
        if (client.user) {
            await client.user.setStatus("invisible");
            await client.destroy();
        }
        process.exit(exitCode);
    }

    client.logger = logger.setup(client);

    client.statcord.on("autopost-start", () => {
        // Emitted when statcord autopost starts
        client.logger.debug("Started autopost");
    });

    client.statcord.on("post", status => {
        // status = false if the post was successful
        // status = "Error message" or status = Error if there was an error
        if (!status) client.logger.debug("Successful post");
        else client.logger.error(status);
    });

    // const AutoPoster = require('topgg-autoposter');

    // const ap = AutoPoster('Your Top.gg Token', client) // TODO: need to get my top.gg token
    // ap.on('posted', () => {
    //     client.logger.info("Posted stats to Top.gg!");
    // });
    // TODO: use https://www.npmjs.com/package/@top-gg/sdk for posting and for webhooks when webserver is public

    client.config = require("../utility/dirTrawlPackageObj").setup("config", ".json");
    client.statics = require("../utility/dirTrawlPackageObj").setup("statics", ".js");
    client.utility = require("../utility/dirTrawlPackageObj").setup("utility", ".js");


    client.timeoutManager = new TimeoutManager(client);

    client.timeManager = require("./TimeManager");

    client.on('debug', m => client.logger.debug(m));
    client.on('warn', m => client.logger.warn(m));
    client.on('error', m => client.logger.error(m));

    client.on("shardReady", (id, _) => {
        client.logger.info(`Shard Ready #${id}`)
        client.operations.updateActivity.run().catch((err) => client.logger.error(err));
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
    client.afk = new Map(); // TODO: move afk to db

    // fun stuff
    client.audioQueue = new Map();
    client.activeAdventures = new Collection();

    client.logger.debug("Setup database");
    client.data = await require("./internal/db").setup(client)

    client.logger.debug("Setup time interval manager");
    client.updater = require("./internal/updater").setup(client);

    client.logger.debug("Setup Emoji Helper");
    client.emojiHelper = require("./internal/emojiHelper").setup(client);

    client.logger.info("Setting up voting");
    client.voteManager = {
        top: new VoteManager(client, client.config.config.topVoteLinkCheck, process.env.TOP_TOKEN),
        boat: new VoteManager(client, client.config.config.boatVoteLinkCheck, process.env.BOAT_TOKEN)
    };

    client.logger.info("Setting up currency manager");
    client.currencyManager = new CurrencyManager({
        name: "traditional",
        currencyTyping: [
            { name: "copper", relationToBase: 1 },
            { name: "silver", relationToBase: 10 },
            { name: "gold", relationToBase: 100 }
        ]
    });

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
                (acc, cur) => {
                    return acc += ` > ${cur.info.name}`;
                },
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
                if (!client.commands.has(command.info.name)) {
                    reject(Error("Command does not exist"));
                }
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


    /**
     *
     * @param {Operation} operation
     */
    client.registerOperation = (operation) => {
        operation._registerClient(client);
        client.operations = ({...client.operations, [operation.info.name]: operation })
            // client.operations.set(operation.info.name, (...args) => {
            //     return operation.run(...args);
            // });
        client.logger.debug(`Operation ${operation.info.name} added!`);
    }

    client.removeOperation = (file) => {
        return new Promise(async(resolve, reject) => {
            try {
                const operation = require(file)
                if (!client.operations[operation.info.name]) {
                    reject(Error("Operation does not exist"));
                }
                delete require.cache[require.resolve(file)];
                client.operations[operation.info.name] = undefined;
                client.logger.debug(`Operation ${operation.info.name} removed!`);
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }

    client.applyConfig = (name, config) => {
        client.config[name] = config;
        client.logger.debug(`Config ${name} applied`);
    }

    client.addData = (name, config) => {
        client.data[name] = config;
        client.logger.debug(`Data ${name} applied`);
    }
    return client;
}

module.exports = setup;