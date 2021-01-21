const { errordb } = require("../lib/db");
const { officialServerInvite } = require("../config/config.json");
const util = require("util");
const generateDefaultEmbed = require("../util/generateDefaultEmbed");

module.exports.run = async (err, userMsg) => {
    const { _id } = await errordb.insert({error: util.inspect(err, {promise: false, depth: null}), timestamp: Date.now(), userMsg});
    const embed = generateDefaultEmbed({
        title: "Whoops, an error occurred",
        description: "Some sort of error occurred with the bot. It might have been your fault, it was most likely mine\nChances are underneath me is a code, take that to the support server and get some help",
        fields: [
            { name: "Here's what we can tell you now", value: userMsg },
            { name: "Error Code", value: _id},
            { name: "Support Server", value: officialServerInvite}
        ]
    })
    return embed;
}

module.exports.help = {
    name: "generateError"
}