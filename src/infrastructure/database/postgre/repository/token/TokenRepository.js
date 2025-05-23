import {ITokenRepository} from "../../../../../core/domain/repositories/token/ITokenRepository.js";

import {dataSource} from "../../data-source/dataSource.js";

export class TokenRepository extends ITokenRepository {
    async saveToken(userId, refreshToken) {
        const tokenRepo = dataSource.getRepository("Token");

        const existingToken = await tokenRepo.findOne({
            where: {user: {id: userId}},
        });

        if (existingToken) {
            existingToken.token = refreshToken;
            return await tokenRepo.save(existingToken);
        }

        const newToken = tokenRepo.create({
            token: refreshToken,
            user: {id: userId}
        });

        return await tokenRepo.save(newToken);
    }

    async getTokenByUserId(userId) {
        const repo = dataSource.getRepository("Token");

        return await repo.findOne({
            where: {user: {id: userId}},
            relations: ["user"]
        });
    }

    async removeRefreshToken(userId) {
        const tokenRepo = dataSource.getRepository("Token");

        const existingToken = await tokenRepo.findOne({
            where: {user: {id: userId}},
            relations: ["user"]
        });

        if (existingToken) {
            await tokenRepo.remove(existingToken);
        }
    }
}
