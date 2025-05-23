import {NotFoundError} from "../../../../../infrastructure/interface/errors/ApiError.js";

export class SetUserRoleUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId, roleName) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found", 404);
        }

        const role = await this.userRepository.findRoleByName(roleName);
        if (!role) {
            throw new NotFoundError("Role not found", 404);
        }

        user.role = role;

        return await this.userRepository.save(user);
    }
}
