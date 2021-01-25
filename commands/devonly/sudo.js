module.exports.run = async(bot, message, args, dbGuild, cmd) => {
    message.author = await bot.users.fetch(args[0]);
    message.content = dbGuild.prefix + message.content.slice(dbGuild.prefix.length + cmd.length + args[0].length + 2, message.content.length);

    try {
        bot.commands.get(args[1]).run(bot, message, args.slice(2, args.length), dbGuild, args[1]);
    } catch (e) {
        console.log(e);
    }
};

module.exports.help = {
    name: "sudo",
    aliases: [],
    description: "",
    usage: "",
    cooldown: 0,
    limit: true,
    generated: true
};