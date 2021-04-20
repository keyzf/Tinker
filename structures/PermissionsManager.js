const Discord = require("discord.js");
const DotPerm = require("./DotPerm");

module.exports.setup = (client) => {

    /**
     * 
     * @param {Discord.Guild | Discord.Snowflake} guild 
     * @returns {Promise<Discord.Guild>}
     */
    function getGuild(guild) {
        return new Promise(async(resolve, reject) => {
            if (!guild) {
                return reject();
            }
            if (typeof guild != "string") {
                return resolve(guild);
            }
            const guildRes = await client.guilds.fetch(guild);
            if (!guildRes) { return reject() } else { return resolve(guildRes) }
        });
    }

    /**
     * 
     * @param {Discord.Guild | Discord.Snowflake} guild 
     * @returns {Promise<Discord.Snowflake>}
     */
    function getGuildID(guild) {
        return new Promise(async(resolve, reject) => {
            if (!guild) {
                return reject();
            }
            if (typeof guild == "string") {
                return resolve(guild);
            }
            return resolve(guild.id);
        });
    }

    /**
     * 
     * @param {Discord.Guild | Discord.Snowflake} guild
     * @param {Discord.Channel | Discord.Snowflake} channel
     * @returns {Promise<Discord.Channel>}
     */
    function getChannel(guild, channel) {
        return new Promise(async(resolve, reject) => {
            if (!guild) {
                return reject();
            }
            if (typeof guild == "string") {
                return reject();
            }
            if (!channel) {
                return reject();
            }
            if (typeof channel != "string") {
                return resolve(channel);
            }
            const channelRes = await guild.channels.cache.get(channel);
            if (!channelRes) { return reject() } else { return resolve(channelRes) }
        });
    }

    /**
     * 
     * @param {Discord.Channel | Discord.Snowflake} channel 
     * @returns {Promise<Discord.Snowflake>}
     */
    function getChannelID(channel) {
        return new Promise(async(resolve, reject) => {
            if (!channel) {
                return reject();
            }
            if (typeof channel == "string") {
                return resolve(channel);
            }
            return resolve(channel.id);
        });
    }

    /**
     * 
     * @param {Discord.GuildMember | Discord.Snowflake} member 
     * @returns {Promise<Discord.GuildMember>}
     */
    function getMember(guild, member) {
        return new Promise(async(resolve, reject) => {
            if (!guild) {
                return reject();
            }
            if (typeof guild == "string") {
                return reject();
            }
            if (!member) {
                return reject();
            }
            if (typeof member != "string") {
                return resolve(member);
            }
            const memberRes = await guild.members.fetch(member);
            if (!memberRes) { return reject() } else return resolve(memberRes);
        });
    }

    /**
     * 
     * @param {Discord.User | Discord.Snowflake} user 
     * @returns {Promise<Discord.Snowflake>}
     */
    function getUserID(user) {
        return new Promise(async(resolve, reject) => {
            if (!user) {
                return reject("no user provided");
            }
            if (typeof user == "string") {
                return resolve(user);
            }
            return resolve(user.id);
        });
    }

    function getDbUser(guild, user) {
        return new Promise(async(resolve, reject) => {
            if (!user) {
                return reject();
            }
            if (typeof user != "string") {
                user = user.id;
            }
            if (!guild) {
                return reject();
            }
            if (typeof guild != "string") {
                guild = guild.id;
            }
            const [dbUser] = await client.data.db.query(`select * from users where guildID='${guild}' and userID='${user}'`);
            if (!dbUser) { return reject("could not find user in db") } else { return resolve(dbUser) }
        });
    }

    function getDbGlobalUser(user) {
        return new Promise(async(resolve, reject) => {
            if (!user) {
                return reject("no user given");
            }
            if (typeof user != "string") {
                user = user.id;
            }
            const [dbUser] = await client.data.db.query(`select * from globalUser where userID='${user}'`);
            if (!dbUser) { return reject("could not find user in db") } else { return resolve(dbUser) }
        });
    }

    return {
        async userHas(guild, user, perms, opts) {
            guild = await getGuild(guild);
            user = await getMember(guild, user);
            return user.hasPermission(perms, opts);
        },

        async userHasIn(guild, channel, user, perms, opts) {
            guild = await getGuild(guild);
            channel = await getChannel(guild, channel);
            user = await getMember(guild, user);
            return user.permissionsIn(channel).has(perms, opts);
        },

        async botHas(guild, perms, opts) {
            guild = await getGuild(guild);
            return guild.me.hasPermission(perms, opts);
        },

        async botHasIn(guild, channel, perms, opts) {
            guild = await getGuild(guild);
            channel = await getChannel(guild, channel);
            return guild.me.permissionsIn(channel).has(perms, opts);
        },

        async getBotUserPerms(guild, user) {
            guild = await getGuildID(guild);
            user = await getUserID(user);
            try {
                const { perms } = await getDbUser(guild, user);
                return new DotPerm(DotPerm.deserialize(perms));
            } catch {
                return new DotPerm();
            }
        },

        async getGlobalBotUserPerms(user) {
            user = await getUserID(user);
            try {
                const { perms } = await getDbGlobalUser(user);
                return new DotPerm(DotPerm.deserialize(perms));
            } catch {
                return new DotPerm();
            }
        }
    }
}