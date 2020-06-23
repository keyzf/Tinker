const logger = require("./logger.js");
const { connect, set } = require("mongoose");
const config = require("../config/config.json");

module.exports.setup = async () => {
    // set("debug", true)
    logger.log("info", "attempting mongoose connection")
    // net start MongoDB
    // net stop MongoDB
    await connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    });
    logger.log("info", "connection established")

}

const { Schema, model } = require("mongoose");

const Guild = Schema({
    name: String,
    id: String,
    dashId: String,
    preferences: { type: Object, default: {
            description: String,
            profanityFilter: Boolean,
            preventSpam: Boolean,
            spamSettings: {ignoredChannels: [], ignoredPrefixes: []},
            messageRewards: Boolean,
            rewardSettings: {ignoredChannels: []}
        }
    },
    prefix: { default: config.prefix, type: String },
    roles: {
        type: Array, default:
            [{
                name: String,
                id: String,
                cmdAccess: [{
                    name: String
                }]
            }]
    },
    users: {
        type: Array, default:
            [{
                id: String,
                messagesSent: Number,
                infractions: Number,
                devPoints: Number,
                level: Number
            }]
    }
});

module.exports.Guild = model("Guild", Guild)


// Guild.watch().
//     on('change', data => console.log(new Date(), data));
