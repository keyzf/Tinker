const Operation = require("../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "generateError"
});

const util = require("util");

op.setExecute(async(client, err, userMsg, data) => {
    const { _id } = await client.data.errordb.insert({error: util.inspect(err, {promise: false, depth: null}), timestamp: Date.now(), userMsg, data});
    const embed = client.operations.generateDefaultEmbed.run({
        fields: [
            { name: "Error Code", value: `Give this code to one of our support staff \`\`\`${_id}\`\`\`` || "No error code associated with this error"},
            { name: "Support Server", value: client.config.officialServer.invite }
        ],
        description: userMsg || "This error has no user visible message",
        author: "Tinkerror",
        authorUrl: "./res/TinkerSad.png"
    })
    return embed;
});
module.exports = op;
