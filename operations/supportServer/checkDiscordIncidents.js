const Operation = require("../../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "checkDiscordIncidents"
});

const baseUrl = "https://srhpyqt94yxb.statuspage.io/api/v2/";
const endUrl = ".json"
const parts = {
    allIncidents: "incidents"
}

const convertTZ = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", { timeZone: "America/Tijuana" });
}

const statusTypes = {
    investigating: "investigating",
    identified: "identified",
    monitoring: "monitoring",
    resolved: "resolved",
    scheduled: "scheduled",
    in_progress: "in_progress",
    verifying: "verifying",
    completed: "completed"
}

const statusTypeToEmojiName = {
    completed: "onlineRecovered",
    resolved: "onlineRecovered",
    identified: "outage",
    in_progress: "partialOutage",
    investigating: "partialOutage",
    verifying: "partialOutage",
    monitoring: "recoveringMonitoring",
    scheduled: "offline"
}

const axios = require("axios");

op.setExecute(async(client) => {
    const genEmbed = (inc) => {
        let fields = []
        if (inc.incident_updates) {
            inc.incident_updates.forEach((update) => {
                const name = `${client.data.emojis.status[statusTypeToEmojiName[update.status]]} ${client.utility.string.capitalize(update.status)} (${convertTZ(update.created_at)})`
                const value = update.body;
                fields.push({ name, value });
            });
        }
        return client.operations.generateEmbed.run({
            author: "Discord Status",
            authorUrl: "https://images-ext-1.discordapp.net/external/XfGS-yR9XzpKCUHSMJFjMa7cnn93VljpCt6tq0gROeM/https/discord.com/assets/2c21aeda16de354ba5334551a883b481.png",
            authorLink: "https://discordstatus.com/",
            description: `[${inc.name}](${inc.shortlink})`,
            fields,
            footerText: "Started",
            timestamp: true,
            colour: client.statics.colours.tinker
        });
    }

    axios({
        method: "get",
        url: `${baseUrl}${parts.allIncidents}${endUrl}`,
        headers: { accept: "application/json" }
    }).then(async({ data }) => {
        const incidents = data.incidents;
        for (let i = 0; i < incidents.length; i++) {
            const inc = incidents[i];
            const dbIncident = client.data.db.prepare("SELECT * FROM discordStatus WHERE incidentID=?").get(inc.id);

            if (dbIncident != null && dbIncident.ignore) { return; }

            const statusChannel = await client.channels.fetch(client.config.config.discordStatusChannel);
            if (dbIncident != null && dbIncident.messageID) {
                const message = await statusChannel.messages.fetch(dbIncident.messageID);
                await message.edit(genEmbed(inc));
                // check if resolved and update ignore
                if (inc.status == statusTypes.resolved || inc.status == statusTypes.completed) {
                    client.data.db.prepare("UPDATE discordStatus SET ignore=? WHERE incidentID=?").run(1, inc.id);
                }
            } else {
                const msg = await statusChannel.send(genEmbed(inc));
                client.data.db.prepare("INSERT INTO discordStatus(incidentID, messageID, ignore) VALUES(?, ?, ?)").run(inc.id, msg.id, 0);
                if (statusChannel.type == "news") { msg.crosspost(); }
            }
        }

    }).catch(async({stack}) => {
        client.logger.error(stack, {origin: __filename})
        return await client.operations.generateError.run(stack, "Error getting/parsing Discord Incident");
    });
});

module.exports = op;