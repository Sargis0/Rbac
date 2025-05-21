import {PostgresConnection} from "./PostgresConnection.js";

export class PostgresDatabase {
    constructor(config) {
        this.connection = new PostgresConnection(config)
    }

    async connect() {
        await this.connection.connect();
    }

    async disconnect() {
        await this.connection.disconnect();
    }

    getConnection() {
        return this.connection.getConnection();
    }
}
