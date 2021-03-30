const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "eval",
    aliases: [],
    category: "DevOnly",
    description: "Evaluate JS",
    usage: "<js code>"
});

command.setLimits({
    cooldown: 0,
    limited: true
});

command.setPerms({
    botPermissions: [],
    userPermissions: []
});

const Discord = require("discord.js");
const util = require("util");

command.setExecute(async (client, message, args, cmd) => {
    const {prefix} = await client.data.db.getOne({
        table: "guilds",
        fields: ["prefix"],
        conditions: [`guildID='${message.guild.id}'`]
    });

    const send = (data) => {
        message.channel.send(data)
    }

    const asyncCode = (code) => {
        return `(async function(){${code}}())`
    }

    const clean = (res) => {
        if(typeof res != "string") {
            return res;
        }
        res.replace(process.env.DISCORD_CLIENT_TOKEN, "CLIENT_TOKEN");
        return res;
    }

    let code = message.content.slice(prefix.length + cmd.length).trim();
    if (code.indexOf("```") === 0) {
        code = code.replace(/```/g, "").replace("js", "");
    }
    try {
        const data = clean(await eval(code));
        message.channel.send(util.inspect(data, {showHidden: false, depth: null}), {code: "js"});
    } catch ({stack}) {
        message.channel.send(stack, {code: "js"});
    }
});

module.exports = command;