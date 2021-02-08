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
 * @property {Boolean} limited wether the command should be limited to developers only
 */

/**
 * Array of Discord Permissions
 * @typedef {Array.<string>} PermissionsList
 */

/**
 * @typedef {Object} PermissionsInfo
 * @property {PermissionsList} userPermissions permissions the user must have to perform this command
 * @property {PermissionsList} botPermissions permissions the bot must have to perform this command
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

    run(message, args, cmd, parents) {
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
            const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

            if (now < expirationTime) {
                // const timeLeft = (expirationTime - now) / 1000;
                // const path = parents.reduce((acc, cur) => {return acc += `${cur.info.name} > `}, "") + this.info.name;
                // message.channel.send(`Woah woah there! Hold onto that thought for \`${timeLeft.toFixed(1)}s\`, then you can use \`${path}\` again.`);
                return;
            }
        }
        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

        // check botPerms (Discord)
        if (!message.guild.me.permissions.has("SEND_MESSAGES", { checkAdmin: false })) {
            return this.client.logger.warn(`Missing Permission - SEND_MESSAGES - Command: ${this.info.name}, Server: ${message.guild.name} (${message.guild.id})`)
        }

        for (let i = 0; i < this.botPermissions.length; i++) {
            const perm = this.botPermissions[i];
            if (!message.guild.me.permissions.has(perm, { checkAdmin: false })) {
                message.channel.send(this.client.operations.get("generateDefaultEmbed")({
                    title: "I need permission!",
                    description: `I need to have ${this.client.data.permissionsNames[perm] || perm} permission to run this command.\nIf you are unsure then give me administrator, it allows me to do everything I need`
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
                        message.channel.send(`Bypassed failed perms check for ${perm} as a developer`);
                        continue;
                    }
                    message.channel.send(this.client.operations.get("generateDefaultEmbed")({
                        title: "You need permission!",
                        description: `You need to have ${this.client.data.permissionsNames[perm] || perm} permission to run this command.`
                    }));
                    return this.client.logger.debug(`User Missing Permission - ${perm} - Command: ${this.info.name}, Server: ${message.guild.name} (${message.guild.id}), User: ${message.author.tag} (${message.author.id})`)
                }
            }
        }


        // TODO: Check custom user perms

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