const Command = require(`../../structures/Command`);
const cmd = new Command();

cmd.setInfo({
    name: "all",
    aliases: [],
    category: "Stats",
    description: "Shows global statistics",
    usage: ""
});

cmd.setLimits({
    cooldown: 3,
    limited: false
});

cmd.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.covid.all"],
    memberPermissions: ["command.covid.all"]
});

const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

cmd.setExecute(async(client, message, args, cmd) => {
    fetch(`https://disease.sh/v3/covid-19/all?allowNull=1`, {
            headers: { 'Accept': 'application/json' }
        })
        .then((response) => response.json())
        .then((json) => {
            const embed = new MessageEmbed();
            embed.setTitle("Covid Stats - All")
            embed.addFields(
                { name: "Cases", value: json.cases.toLocaleString(), inline: true },
                { name: "Today's Cases", value: json.todayCases.toLocaleString(), inline : true },
                { name: "\u200B", value: "\u200B", inline : true },
                { name: "Deaths", value: json.deaths.toLocaleString(), inline: true },
                { name: "Today's Deaths", value: json.todayDeaths.toLocaleString(), inline: true },
                { name: '\u200B', value: '\u200B', inline : true },
                { name: "Recovered", value: json.recovered.toLocaleString(), inline: true },
                { name: "Today's Recovered", value: json.todayRecovered.toLocaleString(), inline: true },
                { name: '\u200B', value: '\u200B', inline : true }
            )
            embed.setFooter(`Last updated: ${new Date(json.updated).toLocaleString()}`)
            message.channel.send(embed)
        })
        .catch(async(err) => {
            client.logger.error(err, { channel: message.channel, content: message.content });
            message.channel.stopTyping();
            return await message.channel.send(await client.operations.generateError.run(e, "Error getting Covid stats, this is likely an issue with an external API"));
        });

});

module.exports = cmd;
