const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "operation",
    aliases: ["op"],
    category: "DevOnly",
    description: "",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.registerSubCommand(`${__dirname}/operation/add`);
cmd.registerSubCommand(`${__dirname}/operation/remove`);
cmd.registerSubCommand(`${__dirname}/operation/reload`);

cmd.setExecute(async (client, message, args, cmd) => {
   message.channel.send("Please specify, `add` `remove` or `reload`");
});

module.exports = cmd;