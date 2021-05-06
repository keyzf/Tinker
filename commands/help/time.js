'use strict'

const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "time",
    aliases: ["timestring"],
    category: "Bot",
    description: "How we deal with time",
    usage: ""
});

command.setLimits({
    cooldown: 1,
    limited: false
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.bot.help.time"],
    memberPermissions: ["command.bot.help.time"]
});

command.setExecute(async(client, message, args, cmd) => {
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Time",
        description: "Time in Tinker is very simple to understand... it works just like time",
        fields: [
            { name: "Timestring", value: "In order to reference a relative time, e.g. 3 hours, you should adhere to timestring standard. This means you specify the amount and then the value. For example `1d2h3m` would result in 1 day 2 hours and 3 minutes.\n*Remember if you want to use spaces to put \"quotes\" around it as specified in the usage string*" },
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;