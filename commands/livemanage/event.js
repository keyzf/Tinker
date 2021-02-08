const Command = require("../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "event",
    aliases: [],
    category: "DevOnly",
    description: "",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.registerSubCommand(`${__dirname}/event/add`);
cmd.registerSubCommand(`${__dirname}/event/remove`);
cmd.registerSubCommand(`${__dirname}/event/reload`);

cmd.setExecute(async (client, message, args, cmd) => {
   message.channel.send("Please specify, `add` `remove` or `reload`");
});

module.exports = cmd;