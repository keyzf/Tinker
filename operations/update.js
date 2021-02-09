const Operation = require(`../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "update"
});

op.setExecute(async(client) => {
    return;
});

module.exports = op;