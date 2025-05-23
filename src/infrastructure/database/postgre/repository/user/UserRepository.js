import {IUserRepository} from "../../../../../core/domain/repositories/user/IUserRepository.js";
import {dataSource} from "../../data-source/dataSource.js";

export class UserRepository extends IUserRepository {
    #getRepo(name = "User") {
        return dataSource.getRepository(name);
    }

    async #attachRoleId(user) {
        const role = await this.#getRepo("Role").findOneBy({name: user.role});
        if (!role) throw new Error(`Role "${user.role}" not found.`);
        user.roleId = role.id;
        delete user.role;
    }

    async #createUserWithRoleId(user) {
        await this.#attachRoleId(user);
        const repo = this.#getRepo();
        return await repo.save(repo.create(user));
    }

    async deleteAll() {
        await this.#getRepo().createQueryBuilder().delete().execute();
    }

    async saveAdmin(user) {
        const repo = this.#getRepo();
        if (user.role?.id) {
            user.roleId = user.role.id;
            delete user.role;
        }
        return await repo.save(repo.create(user));
    }

    async save(user) {
        return await this.#createUserWithRoleId(user);
    }

    async findByEmail(email) {
        return await this.#getRepo().findOne({
            where: {email},
            relations: ["role", "role.permissions"]
        });
    }

    async findRoleByName(roleName) {
        return await this.#getRepo("Role").findOneBy({name: roleName});
    }

    async findAll() {
        return await this.#getRepo().find({
            relations: ["role", "role.permissions"]
        });
    }

    async findById(id) {
        return await this.#getRepo().findOne({
            where: {id},
            relations: ["role", "role.permissions"]
        });
    }

    async delete(userId) {
        return await this.#getRepo().delete({id: userId});
    }

    async update(userId, data) {
        const repo = this.#getRepo();
        const user = await repo.findOne({where: {id: userId}, relations: ["role"]});
        if (!user) return null;

        Object.assign(user, data);
        await repo.save(user);

        return await repo.findOne({where: {id: userId}, relations: ["role", "role.permissions"]});
    }

    async findByResetToken(token) {
        return await this.#getRepo().findOne({
            where: {resetToken: token}
        });
    }

    async resetPassword(userId, hashedPassword) {
        await this.#getRepo().update(userId, {
            password: hashedPassword,
            resetToken: null,
            resetTokenExpiration: null
        });
    }

    async saveResetToken(userId, token) {
        const repo = this.#getRepo();
        const user = await repo.findOneBy({id: userId});
        if (!user) throw new Error("User not found");

        user.resetToken = token;
        user.resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000);
        await repo.save(user);
    }
}
