'use strict'

const Command = require("../../../structures/Command");
const command = new Command();

command.setInfo({
    name: "add",
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
    globalUserPermissions: ["admin.command.livemanage.operation.add"],
    memberPermissions: ["command.livemanage.operation.add"]
});

const path = require("path");

command.setExecute(async(client, message, args, cmd) => {
    const operationName = args[0];
    let cmd_files = client.utility.findNested(client.operationsDir, `.js`);

    cmd_files = cmd_files.filter((f) => { return path.basename(f) === `${operationName}.js` });

    if (!cmd_files.length) { return message.channel.send("Operation file not found"); }
    if (cmd_files.length > 1) { return message.channel.send("More than one operation found"); }
    const scriptName = cmd_files[0];

    await client.registerOperation(require(scriptName));
    message.channel.send(`Added operation ${operationName}`)
});

module.exports = command;