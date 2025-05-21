import jwt from "jsonwebtoken"
import {IJwtRepository} from "../../../core/domain/repositories/jwt/IJwtRepository.js";

export class Jwt extends IJwtRepository {
    generateTokens(payload) {
        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            {expiresIn: "15m"}
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            {expiresIn: "7d"}
        );

        return {accessToken, refreshToken}
    }

    static validateAccessToken(accessToken) {
        try {
            return jwt.verify(accessToken, process.env.JWT_ACCESS_SECRET, {
                clockTolerance: 30,
                ignoreExpiration: false
            });
        } catch {
            return null;
        }
    }

    static validateRefreshToken(refreshToken) {
        try {
            return jwt.verify(refreshToken, process.env.JWT_REFRESH_TOKEN);
        } catch {
            return null;
        }
    }
}
