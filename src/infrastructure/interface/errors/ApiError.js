export class ApiError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.name = this.constructor.name;
    }
}

export class NotFoundError extends ApiError {
    constructor(message = "Resource not found") {
        super(message, 404);
        this.name = this.constructor.name;
    }
}

export class BadRequestError extends ApiError {
    constructor(message = "Bad request") {
        super(message, 400);
        this.name = this.constructor.name;
    }
}
