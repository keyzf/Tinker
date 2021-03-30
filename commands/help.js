const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "help",
    aliases: ["h"],
    category: "Bot",
    description: "Shows you help on how to use the bot",
    usage: ""
});

command.setLimits({
    cooldown: 1
});

command.setPerms({
    botPermissions: [],
    userPermissions: []
});

command.registerSubCommand(`${__dirname}/help/all`);
command.registerSubCommand(`${__dirname}/help/command`);
command.registerSubCommand(`${__dirname}/help/category`);
command.registerSubCommand(`${__dirname}/help/usage`);
command.registerSubCommand(`${__dirname}/help/devs`);

command.setExecute(async(client, message, args, cmd) => {
    if (args.length) {
        return command.findSubcommand("command").run(message, args, cmd);
    }
    const {prefix} = await client.data.db.getOne({
        table: "guilds",
        fields: ["prefix"],
        conditions: [`guildID='${message.guild.id}'`]
    });

    return message.channel.send(client.operations.generateEmbed.run({
        title: "Here to help!",
        description: `We have loads of commands (\`${prefix}help all\`) that do so many different things!
        Meet our developers by typing \`${prefix}help devs\` cause they deserve credit for everything that I am
        If you are struggling with how to interpret the usage string, please run \`${prefix}help usage\``,
        colour: client.statics.colours.tinker,
        ...client.statics.defaultEmbed.footerUser("Requested by", message.author)
    }));
});

module.exports = command;