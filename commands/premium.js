const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "premium",
    aliases: [],
    category: "Bot",
    description: "Get premium for some cool rewards",
    usage: ""
});

command.setLimits({
    cooldown: 0,
    limited: true
});

command.setPerms({
    userPermissions: [],
    botPermissions: []
});

command.setExecute(async(client, message, args, cmd) => {
    const voted = await client.operations.checkVote.run(message.author.id);
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Premium",
        description: `Premium can provide you with benefits in the future...`,
        fields: [
            { name: "Premium Benefit 1", value: "It does this cool stuff", inline: true },
            { name: "Premium Benefit 2", value: "It does this cool stuff as well, I know so much!", inline: true }
        ]
    }));
});

module.exports = command;