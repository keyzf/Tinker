const { find_nested } = require("./utilFunctions");
const logger = require("./logger");

const event_files = find_nested("./custom_events", ".js");

let events = {}
event_files.forEach((file, i) => {
    const props = require(file);
    console.log(props)
    events[props.help.name] = props.run;
    logger.info(`${i + 1}: ${props.help.name} loaded!`);
});

// module.exports.eventManager = (eventName, ...args) => {
//     return new Promise(async(resolve, reject) => {
//         if (!events[eventName]) return reject(new Error("No such event"));
//         const result = await events[eventName].run(...args)
//         return resolve(result)
//     });
// }

module.exports = events