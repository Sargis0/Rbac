import {ApiError} from "../../errors/ApiError.js";
import {Jwt} from "../../../services/jwt/Jwt.js";

export default class AuthMiddleware {
    static async authenticate(request, response, next) {
        try {
            const authHeader = request.header("Authorization");

            if (!authHeader?.startsWith("Bearer ")) {
                throw new ApiError("Unauthorized", 401);
            }

            const token = authHeader.split(" ")[1];
            const userData = Jwt.validateAccessToken(token);

            if (!userData) {
                throw new ApiError("Invalid token", 401);
            }

            request.user = userData;
            next();
        } catch (error) {
            next(error);
        }
    }
}
