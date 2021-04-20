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
    globalUserPermissions: ["admin.command.livemanage.command.reload"],
    memberPermissions: ["command.livemanage.command.reload"]
});

const path = require("path");

command.setExecute(async(client, message, args, cmd) => {
    const commandName = args[0];
    let cmd_files = client.utility.find(client.commandDir, `.js`);

    cmd_files = cmd_files.filter((f) => { return path.basename(f) === `${commandName}.js` });

    if (!cmd_files.length) { return message.channel.send("Command file not found"); }
    if (cmd_files.length > 1) { return message.channel.send("More than one command found"); }
    const scriptName = cmd_files[0];
    
    await client.removeCommand(scriptName);
    await client.registerCommand(require(scriptName));
    message.channel.send(`Reloaded command ${commandName}`)
});

module.exports = command;