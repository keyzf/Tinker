const mariadb = require("mariadb");
const Discord = require("discord.js");
const {DBNotReadyError, NoConditionsError, NoFieldDataError} = require("./Errors");

/**
 * @typedef {Object} HandlerOptions
 * @property {Function} verbose called on every sql query
 */

/**
 * @typedef {Array.<string>} Conditions
 */

/**
 *
 * @typedef {Object} GetQuery
 * @property {String} table name of the table this query is referring to
 * @property {Array.<string>} fields fields requested
 * @property {Conditions} [conditions conditions of the query]
 * @property {queryOptions} [queryOptions options passed directly to maria in a query call]
 */

/**
 *
 * @typedef {Object} SetQuery
 * @property {String} table name of the table this query is referring to
 * @property {Object} field_data field and data, where the key is the field and the value is the corresponding data
 * @property {Conditions} [conditions conditions of the query]
 * @property {queryOptions} [queryOptions options passed directly to maria in a query call]
 */

/**
 *
 * @typedef {Object} InsertQuery
 * @property {String} table name of the table this query is referring to
 * @property {Object} field_data field and data, where the key is the field and the value is the corresponding data
 * @property {queryOptions} [queryOptions options passed directly to maria in a query call]
 */

/**
 *
 * @typedef {Object} DeleteQuery
 * @property {String} table name of the table this query is referring to
 * @property {Conditions} conditions conditions of the query
 * @property {queryOptions} [queryOptions options passed directly to maria in a query call]
 */

class Database {

    /**
     *
     * @param {Discord.Client} client
     * @param {HandlerOptions} handlerOpts
     * @param connOpts
     */
    constructor(client, handlerOpts, connOpts) {
        this.ready = false;
        this.client = client;

        this.handlerOptions = handlerOpts;
        this.connOptions = connOpts;

        this.tables = {};
        this.setup();
    }

    async setup() {
        await this.createConnection();
        this.ready = true;
    }

    async createConnection() {
        this.connection = await mariadb.createConnection({
            ...this.connOptions
        });
    }

    /**
     *
     * @param {GetQuery} getQuery
     * @returns {Promise<unknown>}
     */
    get({table, fields, conditions, queryOptions}) {
        return new Promise(async (resolve, reject) => {
            const result = await this.sql_run(`SELECT ${fields.join(", ")} FROM ${table} ${conditions ? `WHERE ${conditions.join(" AND ")}` : ""}`, [], queryOptions).catch(reject);
            resolve(result);
        });
    }

    /**
     *
     * @param {GetQuery} getQuery
     * @returns {Promise<unknown>}
     */
    getOne({table, fields, conditions, queryOptions}) {
        return new Promise(async (resolve, reject) => {
            const result = await this.sql_run(`SELECT ${fields.join(", ")} FROM ${table} ${conditions ? `WHERE ${conditions.join(" AND ")}` : ""}`, [], queryOptions).catch(reject);
            resolve({...result[0], meta: result.meta});
        });
    }

    /**
     *
     * @param {SetQuery} setQuery
     * @returns {Promise<unknown>}
     */
    set({table, field_data, conditions}) {
        return new Promise(async (resolve, reject) => {
            if (!field_data) {
                reject(new NoFieldDataError())
            }
            const fields = Object.keys(field_data);
            const vals = Object.values(field_data);
            const res = await this.sql_run(
                `UPDATE ${table} SET ${fields.map((f) => `${f}=?`).join(", ")} ${conditions ? `WHERE ${conditions.join(" AND ")}` : ""}`,
                vals
            ).catch(reject);
            resolve(res);
        });
    }

    /**
     *
     * @param {InsertQuery} insertQuery
     * @returns {Promise<unknown>}
     */
    insert({table, field_data}) {
        return new Promise(async (resolve, reject) => {
            const fields = Object.keys(field_data);
            const vals = Object.values(field_data);
            const res = await this.sql_run(`INSERT INTO ${table} (${fields.join(", ")}) VALUES (${vals.map((_) => "?").join(", ")})`,
                vals
            ).catch(reject);
            resolve(res);
        });
    }

    /**
     *
     * @param {DeleteQuery} deleteQuery
     * @returns {Promise<unknown>}
     */
    delete({table, conditions}) {
        return new Promise(async (resolve, reject) => {
            if (!conditions) {
                reject(new NoConditionsError())
            }
            const res = await this.sql_run(`DELETE FROM ${table} WHERE ${conditions.join(" AND ")}`).catch(reject);
            resolve(res);
        });
    }

    sql_run(sqlString, sqlValues = [], queryOptions) {
        return new Promise(async (resolve, reject) => {
            if (!this.ready) {
                reject(new DBNotReadyError());
            }
            // TODO: verbose logging of sql commands
            // this.handlerOptions.verbose(sqlString);
            this.connection.query(
                {
                    sql: sqlString,
                    ...queryOptions
                },
                [...sqlValues]
            ).then((res) => {
                resolve(res)
            }).catch((err) => {
                reject(err)
            });
        });
    }

    ping() {
        if (!this.ready) {
            throw new DBNotReadyError()
        }
        return new Promise(async (resolve, reject) => {
            this.connection.ping()
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    //connection is closed
                    reject(err);
                });
        });
    }

    close() {
        if (!this.ready) {
            throw new DBNotReadyError()
        }
        return new Promise(async (resolve, reject) => {
            this.connection.end()
                .then(() => {
                    resolve();
                })
                .catch(err => {
                    //connection is closed
                    reject(err);
                });
        });
    }

}

module.exports = Database;

