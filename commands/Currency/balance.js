const generateDefaultEmbed = require("../../util/generateDefaultEmbed");
const { db, Fields } = require("../../lib/db");

module.exports.run = async (bot, message, args, dbGuild) => {
    let target = message.guild.member(message.mentions.users.first()) || message.guild.members.cache.get(args[0]) || message.guild.members.cache.get(message.author.id);
    // message.channel.send(`target user is ${target.user.username}`);
    if (!target) return message.reply('please specify a user!');
    let dbTarget = db.prepare(`SELECT * FROM users WHERE ${Fields.UserFields.guildID}='${dbGuild.guildID}' AND ${Fields.UserFields.userID}=${target.id}`).get();
    // message.channel.send(`target userID is ${dbTarget.userID} from guild ${dbGuild.guildID}`);
    if (!dbTarget) return message.reply('could not find user!');
    message.channel.send(generateDefaultEmbed({title:"Scrap Value", description: dbTarget.currencyUnits}))
};

module.exports.help = {
    name: 'balance',
    aliases: ["toolbox", "checkbalance", "bal"],
    description: "Check how much money you have",
    usage: "",
    cooldown: 1,
    limit: true
};