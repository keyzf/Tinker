const Command = require("../../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "add",
    aliases: [],
    category: "DevOnly",
    description: "",
    usage: ""
});

cmd.setLimits({
    cooldown: 1,
    limited: true
});

const path = require("path");

cmd.setExecute(async(client, message, args, cmd) => {
    const commandName = args[0];
    let cmd_files = client.utility.find(client.commandDir, `.js`);

    cmd_files = cmd_files.filter((f) => { return path.basename(f) === `${commandName}.js` });

    if (!cmd_files.length) { return message.channel.send("Command file not found"); }
    if (cmd_files.length > 1) { return message.channel.send("More than one command found"); }
    const scriptName = cmd_files[0];

    await client.registerCommand(require(scriptName));
    message.channel.send(`Added command ${commandName}`)
});

module.exports = cmd;