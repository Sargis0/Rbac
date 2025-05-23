import {NotFoundError} from "../../../../../infrastructure/interface/errors/ApiError.js";

export class UpdateUserUseCase {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute(userId, data) {
        const existingUser = await this.userRepository.findById(userId);
        if (!existingUser) {
            throw new NotFoundError("User not found", 404)
        }

        if ("role" in data) {
            delete data.role;
        }

        return await this.userRepository.update(userId, data)
    }
}
