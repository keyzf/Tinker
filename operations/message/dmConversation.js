const Operation = require("../..//structures/Operation");
const op = new Operation();

op.setInfo({
    name: "dmConversation"
});

const NLP = require("../../structures/NLP");

const nlpProcessor = new NLP("./data/corpus-en.json")
nlpProcessor.train();

op.setExecute(async(client, message) => {
    // todo: strip mentions (and possibly markdown)
    message.channel.startTyping();
    const now = process.hrtime()[0];
    const responseObj = await nlpProcessor.getResponse(message.content);
    const after = process.hrtime()[0];
    let time = responseObj.answer.length * 0.08;
    time -= (after - now);
    if (time > 0) {
        await client.utility.sleep(time * 1000);
    }
    message.channel.send(responseObj.answer);
    // message.channel.send(responseObj.classifications.slice(0, 3).map((cl) => `${cl.intent}:${cl.score.toFixed(2).toString()}`).join(", "), { code: "xl" })
    message.channel.stopTyping();
});

module.exports = op;

// template
/*
{
  locale: 'en',
  utterance: 'My name is Chantelle, what is yours',
  settings: undefined,
  languageGuessed: false,
  localeIso2: 'en',
  language: 'English',
  nluAnswer: {
    classifications: [
      [Object], [Object],
      [Object], [Object],
      [Object], [Object],
      [Object]
    ],
    entities: undefined,
    explanation: undefined
  },
  classifications: [
    { intent: 'agent.name', score: 0.6142279953594376 },
    { intent: 'agent.acquaintance', score: 0.29612739490189577 },
    { intent: 'dialog.sorry', score: 0.04266508174674273 },
    { intent: 'appraisal.welcome', score: 0.037293903752819026 },
    { intent: 'None', score: 0.006260753195378951 },
    { intent: 'user.needsadvice', score: 0.0028718900038426833 },
    { intent: 'agent.myfriend', score: 0.0005529810398832528 }
  ],
  intent: 'agent.name',
  score: 0.6142279953594376,
  domain: 'default',
  entities: [],
  sourceEntities: [],
  answers: [
    { answer: 'My name is Tinker', opts: undefined },
    { answer: 'You can call me Tinker', opts: undefined },
    { answer: 'Tinker be me!', opts: undefined }
  ],
  answer: 'Tinker be me!',
  actions: [],
  sentiment: {
    score: 0,
    numWords: 0,
    numHits: 0,
    average: 0,
    type: undefined,
    locale: 'en',
    vote: 'neutral'
  }
}
*/