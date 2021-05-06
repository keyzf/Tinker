'use strict'

const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "all",
    aliases: [],
    category: "Bot",
    description: "Shows you this page",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.help.all"],
    memberPermissions: ["command.bot.help.all"]
});

command.setExecute(async (client, message, args, cmd) => {
    const [{prefix}] = await client.data.db.query(`select prefix from guilds where guildID='${message.guild.id}'`);

    let all = [];
    client.utility.recursive.loopObjArr(command.parent, "subcommands", (elts) => {
        all = all.concat(elts);
    });

    return message.channel.send(client.operations.generateEmbed.run({
        title: "Here to help!",
        description: all.map((elt) => `\`-\` ${elt.info.description || "I don't know what this does..."} \`${prefix}help ${elt.info.name}\``).join("\n"),
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;