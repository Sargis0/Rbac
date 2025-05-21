import {NotFoundError} from "../../../../infrastructure/interface/errors/ApiError.js";

export class DeleteUserUseCase {
    constructor(userRepository, tokenRepository) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
    }

    async execute(userId) {
        const existingUser = this.userRepository.findUserById(userId);
        if (!existingUser) {
            throw new NotFoundError("User not found", 404);
        }

        await this.tokenRepository.removeRefreshToken(userId);
        return await this.userRepository.delete(userId)
    }
}
