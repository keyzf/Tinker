const { errordb } = require("../lib/db");
const { officialServerInvite } = require("../config/config.json");
const util = require("util");
const generateDefaultEmbed = require("../util/generateDefaultEmbed");

module.exports.run = async (err, userMsg) => {
    const { _id } = await errordb.insert({error: util.inspect(err, {promise: false, depth: null}), timestamp: Date.now(), userMsg});
    const embed = generateDefaultEmbed({
        title: "Whoops, an error occurred",
        description: "Chances are underneath me is a code, take that to the support server and get some help",
        fields: [
            { name: "Here's what we know already", value: userMsg },
            { name: "Error Code", value: _id || "No error code associated with this error"},
            { name: "Support Server", value: officialServerInvite }
        ]
    })
    return embed;
}

module.exports.help = {
    name: "generateError"
}