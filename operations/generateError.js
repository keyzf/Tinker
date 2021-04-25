const Operation = require("../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "generateError"
});

const util = require("util");

op.setExecute(async(client, err, userMsg, data) => {
    const { _id } = typeof err == "string" ? await client.data.errordb.insert({error: err, timestamp: Date.now(), userMsg, data}) : await client.data.errordb.insert({error: util.inspect(err, {promise: false, depth: null}), timestamp: Date.now(), userMsg, data});;
    const embed = client.operations.generateEmbed.run({
        fields: [
            { name: "Error Code", value: _id ? `Give this code to one of our support staff \`\`\`${_id}\`\`\`` : "No error code associated with this error"},
            { name: "Support Server", value: client.config.officialServer.invite }
        ],
        description: userMsg || "This error has no user visible message",
        author: "Tinkerror",
        authorUrl: "./res/TinkerDead.png",
        colour: client.statics.colours.tinker
    })
    return embed;
});
module.exports = op;
