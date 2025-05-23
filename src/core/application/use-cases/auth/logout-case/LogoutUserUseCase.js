export class LogoutUserUseCase {
    constructor(tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    async execute(userId) {
        await this.tokenRepository.removeRefreshToken(userId);
    }
}
