const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "vote",
    aliases: [],
    category: "Bot",
    description: "vote for some cool rewards",
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
    const userVote = await client.voteManager.getVote(message.author.id);
    return message.channel.send(client.operations.generateEmbed.run({
        title: "Voting",
        description: `Voting can provide you with benefits in the future... for now it just helps us gain more publicity! You can [vote here](${client.config.config.voteLink})`,
        fields: [
            { name: "Voting Benefit 1", value: "It does this cool stuff", inline: true },
            { name: "Voting Benefit 2", value: "It does this cool stuff as well, I know so much!", inline: true }
        ],
        footerText: `${userVote == null ? "Error getting your vote status" : userVote.voted ? "You have already voted, please vote again in 12 hours" : "You have not yet voted today" }`,
        footerUrl: message.author.displayAvatarURL(),
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;