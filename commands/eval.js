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
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["owner.command.eval"],
    memberPermissions: ["command.eval"]
});

const Discord = require("discord.js");
const util = require("util");

command.setExecute(async(client, message, args, cmd) => {
    return message.channel.send("I re-wrote permissions and dont trust myself. If you see this I swear to god you better contact me IMMEDIATELY");
    const [{ prefix }] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    const send = (data) => {
        message.channel.send(data)
    }

    const clean = (res) => {
        if (typeof res != "string") {
            return res;
        }
        res = res.replace(process.env.DISCORD_CLIENT_TOKEN, "CLIENT_TOKEN");
        return res;
    }

    let code = message.content.slice(prefix.length + cmd.length).trim();
    if (code.indexOf("```") === 0) {
        code = code.replace(/```/g, "").replace("js", "");
    }
    try {
        const data = clean(await eval(code));
        const output = util.inspect(data, { showHidden: false, depth: null });
        if (output) {
            message.channel.send(output, { code: "js", split: true });
        }
    } catch (err) {
        console.log(err)
        if (err.stack) {
            message.channel.send(err.stack, { code: "js" });
        }
    }
});

module.exports = command;