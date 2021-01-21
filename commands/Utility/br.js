
module.exports.run = (bot, message, args, dbGuild, cmd) => {
    message.channel.send("``` ```")
}

module.exports.help = {
    name: "br",
    aliases: [],
    description: "Create a line break",
    usage: "",
    cooldown: 2,
    generated: true
}