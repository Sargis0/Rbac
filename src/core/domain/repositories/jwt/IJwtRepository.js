export class IJwtRepository {
    generateTokens(payload) {
        throw new Error("Method not implemented");
    }

    async validateAccessToken(accessToken) {
        throw new Error("Method not implemented");
    }

    async validateRefreshToken(refreshToken) {
        throw new Error("Method not implemented");
    }
}
