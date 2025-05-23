import {IRoleRepository} from "../../../../../core/domain/repositories/role/IRoleRepository.js";
import {dataSource} from "../../data-source/dataSource.js";

export class RoleRepository extends IRoleRepository {
    constructor() {
        super();
    }

    async deleteAll() {
        await dataSource
            .createQueryBuilder()
            .delete()
            .from('role_permissions_permission')
            .execute();

        await dataSource
            .createQueryBuilder()
            .update('user')
            .set({roleId: null})
            .execute();

        await dataSource.getRepository("Role")
            .createQueryBuilder()
            .delete()
            .execute();
    }

    async insertMany(roles) {
        const repo = dataSource.getRepository("Role");
        return await repo.save(repo.create(roles));
    }
}
