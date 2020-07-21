const { db } = require("../../lib/db")
const logger = require("../../lib/logger");
const { MessageEmbed } = require("discord.js");
const util = require('util')

module.exports.run = async(bot, message, args) => {

    // const e = new MessageEmbed();
    // e.setFooter(`Requested by: ${message.author.tag}`, message.author.displayAvatarURL());
    // e.setColor("#a700bd")
    // e.setTimestamp()

    if (args[0] == "SELECT") {
        let output = []
        const info = db.prepare(args.join(" ")).all();
        for (obj in info){
            output.push(`[${obj}] ${util.inspect(info[obj], {showHidden: false, depth: null, breakLength: Infinity, compact: true})}`);
        }
        message.channel.send(`\`\`\`js\n${output.join("\n")}\`\`\``);
    } else {
        let hrstart = process.hrtime();
        const info = db.prepare(args.join(" ")).run();
        let hrend = process.hrtime(hrstart)
        message.channel.send(`DB Changes: **${info.changes}**, taking **${hrend[0]}s ${hrend[1] / 1000000}ms** to complete`);
    }


};

module.exports.help = {
    name: "sql",
    aliases: ["db"],
    description: "",
    usage: "",
    cooldown: 5,
    limit: true,
    generated: true
};