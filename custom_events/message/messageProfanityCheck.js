const { Profanity, ProfanityOptions } = require("@2toad/profanity");
const whitelist  = require("../../data/swearWhitelist.json");
const blacklist = require("../../data/swearBlacklist.json");
let profanity;

module.exports.setup = async() => {
    const options = new ProfanityOptions();
    options.wholeWord = false;
    options.grawlix = '⁎⁎⁎⁎';
    profanity = new Profanity(options);

    profanity.addWords(blacklist);
    profanity.removeWords(whitelist);

    // words that are always ignored
    // useful for when whole word is false so arsenic doesn't get flagged for arse
   profanity.whitelist.addWords(whitelist);

}

module.exports.run = async(message, dbGuild) => {
    // if (profanity.exists(message.content)) return profanity.censor(message.content)
    return null
}

module.exports.help = {
    name: "messageProfanityCheck"
}