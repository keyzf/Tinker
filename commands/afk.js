const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "afk",
    aliases: [],
    category: "User",
    description: "Set yourself as afk, whenever someone pings you it tells them why your not responding",
    usage: "<reason for afk>"
});

cmd.setLimits({
    cooldown: 2,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async (client, message, args, cmd) => {
    let reason = args.join(' ') ? args.join(' ') : 'I am currently afk, I will reply as soon possible.';
    let afklist = client.afk.get(message.author.id);

    if (!afklist) {
        let construct = {
            id: message.author.id,
            usertag: message.author.tag,
            reason: reason
        };

        client.afk.set(message.author.id, construct);
        message.channel.send(await client.operations.generateEmbed.run({
            description: `you have been set to afk for reason: ${reason}`,
            colour: client.statics.colours.tinker,
        }));
    }    
});

module.exports = cmd;