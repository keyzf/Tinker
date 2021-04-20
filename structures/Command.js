const { Collection } = require("discord.js");
const client = require("./TinkerClient");

/**
 * <required args> [optional args], use / to show options
 * @typedef {String} UsageString
 */

/**
 * 
 * @typedef {Object} CommandInfo
 * @property {String} name a unique command name
 * @property {Array.<string>} aliases a set of unique names the command can also be called by
 * @property {String} category a common name between commands of a similar type / category
 * @property {String} description a short description of what the command does
 * @property {UsageString} usage a description of how to use the command
 */

/**
 * 
 * @typedef {Object} CommandLimits
 * @property {Number} cooldown the period of time between which a command cannot be used by the same user
 * @property {Boolean} limited whether the command should be limited to developers only
 */

/**
 * Array of Discord Permissions
 * @typedef {Array.<string>} PermissionsList
 */

/**
 * @typedef {Object} PermissionsInfo
 * @property {PermissionsList} userPermissions permissions the user must have to perform this command
 * @property {PermissionsList} botPermissions permissions the bot must have to perform this command
 * @property {PermissionList} memberPermissions permissions the user must have (set by bot) to perform this command 
 * @property {PermissionList} globalUserPermissions permissions the user must have (set by bot) to perform this command
 */

/**
 * Representing a command, able to be run within Discord
 */
class Command {


    constructor() {
        this.client;

        this.info; // name, aliases, description, usage
        this.limits; // cooldowns, developers only
        this.userPermissions = []; // permissions the user must have to perform this command
        this.botPermissions = []; // permissions the bot must have to perform this command
        this.subcommands = []; // fixed command arguments for a specific sub command
        this.execute; // the actual code that runs
    }

    _registerClient(client) {
        this.client = client;
        this.subcommands.forEach((cmd) => {
            cmd._registerClient(this.client);
        });
    }

    findSubcommand(query) {
        if (!this.subcommands.length) return null;
        for (let i = 0; i < this.subcommands.length; i++) {
            const subcmd = this.subcommands[i];
            if (query == subcmd.info.name) {
                return subcmd
            }
            if (subcmd.info.aliases) {
                if (subcmd.info.aliases.some((elt) => { return query == elt })) {
                    return subcmd;
                }
            }
        }
    }

