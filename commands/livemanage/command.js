const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "command",
    aliases: ["com"],
    category: "DevOnly",
    description: "",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.registerSubCommand(`${__dirname}/command/add.js`);
cmd.registerSubCommand(`${__dirname}/command/remove.js`);
cmd.registerSubCommand(`${__dirname}/command/reload.js`);

cmd.setExecute(async (client, message, args, cmd) => {
   message.channel.send("Please specify, `add` `remove` or `reload`");
});

module.exports = cmd;