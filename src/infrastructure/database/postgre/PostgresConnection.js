import "reflect-metadata";
import {DataSource} from "typeorm";

export class PostgresConnection {
    constructor(config) {
        this.config = config;
        this.dataSource = null;
    }

    async connect() {
        this.dataSource = new DataSource(this.config);

        try {
            await this.dataSource.initialize();
            console.log("✅ Connected to PostgreSQL via TypeORM");
        } catch (error) {
            console.log("❌ PostgreSQL connection failed", error);
            process.exit(1);
        }
    }

    getConnection() {
        if (!this.dataSource && this.dataSource.initialized) {
            throw new Error("PostgreSQL not connected");
        }

        return this.dataSource;
    }

    async disconnect() {
        if (this.dataSource && this.dataSource.initialized) {
            await this.dataSource.destroy();
            console.log("🛑 PostgreSQL disconnected manually");
        }
    }
}
