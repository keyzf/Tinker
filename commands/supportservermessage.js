'use strict'

const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "supportservermessage",
    aliases: ["ssmsg", "ssm"],
    category: "Support Server",
    description: "Send a support server message",
    usage: "<msg>"
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES", "USE_EXTERNAL_EMOJIS"],
    globalUserPermissions: ["support.command.supportservermessage"],
    memberPermissions: ["command.supportservermessage"]
});

command.registerSubCommand(`${__dirname}/supportservermessage/supportchannel.js`);
command.registerSubCommand(`${__dirname}/supportservermessage/permissions.js`);
command.registerSubCommand(`${__dirname}/supportservermessage/error.js`);
command.registerSubCommand(`${__dirname}/supportservermessage/deadchat.js`);

command.setExecute(async (client, message, args, cmd) => {
    let all = [];
    client.utility.recursive.loopObjArr(command, "subcommands", (elts) => {
        all = all.concat(elts);
    });

    message.channel.send(client.operations.generateEmbed.run({
        description: all.map((elt) => `\`-\` ${elt.info.description || "I don't know what this does..."} \`${elt.info.name}\``).join("\n"),
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
    client.operations.deleteCatch.run(message);
});

module.exports = command;