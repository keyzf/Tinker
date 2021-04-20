const Command = require(`../structures/Command`);
const command = new Command();

command.setInfo({
    name: "covid",
    aliases: ["c19", "covid19", "covid-19", "c-19"],
    category: "Stats",
    description: "Get stats about Covid-19",
    usage: "[country]"
});

command.setLimits({
    cooldown: 5
});

command.setPerms({
    userPermissions: [],
    botPermissions: [],
    globalUserPermissions: ["user.command.stats.covid"],
    memberPermissions: ["command.stats.covid"]
});

command.registerSubCommand(`${__dirname}/covid/all`);

const fetch = require("node-fetch");
const { MessageEmbed } = require("discord.js");

command.setExecute(async(client, message, args, cmd) => {
    if (args[0]) {
        fetch(`https://disease.sh/v3/covid-19/countries/${args[0]}?allowNull=1`, {
                headers: { 'Accept': 'application/json' }
            })
            .then((response) => response.json())
            .then((json) => {
                if (json.message) {
                    return message.channel.send(json.message);
                }

                const embed = new MessageEmbed();
                embed.setTitle(`Covid Stats - ${json.country}`)
                embed.addFields({ name: "Population", value: json.population ? json.population.toLocaleString() : "No data could be found for this stat", inline: true }, { name: "\u200B", value: "\u200B", inline: true }, { name: "\u200B", value: "\u200B", inline: true },

                    { name: "Cases", value: json.cases ? json.cases.toLocaleString() : "No data could be found for this stat", inline: true }, { name: "Today's Cases", value: json.todayCases ? json.todayCases.toLocaleString() : "No data could be found for this stat", inline: true }, { name: "\u200B", value: "\u200B", inline: true },

                    { name: "Deaths", value: json.deaths ? json.deaths.toLocaleString() : "No data could be found for this stat", inline: true }, { name: "Today's Deaths", value: json.todayDeaths ? json.todayDeaths.toLocaleString() : "No data could be found for this stat", inline: true }, { name: '\u200B', value: '\u200B', inline: true },

                    { name: "Recovered", value: json.recovered ? json.recovered.toLocaleString() : "No data could be found for this stat", inline: true }, { name: "Today's Recovered", value: json.todayRecovered ? json.todayRecovered.toLocaleString() : "No data could be found for this stat", inline: true }, { name: '\u200B', value: '\u200B', inline: true }
                )
                embed.setFooter(`Last updated: ${json.updated ? new Date(json.updated).toLocaleString() : "No data could be found for this stat"}`)
                message.channel.send(embed)
            })
            .catch(async({ stack }) => {
                client.logger.error(stack, { channel: message.channel, content: message.content, origin: __filename });
                message.channel.stopTyping();
                return await message.channel.send(await client.operations.generateError.run(stack, "Error getting covid stats", { channel: message.channel, content: message.content, origin: __filename }));
            });
    } else {
        command.findSubcommand("all").run(message, args.slice(1, args.length), cmd);
    }
});

module.exports = command;