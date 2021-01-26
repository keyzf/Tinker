const { errordb } = require("../lib/db");
const { officialServerInvite } = require("../config/config.json");
const util = require("util");
const generateDefaultEmbed = require("../util/generateDefaultEmbed");

module.exports.run = async (bot, err, userMsg) => {
    const { _id } = await errordb.insert({error: util.inspect(err, {promise: false, depth: null}), timestamp: Date.now(), userMsg});
    const embed = generateDefaultEmbed({
        fields: [
            { name: "Error Code", value: `Give this code to one of our support staff \`\`\`${_id}\`\`\`` || "No error code associated with this error"},
            { name: "Support Server", value: officialServerInvite }
        ],
        description: userMsg || "This error has no user visible message",
        author: "Tinkerror",
        authorUrl: "./res/iconError.png"
    })
    return embed;
}

module.exports.help = {
    name: "generateError"
}