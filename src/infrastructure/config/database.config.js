import {UserTable} from "../database/postgre/tables/User.js";
import {PermissionTable} from "../database/postgre/tables/Permission.js";
import {RoleTable} from "../database/postgre/tables/Role.js";
import {RefreshToken} from "../database/postgre/tables/Token.js";

export const postgreConfig = {
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: parseInt(process.env.POSTGRES_PORT),
    username: process.env.POSTGRES_USERNAME,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DATABASE,
    synchronize: true,
    logging: false,
    entities: [UserTable, PermissionTable, RoleTable, RefreshToken]
}
