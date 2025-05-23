import {ApiError, BadRequestError, NotFoundError} from "../../../../../infrastructure/interface/errors/ApiError.js";

export class RefreshTokenUserCase {
    constructor(userRepository, tokenRepository, jwtService) {
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.jwtService = jwtService;
    }

    async execute(refreshToken) {
        if (!refreshToken) {
            throw new BadRequestError("Refresh token is required", 400)
        }

        const userData = this.jwtService.validateRefreshToken(refreshToken);
        if (!userData) {
            throw new BadRequestError("Invalid refresh token", 400);
        }

        const user = await this.userRepository.findById(userData.id);
        if (!user) {
            throw new NotFoundError("User not found", 404);
        }

        const storedToken = await this.tokenRepository.getTokenByUserId(user.id);
        if (!storedToken || storedToken.token !== refreshToken) {
            throw new ApiError("Unauthorized", 401)
        }

        const tokens = await this.jwtService.generateTokens({
            id: user.id,
            role: user.role.name
        });

        await this.tokenRepository.saveToken(user.id, tokens.refreshToken);

        return tokens;
    }
}
