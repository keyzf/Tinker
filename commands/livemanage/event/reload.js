const Command = require("../../../structures/Command");
const command = new Command();

command.setInfo({
    name: "reload",
    aliases: [],
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
    globalUserPermissions: ["admin.command.livemanage.event.reload"],
    memberPermissions: ["command.livemanage.event.reload"]
});

const path = require("path");

command.setExecute(async(client, message, args, cmd) => {
    const eventName = args[0];
    let cmd_files = client.utility.find(client.eventDir, `.js`);

    cmd_files = cmd_files.filter((f) => { return path.basename(f) === `${eventName}.js` });

    if (!cmd_files.length) { return message.channel.send("Event file not found"); }
    if (cmd_files.length > 1) { return message.channel.send("More than one event found"); }
    const scriptName = cmd_files[0];

    await client.removeEvent(scriptName);
    await client.registerEvent(require(scriptName));
    message.channel.send(`Reloaded event ${eventName}`)
});

module.exports = command;