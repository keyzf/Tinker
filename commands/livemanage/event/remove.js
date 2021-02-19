const Command = require("../../../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "remove",
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
    const eventName = args[0];
    let cmd_files = client.utility.find(client.eventDir, `.js`);

    cmd_files = cmd_files.filter((f) => { return path.basename(f) === `${eventName}.js` });

    if (!cmd_files.length) { return message.channel.send("Event file not found"); }
    if (cmd_files.length > 1) { return message.channel.send("More than one event found"); }
    const scriptName = cmd_files[0];

    await client.removeEvent(scriptName);
    message.channel.send(`Remove event ${eventName}`)
});

module.exports = cmd;