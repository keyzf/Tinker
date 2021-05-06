'use strict'

const Command = require("../structures/Command");
const command = new Command();

command.setInfo({
    name: "noughtsandcrosses",
    aliases: ["tictactoe"],
    category: "Fun",
    description: "Play noughts and crosses with someone in the channel",
    usage: ""
});

command.setLimits({
    cooldown: 10
});

command.setPerms({
    botPermissions: ["MANAGE_MESSAGES", "ADD_REACTIONS"],
    userPermissions: [],
    globalUserPermissions: ["user.command.fun.noughtsandcrosses"],
    memberPermissions: ["command.fun.noughtsandcrosses"]
});

const NoughtsAndCrosses = require("../structures/games/NoughtsAndCrosses");

command.setExecute(async(client, message, args, cmd) => {
    const msg = await message.channel.send(client.operations.generateEmbed.run({
        title: "Noughts and Crosses",
        description: `Please wait, setting up`,
        colour: client.statics.colours.tinker
    }));

    try {
        const { winner, loser } = new NoughtsAndCrosses(client, message, msg, message.author);
    } catch ({ stack }) {
        client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename })
        return message.channel.send(await client.operations.generateError.run(stack, "Uncaught Error in Noughts and Crosses", { channel: message.channel, content: message.content, origin: __filename }));
    }
});

module.exports = command;