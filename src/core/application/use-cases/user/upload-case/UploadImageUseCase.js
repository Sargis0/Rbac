import {NotFoundError} from "../../../../../infrastructure/interface/errors/ApiError.js";

export class UploadImageUseCase {
    constructor(userRepository, imageService) {
        this.userRepository = userRepository;
        this.imageService = imageService;
    }

    async execute(userId, file) {
        const user = await this.userRepository.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found", 404);
        }

        return await this.imageService.upload(file);
    }
}
