import {EntitySchema} from "typeorm";

export const RefreshToken = new EntitySchema({
    name: "Token",
    tableName: "token",
    columns: {
        id: {
            primary: true,
            type: "uuid",
            generated: "uuid",
        },
        token: {
            type: "varchar",
            nullable: false,
        },
        expires_at: {
            type: "timestamp",
            nullable: true,
        },
        createdAt: {
            type: "timestamp",
            createDate: true,
        },
        updatedAt: {
            type: "timestamp",
            updateDate: true,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: true,
            nullable: false,
            eager: true,
        },
    },
});
