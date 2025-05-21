import {ApiError} from "../errors/ApiError.js";

export class RoleMiddleware {
    static authorizeSuperAdmin(request, response, next) {
        if (!request.user || request.user.role !== "super_admin") {
            throw new ApiError(`Forbidden: Only super_admins can ${request.method} users`, 403);
        }

        next()
    }
}
