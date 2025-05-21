import {EntitySchema} from "typeorm";

export const PermissionTable = new EntitySchema({
    name: "Permission",
    tableName: "permission",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        action: {
            type: "varchar",
            nullable: false,
            unique: true,
        },
        description: {
            type: "text",
            nullable: true,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
        },
        updated_at: {
            type: "timestamp",
            updateDate: true,
        }
    },
    checks: [
        {
            expression: `"action" IN ('create_user', 'read_user', 'update_user', 'delete_user', 'set_role')`
        }
    ]
});
