import {DataSource} from "typeorm";
import {postgreConfig} from "../../../config/database.config.js";

const dataSource = new DataSource(postgreConfig);

await dataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!");
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err);
    });

export {dataSource};
