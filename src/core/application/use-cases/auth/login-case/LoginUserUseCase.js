import {BadRequestError} from "../../../../../infrastructure/interface/errors/ApiError.js";

export class LoginUserUseCase {
    constructor(userRepository, passwordHasher, tokenGenerator, tokenRepository) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
        this.tokenGenerator = tokenGenerator;
        this.tokenRepository = tokenRepository;
    }

    async execute(dto) {
        const existingUser = await this.userRepository.findByEmail(dto.email);
        if (!existingUser) {
            throw new BadRequestError("Invalid username or password", 400);
        }

        const isMatchPassword = await this.passwordHasher.compare(dto.password, existingUser.password);
        if (!isMatchPassword) {
            throw new BadRequestError("Invalid username or password", 400);
        }

        const {accessToken, refreshToken} = this.tokenGenerator.generateTokens({
            id: existingUser.id,
            role: existingUser.role.name,
            permissions: existingUser.role.permissions.map(permission => permission.action)
        });

        await this.tokenRepository.saveToken(existingUser.id, refreshToken)

        return {
            existingUser,
            accessToken,
            refreshToken
        }
    }
}
