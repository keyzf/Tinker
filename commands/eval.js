const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "eval",
    aliases: [],
    category: "DevOnly",
    description: "Evaluate JS",
    usage: "<js code>"
});

cmd.setLimits({
    cooldown: 0,
    limited: true
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

const Discord = require("discord.js");
const util = require("util");
const figlet = require("figlet");

cmd.setExecute(async(client, message, args, cmd) => {
    const { prefix } = client.data.db.prepare(`SELECT prefix FROM guilds WHERE guildID=?`).get(message.guild.id);

    function send(data) {
        message.channel.send(data)
    }

    var code = message.content.slice(prefix.length + cmd.length).trim();
    if (code.indexOf("```") == 0) {
        code = code.replace(/```/g, "").replace("js", "");
    }
    try {
        const data = await eval(code);
        message.channel.send(util.inspect(data, { showHidden: false, depth: null }), { code: "js" });
    } catch ({ stack }) {
        message.channel.send(stack, { code: "js" });
    }
});

module.exports = cmd;