    async run(message, args, cmd, parents) {
        if (!parents) { parents = [] }
        let subcmd = this.findSubcommand(args[0]);
        if (subcmd) {
            parents.push(this);
            return subcmd.run(message, args.slice(1, args.length), cmd, parents);
        }

        // check cooldown
        if (!this.client.cooldowns.has(this.info.name)) {
            this.client.cooldowns.set(this.info.name, new Collection());
        }

        const now = Date.now();
        const timestamps = this.client.cooldowns.get(this.info.name);
        const cooldownAmount = (this.limits.cooldown || 0) * 1000;

        if (timestamps.has(message.author.id)) {
            const timestamp = timestamps.get(message.author.id)
            const expirationTime = timestamp.time + cooldownAmount;

            if (now < expirationTime) {
                if (!timestamp.userNotified) {
                    const timeLeft = (expirationTime - now) / 1000;
                    const path = parents.reduce((acc, cur) => { return acc += `${cur.info.name} > ` }, "") + this.info.name;
                    message.channel.send(`Woah woah there! Hold onto that thought for \`${timeLeft.toFixed(1)}s\`, then you can use \`${path}\` again.`);
                    timestamps.set(message.author.id, { time: timestamp.time, userNotified: true });
                }
                return;
            }
            timestamps.delete(message.author.id);
        }
        timestamps.set(message.author.id, { time: now, userNotified: false });

        // check botPerms (Discord)
        if (!message.guild.me.permissions.has("SEND_MESSAGES", { checkAdmin: false })) {
            return this.client.logger.warn(`Missing Permission - SEND_MESSAGES - Command: ${this.info.name}, Server: ${message.guild.name} (${message.guild.id})`)
        }

        //Check globalUser perms
        if (this.globalUserPermissions) {
            const globalUserPerms = await this.client.permissionsManager.getGlobalBotUserPerms(message.author);
            for (let i = 0; i < this.globalUserPermissions.length; i++) {
                const perm = this.globalUserPermissions[i];
                if (!globalUserPerms.has(perm)) {
                    message.channel.send(this.client.operations.generateEmbed.run({
                        title: "Permissions Denied",
                        description: `You are required to have bot-global \`${perm}\` to use this command`,
                        ...this.client.statics.defaultEmbed.footerUser("", message.author, " • If you believe this is a mistake then please contact us at support"),
                        colour: this.client.statics.colours.permissions.denied
                    }))
                    return this.client.logger.debug(`Global User Missing Permission - ${perm} - Command: ${this.info.name}, Server: ${message.guild.name} (${message.guild.id}), User: ${message.author.tag} (${message.author.id})`)
                }
            }
        }

        //Check per guild perms
        if (this.memberPermissions) {
            const memberPermissions = await this.client.permissionsManager.getBotUserPerms(message.guild, message.author);
            for (let i = 0; i < this.memberPermissions.length; i++) {
                const perm = this.memberPermissions[i];
                if (!memberPermissions.has(perm)) {
                    message.channel.send(this.client.operations.generateEmbed.run({
                        title: "Permissions Denied",
                        description: `You are required to have bot-member \`${perm}\` to use this command`,
                        ...this.client.statics.defaultEmbed.footerUser("", message.author, " • If you believe this is a mistake then please contact one of the server admins"),
                        colour: this.client.statics.colours.permissions.denied
                    }))
                    return this.client.logger.debug(`Per Guild User Missing Permission - ${perm} - Command: ${this.info.name}, Server: ${message.guild.name} (${message.guild.id}), User: ${message.author.tag} (${message.author.id})`)
                }
            }
        }

        // check bot perms (Discord)
        for (let i = 0; i < this.botPermissions.length; i++) {
            const perm = this.botPermissions[i];
            if (!message.guild.me.permissions.has(perm, { checkAdmin: false })) {
                message.channel.send(this.client.operations.generateEmbed.run({
                    title: "My Permissions Were Denied",
                    description: `I need to have ${this.client.data.permissionsNames[perm] || perm} permission to run this command.\nIf you are unsure then give me administrator, it allows me to do everything I need`,
                    ...client.statics.defaultEmbed.footerUser("", message.author, " • If you believe this is a mistake then please contact one of the server admins"),
                    colour: client.statics.colours.permissions.denied
                }));
                return this.client.logger.debug(`Bot Missing Permission - ${perm} - Command: ${this.info.name}, Server: ${message.guild.name} (${message.guild.id}), User: ${message.author.tag} (${message.author.id})`)
            }
        }

        // check userPerms (Discord)
        if (this.userPermissions) {
            for (let i = 0; i < this.userPermissions.length; i++) {
                const perm = this.userPermissions[i];
                if (!message.member.permissions.has(perm, { checkAdmin: false })) {
                    if (this.client.config.devs.includes(message.author.id)) {
                        message.channel.send(`Bypassed failed perms check for ${perm} as a developer`).then((m) => this.client.operations.deleteCatch.run(m, 3000));
                        continue;
                    }
                    message.channel.send(this.client.operations.generateEmbed.run({
                        title: "Permissions Denied",
                        description: `You are required to have discord-member \`${this.client.data.permissionsNames[perm] || perm}\` to use this command.`,
                        ...this.client.statics.defaultEmbed.footerUser("", message.author, " • If you believe this is a mistake then please contact one of the server admins"),
                        colour: this.client.statics.colours.permissions.denied
                    }));
                    return this.client.logger.debug(`User Missing Permission - ${perm} - Command: ${this.info.name}, Server: ${message.guild.name} (${message.guild.id}), User: ${message.author.tag} (${message.author.id})`)
                }
            }
        }


        this.client.logger.debug(`${message.author.tag}(${message.author.id}) executes ${this.info.name} "${message.content}"`);
        // this.client.statcord.postCommand(this.info.name, message.author.id);
        return this.execute(this.client, message, args, cmd);
    }

    /**
     * 
     * @param {CommandInfo} options
     * @returns {undefined}
     */
    setInfo(options) {
        if (typeof options.name != "string") {
            throw new TypeError("INVALID_COMMAND_INFO_OPTION - 'name' must be of type String");
        }
        options.name = options.name.toLowerCase();

        if (!Array.isArray(options.aliases)) {
            throw new TypeError("INVALID_COMMAND_INFO_OPTION - 'aliases' must be of type Array");
        }
        if (!options.aliases.every((elt) => { return (typeof elt == "string") })) {
            throw new TypeError("INVALID_COMMAND_INFO_OPTION - all elements of array 'aliases' must be of type String");
        }
        options.aliases = options.aliases.map((elt) => { return elt.toLowerCase() });

        if (typeof options.category != "string") {
            throw new TypeError("INVALID_COMMAND_INFO_OPTION - 'category' must be of type String");
        }

        if (typeof options.description != "string") {
            throw new TypeError("INVALID_COMMAND_INFO_OPTION - 'description' must be of type String");
        }

        if (typeof options.usage != "string") {
            throw new TypeError("INVALID_COMMAND_INFO_OPTION - 'name' must be of type String");
        }

        this.info = options;
    }

    /**
     * 
     * @param {PermissionsInfo} options 
     */
    setPerms(options) {
        // TODO: check data types and valid permissions
        this.userPermissions = options.userPermissions;
        this.botPermissions = options.botPermissions;
        this.globalUserPermissions = options.globalUserPermissions;
        this.memberPermissions = options.memberPermissions;
    }

    /**
     * 
     * @param {CommandLimits} options
     * @returns {undefined}
     * @throws {TypeError} if any options do not match required data type
     */
    setLimits(options) {
        if (typeof options.cooldown != "number") {
            throw new TypeError("INVALID_COMMAND_INFO_OPTION - 'cooldown' must be of type Number");
        }

        this.limits = options;
    }

    /**
     * 
     * @param {Function} func 
     */
    setExecute(func) {
        // TODO: Do I need to do any checking for Command setExecute?
        this.execute = func;
    }


    registerSubCommand(cmd) {
        delete require.cache[require.resolve(cmd)];
        this.subcommands.push(require(cmd));
    }

}

module.exports = Command;