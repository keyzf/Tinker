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
    globalUserPermissions: ["admin.command.livemanage.static.add"],
    memberPermissions: ["command.livemanage.static.add"]
});

const path = require("path");

command.setExecute(async(client, message, args, cmd) => {
    const staticName = args[0];
    let stat_files = client.utility.findNested("./statics", `.js`);

    stat_files = stat_files.filter((f) => { return path.basename(f) === `${staticName}.js` });

    if (!stat_files.length) { return message.channel.send("Static file not found"); }
    if (stat_files.length > 1) { return message.channel.send("More than one static found"); }
    const scriptName = stat_files[0];

    client.statics = {...client.statics, [scriptName.split('\\').pop().split('/').pop().replace(".js", "")]: require(scriptName).setup ? require(scriptName).setup() : require(scriptName) }
    message.channel.send(`Added static ${staticName}`)
});

module.exports = command;