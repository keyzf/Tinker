class DatabaseError extends Error {
    constructor(name, message, val) {
        super(`${message}${val ? " : \"" + val + "\"" : ""}`);
        this.name = name;
    }
}

class DBNotReadyError extends DatabaseError {
    constructor() {
        super("DATABASE_NOT_READY", "The database handler has not yet established a connection and built local schema");
    }
}

class NoConditionsError extends DatabaseError {
    constructor() {
        super("NO_CONDITIONS_PROVIDED", "Conditions must be provided for this command");
    }
}

class NoFieldDataError extends DatabaseError {
    constructor() {
        super("NO_FIELD-DATA_PROVIDED", "Field data must be provided for this command");
    }
}

module.exports = {
    DatabaseError,
    DBNotReadyError,
    NoConditionsError,
    NoFieldDataError
}