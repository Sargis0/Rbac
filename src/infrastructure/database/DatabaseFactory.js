import {PostgresDatabase} from "./postgre/PostgresDatabase.js";

export class DatabaseFactory {
    static create(config) {
        switch (config.type) {
            case "postgres":
                return new PostgresDatabase(config);
            default:
                throw new Error(`Unsupported database type: ${config.type}`);
        }
    }
}
