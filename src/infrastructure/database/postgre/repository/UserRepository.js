import {IUserRepository} from "../../../../core/domain/repositories/user/IUserRepository.js";
import {dataSource} from "../data-source/dataSource.js";

export class UserRepository extends IUserRepository {
    async deleteAll() {
        await dataSource.getRepository("User")
            .createQueryBuilder()
            .delete()
            .execute();
    }

    async saveAdmin(user) {
        const repo = dataSource.getRepository("User");
        if (user.role?.id) {
            user.roleId = user.role.id;
            delete user.role;
        }
        return await repo.save(repo.create(user));
    }

    async save(user) {
        const role = await dataSource.getRepository("Role").findOneBy({name: user.role});
        if (!role) throw new Error(`Role "${user.role}" not found.`);
        user.roleId = role.id;
        delete user.role;

        const repo = dataSource.getRepository("User");
        return await repo.save(repo.create(user));
    }

    async findByEmail(email) {
        await this._init();
        return await dataSource.getRepository("User").findOne({
            where: {email},
            relations: ["role", "role.permissions"]
        });
    }

    async findAll() {
        return await dataSource.getRepository("User").find({
            relations: ["role", "role.permissions"]
        });
    }

    async findUserById(id) {
        return await dataSource.getRepository("User").findOneBy({id});
    }

    async delete(userId) {
        await dataSource.getRepository("User").delete({id: userId});
    }

    async update(userId, data) {
        const repo = dataSource.getRepository("User");
        const user = await repo.findOne({where: {id: userId}, relations: ["role"]});
        if (!user) return null;

        if (data.role) {
            const role = await dataSource.getRepository("Role").findOneBy({name: data.role});
            if (!role) throw new Error(`Role "${data.role}" not found.`);
            user.role = role;
            delete data.role;
        }

        Object.assign(user, data);
        await repo.save(user);

        return await repo.findOne({where: {id: userId}, relations: ["role", "role.permissions"]});
    }

    async setRole(userId, roleName) {
        const repo = dataSource.getRepository("User");
        const role = await dataSource.getRepository("Role").findOneBy({name: roleName});

        if (!role) throw new Error(`Role "${roleName}" not found.`);

        const user = await repo.findOne({where: {id: userId}, relations: ["role"]});
        if (!user) return null;

        user.role = role;
        return await repo.save(user);
    }

    async findByResetToken(token) {
        return await dataSource.getRepository("User").findOne({
            where: {resetToken: token}
        })
    }

    async resetPassword(userId, hashedPassword) {
        await dataSource.getRepository("User").update(userId, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiration: null
        })
    }

    async resetPasswordByToken() {

    }

    async saveResetToken(userId, token) {
        const repo = dataSource.getRepository("User");
        await repo.update(userId, {
            resetToken: token,
            resetTokenExpiration: new Date(Date.now() + 360000)
        })
    }
}
