const Operation = require("../..//structures/Operation");
const op = new Operation();

op.setInfo({
    name: "dmConversation"
});

const NLP = require("../../structures/NLP");

const nlpProcessor = new NLP("./data/NLP/corpus-en.json");
process.env.NODE_ENV === "production" ? nlpProcessor.train() : null;

op.setExecute(async(client, message) => {
    // TODO: strip mentions (and possibly markdown)
    message.channel.startTyping();
    const now = process.hrtime()[0];
    const messageText = await nlpProcessor.rebuildWithLemma(message.content);

    const responseObj = await nlpProcessor.getResponse(messageText);
    const after = process.hrtime()[0];
    let time = responseObj.answer.length * 0.08;
    time -= (after - now);
    if (time > 0) {
        await client.utility.sleep(time * 1000);
    }
    message.channel.send(responseObj.answer);
    message.channel.stopTyping();

    // message.channel.send(responseObj.classifications.slice(0, 3).map((cl) => `${cl.intent}:${cl.score.toFixed(2).toString()}`).join(", "), { code: "xl" })
});

module.exports = op;
