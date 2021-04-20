module.exports.setup = async(client) => {

    const localDB = require("node-localdb");
    const mariadb = require("mariadb");

    let db;
    if (process.env.NODE_ENV == "production") {
        db = await mariadb.createConnection({ socketPath: "/run/mysqld/mysqld.sock", user: "localRoot", database: "tinker" });
    } else {
        db = await mariadb.createConnection({
            host: "192.168.1.128",
            user: "tinkerClient",
            password: "theAgeOfInfo",
            database: "tinker"
        });
    }

    const quotesdb = localDB("./data/quotes.json");
    const errordb = localDB("./data/genErrors.json");
    const webuserdb = localDB("./data/webUsers.json");

    return { db, quotesdb, errordb, webuserdb };
}
