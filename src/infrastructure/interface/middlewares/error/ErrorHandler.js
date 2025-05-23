import {ApiError} from "../../errors/ApiError.js";

export class ErrorHandler {
    static handler(error, request, response, next) {
        if (error instanceof ApiError) {
            if (error.options?.clearCookie) {
                response.clearCookie("refreshToken");
            }

            return response.status(error.statusCode).json({
                success: false,
                message: error.message,
                code: error.code || "GENERIC_ERROR"
            });
        }

        if (error.name === "ValidationError") {
            return response.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.errors
            });
        }

        return response.status(500).json({
            success: false,
            message: "Internal Server Error"
        });
    }
}
