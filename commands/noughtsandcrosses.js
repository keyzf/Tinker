const Command = require("../structures/Command");
const cmd = new Command();

cmd.setInfo({
    name: "noughtsandcrosses",
    aliases: ["tictactoe"],
    category: "Fun",
    description: "Play noughts and crosses with someone in the channel",
    usage: ""
});

cmd.setLimits({
    cooldown: 10,
    limited: false
});

cmd.setPerms({
    botPermissions: [],
    userPermissions: []
});

const NoughtsAndCrosses = require("../structures/games/NoughtsAndCrosses");

cmd.setExecute(async(client, message, args, cmd) => {
    const msg = await message.channel.send(client.operations.generateDefaultEmbed.run({
        title: "Noughts and Crosses",
        description: `Please wait, setting up`
    }));
    
    const winner =  new NoughtsAndCrosses(client, message, msg, message.author);

});

module.exports = cmd;