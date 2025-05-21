import {EntitySchema} from "typeorm";

export const RoleTable = new EntitySchema({
    name: "Role",
    tableName: "role",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        name: {
            type: "varchar",
            nullable: false,
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        }
    },
    relations: {
        permissions: {
            type: "many-to-many",
            target: "Permission",
            joinTable: true,
            eager: true,
        }
    },
    checks: [
        {
            expression: `"name" IN ('super_admin', 'admin', 'user')`
        }
    ]
});
