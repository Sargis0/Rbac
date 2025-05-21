import {EntitySchema} from "typeorm";

export const UserTable = new EntitySchema({
    name: "User",
    tableName: "user",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid"
        },
        name: {
            type: "varchar",
            nullable: false
        },
        surname: {
            type: "varchar",
            nullable: false
        },
        phone_number: {
            type: "varchar",
            nullable: false,
        },
        email: {
            type: "varchar",
            nullable: false,
            unique: true,
        },
        password: {
            type: "varchar",
            nullable: false,
            length: 64
        },
        roleId: {
            type: "uuid",
            nullable: false,
            name: "role_id"
        },
        resetToken: {
            type: "varchar",
            nullable: true,
        },
        resetTokenExpiration: {
            type: "timestamp",
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
    relations: {
        role: {
            type: "many-to-one",
            target: "Role",
            joinColumn: {
                name: "role_id",
                referencedColumnName: "id"
            },
            nullable: false,
            eager: true
        }
    },
    checks: [
        {expression: `"name" ~ '^[a-zA-Z]+$'`},
        {expression: `"surname" ~ '^[a-zA-Z]+$'`},
        {expression: `"phone_number" ~ '^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\\s\\./0-9]*$'`},
        {expression: `"email" ~* '^\\w+([\\.-]?\\w+)*@\\w+([\\.-]?\\w+)*(\\.\\w{2,3})+$'`},
        {expression: `"password" ~ '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'`},
    ]
});
