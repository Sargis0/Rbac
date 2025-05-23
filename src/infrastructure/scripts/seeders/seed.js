import "dotenv/config";
import {dataSource} from "../../database/postgre/data-source/dataSource.js";

import {PermissionSeeder} from "../../../core/application/seeders/PermissionSeeder.js";
import {RoleSeeder} from "../../../core/application/seeders/RoleSeeder.js";
import {SuperAdminSeeder} from "../../../core/application/seeders/SuperAdminSeeder.js";

import {PermissionRepository} from "../../database/postgre/repository/permission/PermissionRepository.js";
import {RoleRepository} from "../../database/postgre/repository/role/RoleRepository.js";
import {UserRepository} from "../../database/postgre/repository/user/UserRepository.js";

import {BcryptPasswordHash} from "../../services/bcrypt/BcryptPasswordHasher.js";

const run = async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();

    try {
        await queryRunner.startTransaction();

        const permissionRepository = new PermissionRepository();
        const roleRepository = new RoleRepository();
        const userRepository = new UserRepository();
        const passwordHasher = new BcryptPasswordHash();

        await userRepository.deleteAll();
        await roleRepository.deleteAll();
        await permissionRepository.deleteAll();

        const permissionSeeder = new PermissionSeeder(permissionRepository);
        const permissions = await permissionSeeder.seed();

        const permissionMap = {};
        permissions.forEach(p => {
            permissionMap[p.action] = p;
        });

        const roleSeeder = new RoleSeeder(roleRepository, permissionMap);
        const roleMap = await roleSeeder.seed();

        const superAdminSeeder = new SuperAdminSeeder(
            userRepository,
            passwordHasher,
            {
                name: process.env.NAME,
                surname: process.env.SURNAME,
                email: process.env.EMAIL,
                phone_number: process.env.PHONE_NUMBER,
                password: process.env.PASSWORD,
            },
            roleMap["super_admin"]
        );

        await superAdminSeeder.seed();

        await queryRunner.commitTransaction();
        console.log("🎉 Seeding completed successfully");
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    } finally {
        await queryRunner.release();
        process.exit(0);
    }
}

run();
