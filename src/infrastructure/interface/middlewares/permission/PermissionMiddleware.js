import {ApiError} from "../../errors/ApiError.js";

export class PermissionMiddleware {
    static _requireUser(user) {
        if (!user) {
            throw new ApiError("Unauthorized", 401)
        }
    }

    static allow(permission) {
        return (request, response, next) => {
            PermissionMiddleware._requireUser(request.user);

            const userPermissions = request.user.permissions || [];

            if (!userPermissions.includes(permission)) {
                throw new ApiError(`Forbidden: Missing '${permission}' permission`, 403);
            }

            next();
        }
    }

    static requireRole(role) {
        return (request, response, next) => {
            PermissionMiddleware._requireUser(request.user);

            if (request.user.role !== role) {
                throw new ApiError(`Forbidden: You must be '${role}' to perform this action.`, 403);
            }

            next()
        }
    }
}
