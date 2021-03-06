'use strict'

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
    globalUserPermissions: ["admin.command.livemanage.static.reload"],
    memberPermissions: ["command.livemanage.static.reload"]
});

const path = require("path");

command.setExecute(async(client, message, args, cmd) => {
    const staticName = args[0];
    let stat_files = client.utility.findNested("./statics", `.js`);

    stat_files = stat_files.filter((f) => { return path.basename(f) === `${staticName}.js` });

    if (!stat_files.length) { return message.channel.send("static file not found"); }
    if (stat_files.length > 1) { return message.channel.send("More than one static found"); }
    const scriptName = stat_files[0];

    delete client.statics[scriptName.split('\\').pop().split('/').pop().replace(".js", "")];
    delete require.cache[require.resolve(scriptName)];
    client.statics = {...client.statics, [scriptName.split('\\').pop().split('/').pop().replace(".js", "")]: require(scriptName).setup ? require(scriptName).setup() : require(scriptName) }
    message.channel.send(`Reloaded static ${staticName}`)
});

module.exports = command;