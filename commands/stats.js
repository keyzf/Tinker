const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "stats",
    aliases: [],
    category: "Bot",
    description: "Stats about the bot",
    usage: ""
});

command.setLimits({
    cooldown: 2
});

command.setPerms({
    botPermissions: [],
    userPermissions: [],
    globalUserPermissions: ["user.command.bot.stats"],
    memberPermissions: ["command.bot.stats"]
});

const si = require("systeminformation");

function readableBytes(bytes, fixedDecimal) {
    var i = Math.floor(Math.log(bytes) / Math.log(1024)),
    sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return (bytes / Math.pow(1024, i)).toFixed(fixedDecimal || 2) * 1 + ' ' + sizes[i];
}

let used_bytes = 0;

command.setExecute(async(client, message, args, cmd) => {
    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `${client.emojiHelper.sendWith(client.data.emojis.custom.loading)} Tinker Stats`,
        description: `Please wait while the information is gathered`,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
    const mem = await si.mem();
    // Get active memory in B
    const memActive = mem.active;
    // Get active mem load in %
    const memLoad = Math.round(mem.active / mem.total * 100);

    const load = await si.currentLoad();
    // Get current load
    const cpuLoad = Math.round(load.currentLoad);

    if (used_bytes <= 0) used_bytes = (await si.networkStats()).reduce((prev, current) => prev + current.rx_bytes, 0);

    // Calculate used bandwidth
    let used_bytes_latest = (await si.networkStats()).reduce((prev, current) => prev + current.rx_bytes, 0);
    let bandwidth = used_bytes_latest - used_bytes;
    used_bytes = used_bytes_latest;

    return m.edit(client.operations.generateEmbed.run({
        title: "Tinker Stats",
        description: "Technical Information about the bot",
        fields: [
            { name: "Guilds", value: client.guilds.cache.size, inline: true },
            { name: "Users", value: client.guilds.cache.reduce((a, g) => a + g.memberCount, 0), inline: true },
            { name: "Channels", value: client.guilds.cache.reduce((a, g) => a + g.channels.cache.size, 0), inline: true },
            { name: "RAM", value: `${memLoad}% of ${readableBytes(memActive)}`, inline: true },
            { name: "CPU", value: `${cpuLoad}%`, inline: true },
            { name: "Bandwidth", value: `${readableBytes(bandwidth)}`, inline: true },
            { name: "Shard", value: client.shard ? client.shard.id : 0, inline: true },
        ],
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author, "")
    }));
});

module.exports = command;