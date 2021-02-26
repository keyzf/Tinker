const Operation = require("../structures/Operation");
const op = new Operation();

op.setInfo({
    name: "checkVote"
});

const axios = require("axios");

const baseUrl = "https://top.gg/api/bots/710141775808954389/check/"

/**
 * @returns Boolean - true when user has voted, false when user has not voted (null on error)
 */
op.setExecute(async(client, userId) => {
    try {
        const { data } = await axios({
            method: "get",
            url: `${baseUrl}?userId=${userId}`,
            headers: { accept: "application/json" }
        });
        return data.voted ? true : false
    } catch (err) {
        client.logger.error(err);
        await client.operations.generateError.run(err, "Error getting/parsing Top.gg vote");
        return null;
    }
});

module.exports = op;