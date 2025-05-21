import {NotFoundError} from "../../../../infrastructure/interface/errors/ApiError.js";

export class SetUserRoleUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId, role) {
        const updatedUser = await this.userRepository.setRole(userId, role);
        if (!updatedUser) {
            throw new NotFoundError("User not found", 404);
        }
        return updatedUser;
    }
}
