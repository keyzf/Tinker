const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "stats",
    aliases: [],
    category: "Bot",
    description: "Stats about the bot",
    usage: ""
});

cmd.setLimits({
    cooldown: 2,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

cmd.setExecute(async(client, message, args, cmd) => {
    const memoryUsage = process.memoryUsage();
    const cpus = client.utility.cpuILoad();
    const cpuUsage = (cpus.map((cpu) => { return parseFloat(cpu.percent) * 100}).reduce((acc, curr) => { return acc + curr }, 0)) / cpus.length

    return message.channel.send(client.operations.generateEmbed.run({
        title: "Tinker stats",
        description: "Technical Information about the bot",
        fields: [
            { name: "Guilds", value: client.guilds.cache.size, inline: true },
            { name: "Users", value: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0), inline: true },
            { name: "Channels", value: client.guilds.cache.reduce((a, g) => a + g.channels.cache.size, 0), inline: true },
            { name: "RAM", value: `${(memoryUsage.heapUsed/(1000 * 1000)).toFixed(2)}MB / ${(memoryUsage.heapTotal/(1000 * 1000)).toFixed(2)}MB `, inline: true },
            { name: "CPU", value: `${cpuUsage.toFixed(2)}% AVG`, inline: true },
            { name: "Shard", value: client.shard ? client.shard.id : 0, inline: true },
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = cmd;