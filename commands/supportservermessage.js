const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "supportservermessage",
    aliases: ["ssmsg", "ssm"],
    category: "Support Server",
    description: "Send a support server message",
    usage: "<msg>"
});

command.setLimits({
    cooldown: 1,
    limited: true
});

command.setPerms({
    userPermissions: ["MANAGE_MESSAGES"],
    botPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS", "USE_EXTERNAL_EMOJIS"]
});

command.registerSubCommand(`${__dirname}/supportservermessage/supportchannel.js`);
command.registerSubCommand(`${__dirname}/supportservermessage/permissions.js`);
command.registerSubCommand(`${__dirname}/supportservermessage/error.js`);
command.registerSubCommand(`${__dirname}/supportservermessage/deadchat.js`);

command.setExecute(async (client, message, args, cmd) => {
    message.channel.send(client.operations.generateDefaultEmbed.run({
        description: `Use these to shout at our members!

        \`-\` supportchannel: This isn't a support channel, here is where you get support

        \`-\` perms: Which perms the bot needs and how to manage them

        \`-\` errors: How errors work

        \`-\` deadchat: Explain why the chat is dead
        `,
        author: "Tinker Support",
        authorUrl: "./res/TinkerQuestion-yellow.png",
        footerText: `Requested by ${message.author.tag}`,
        footerUrl: message.author.displayAvatarURL()
    }));
    client.operations.deleteCatch.run(message);
});

module.exports = command;