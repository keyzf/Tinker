const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "botinfo",
    aliases: ["info"],
    category: "Bot",
    description: "Get information about the bot",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async(client, message, args, cmd) => {
    const botInfo = client.data.botInfo;
    message.channel.send(await client.operations.get("generateDefaultEmbed")(botInfo));
});

module.exports = cmd;