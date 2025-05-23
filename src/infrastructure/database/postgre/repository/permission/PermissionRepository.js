import {IPermissionRepository} from "../../../../../core/domain/repositories/Permission/IPermissionRepository.js";
import {dataSource} from "../../data-source/dataSource.js";

export class PermissionRepository extends IPermissionRepository {
    async deleteAll() {
        await dataSource.getRepository("Permission")
            .createQueryBuilder()
            .delete()
            .execute();
    }

    async insertMany(permissions) {
        const repo = dataSource.getRepository("Permission");
        return await repo.save(repo.create(permissions));
    }
}
