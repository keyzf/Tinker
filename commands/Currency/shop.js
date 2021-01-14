
module.exports.run = async(bot, message, args, dbGuild) => {
    // TODO: the wandering trader doesn't bring all items every day and prices fluctuate from day to day
};

module.exports.help = {
    name: 'shop',
    aliases: ["trader", "wanderingtrader"],
    description: "Strike a deal with a wandering trader",
    usage: "",
    cooldown: 2,
    limit: true
};