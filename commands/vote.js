'use strict'

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
    cooldown: 0
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["indev.command.bot.vote"],
    memberPermissions: ["command.bot.vote"]
});

command.setExecute(async (client, message, args, cmd) => {
    const m = await message.channel.send(client.operations.generateEmbed.run({
        title: `Voting  ${client.emojiHelper.sendWith(client.data.emojis.custom.loading)}`,
        description: `Voting can provide you with benefits in the future... for now it just helps us gain more publicity! You can vote for discordboats [here](${client.config.config.boatVoteLink}) and at top.gg [here](${client.config.config.topVoteLink})`,
        fields: [
            {name: "Voting Benefit 1", value: "It does this cool stuff", inline: true},
            {name: "Voting Benefit 2", value: "It does this cool stuff as well, I know so much!", inline: true}
        ],
        footerText: `Please wait, getting status`,
        footerUrl: message.author.displayAvatarURL(),
        colour: client.statics.colours.tinker
    }));
    const userVoteBoat = await client.voteManager.boat.getVote(message.author.id);
    const voteStringBoat = `${userVoteBoat == null ? "Error getting your vote status" : userVoteBoat.voted ? "You have already voted, please vote again in 12 hours" : "You have not yet voted today"}`;
    const userVoteTop = await client.voteManager.top.getVote(message.author.id);
    const voteStringTop = `${userVoteTop == null ? "Error getting your vote status" : userVoteTop.voted ? "You have already voted, please vote again in 12 hours" : "You have not yet voted today"}`;
    return m.edit(client.operations.generateEmbed.run({
        title: "Voting",
        description: `Voting can provide you with benefits in the future... for now it just helps us gain more publicity! You can vote for discordboats [here](${client.config.config.boatVoteLink}) and at top.gg [here](${client.config.config.topVoteLink})`,
        fields: [
            {name: "Voting Benefit 1", value: "It does this cool stuff", inline: true},
            {name: "Voting Benefit 2", value: "It does this cool stuff as well, I know so much!", inline: true}
        ],
        footerText: `Top: ${voteStringTop} | Boat: ${voteStringBoat}`,
        footerUrl: message.author.displayAvatarURL(),
        colour: client.statics.colours.tinker
    }));
});

module.exports = command;