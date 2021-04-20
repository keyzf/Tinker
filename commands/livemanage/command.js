const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "command",
    aliases: ["com"],
    category: "DevOnly",
    description: "",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["admin.command.livemanage.command"],
    memberPermissions: ["command.livemanage.command"]
});

command.registerSubCommand(`${__dirname}/command/add.js`);
command.registerSubCommand(`${__dirname}/command/remove.js`);
command.registerSubCommand(`${__dirname}/command/reload.js`);

command.setExecute(async (client, message, args, cmd) => {
   message.channel.send("Please specify, `add` `remove` or `reload`");
});

module.exports = command;