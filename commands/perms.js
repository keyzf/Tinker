const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "perms",
    aliases: ["permissions"],
    category: "Bot",
    description: "Show the required perms for the bot and its functions",
    usage: ""
});

command.setLimits({
    cooldown: 2,
    limited: false
});

command.setPerms({
    userPermissions: ["MANGE_ROLES"],
    botPermissions: ["ADD_REACTIONS"]
});


command.setExecute(async(client, message, args, cmd) => {

    await message.author.send(client.operations.generateEmbed.run({
        title: "Required Permissions",
        description: "I need perms to do a lot of things. From merely sending messages to them and playing you music.\nThis lists all the permissions I have and what they are needed to do",
        fields: [
            { name: `Admin - ${message.guild.me.permissions.has("ADMINISTRATOR", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "If I've got this then no need to worry about any of the others. This lets me do everything I need" },
            { name: `Create Invite - ${message.guild.me.permissions.has("CREATE_INSTANT_INVITE", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used to provide quick support links for our developers" },
            { name: `Kick Members - ${message.guild.me.permissions.has("KICK_MEMBERS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for `kick` command" },
            { name: `Ban Members - ${message.guild.me.permissions.has("BAN_MEMBERS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for `ban` command" },
            { name: `Manage Channels - ${message.guild.me.permissions.has("MANAGE_CHANNELS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used in bot automation and channel logging" },
            { name: `Manage Guild - ${message.guild.me.permissions.has("MANAGE_GUILD", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used in bot automation and guild logging" },
            { name: `Add Reactions - ${message.guild.me.permissions.has("ADD_REACTIONS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used in many commands and operations as a form of selection, also used to notify users" },
            { name: `View Audit Log - ${message.guild.me.permissions.has("VIEW_AUDIT_LOG", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Priority Speaker - ${message.guild.me.permissions.has("PRIORITY_SPEAKER", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Stream [DENIED] - ${message.guild.me.permissions.has("STREAM", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently available to bots" },
            { name: `View Channel - ${message.guild.me.permissions.has("VIEW_CHANNEL", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Needed for the bot to see messages" },
            { name: `Send Messages - ${message.guild.me.permissions.has("SEND_MESSAGES", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Needed for the bot to respond to messages" },
            { name: `Send Text-To-Speech Messages - ${message.guild.me.permissions.has("SEND_TTS_MESSAGES", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Manage Messages - ${message.guild.me.permissions.has("MANAGE_MESSAGES", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Needed for prettifying the chat, removing spam/nsfw content" },
            { name: `Embed Links - ${message.guild.me.permissions.has("EMBED_LINKS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used to hide full links and provide small content embeds" },
            { name: `Attach Files - ${message.guild.me.permissions.has("ATTACH_FILES", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used to make everything prettier" },
            { name: `Read Message History - ${message.guild.me.permissions.has("READ_MESSAGE_HISTORY", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Needed for some bot automation" },
            { name: `Mention Everyone - ${message.guild.me.permissions.has("MENTION_EVERYONE", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Use External Emojis - ${message.guild.me.permissions.has("USE_EXTERNAL_EMOJIS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used to give users a better experience" },
            { name: `View Guild Insights [DENIED] - ${message.guild.me.permissions.has("VIEW_GUILD_INSIGHTS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Connect to Voice Channel - ${message.guild.me.permissions.has("CONNECT", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for playing music" },
            { name: `Speak - ${message.guild.me.permissions.has("SPEAK", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for playing music" },
            { name: `Mute Members - ${message.guild.me.permissions.has("MUTE_MEMBERS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for `mute` command" },
            { name: `Deafen Members - ${message.guild.me.permissions.has("DEAFEN_MEMBERS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Move Members - ${message.guild.me.permissions.has("MOVE_MEMBERS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Use Voice Activity Detection - ${message.guild.me.permissions.has("USE_VAD", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for bot automation and voice activity logging" },
            { name: `Change Nickname - ${message.guild.me.permissions.has("CHANGE_NICKNAME", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Manage Nicknames - ${message.guild.me.permissions.has("MANAGE_NICKNAMES", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
            { name: `Manage Roles - ${message.guild.me.permissions.has("MANAGE_ROLES", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for `mute` command" },
            { name: `Manage Webhooks - ${message.guild.me.permissions.has("MANAGE_WEBHOOKS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Used for announcements" },
            { name: `Manage Emojis - ${message.guild.me.permissions.has("MANAGE_EMOJIS", { checkAdmin: false }) ? "Passed" : "Failed"}`, value: "Not currently used" },
        ],
        colour: client.statics.colours.tinker
    }));

    message.react("✅");
});

module.exports = command;