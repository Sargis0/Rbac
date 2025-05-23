import {User} from "../../../../domain/entities/user/User.js";
import {BadRequestError} from "../../../../../infrastructure/interface/errors/ApiError.js";

export class RegisterUserUseCase {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    async execute(dto) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (existingUser) {
            throw new BadRequestError("User with this email already exists", 400);
        }

        const hasedPassword = await this.passwordHasher.hash(dto.password, 10);
        const newUser = new User({
            ...dto,
            password: hasedPassword
        });

        return await this.userRepository.save(newUser);
    }
}
