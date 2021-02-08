const Operation = require(`../structures/Operation`);
const op = new Operation();

op.setInfo({
    name: "update"
});

op.setExecute(async(client) => {
    await client.operations.get("wanderingWorker")();
    return;
});

module.exports = op;