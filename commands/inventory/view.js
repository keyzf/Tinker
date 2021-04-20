const Command = require("../../structures/Command");
const command = new Command();

command.setInfo({
    name: "view",
    aliases: ["see", "look"],
    category: "Adventuring",
    description: "View the contents of your inventory",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["indev.command.adventuring.inventory.view"],
    memberPermissions: ["command.adventuring.inventory.view"]
});

command.setExecute(async(client, message, args, cmd) => {
    message.channel.send("not yet")
});

module.exports = command;