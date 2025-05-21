import {BadRequestError, NotFoundError} from "../../../../infrastructure/interface/errors/ApiError.js";

export class ResetPasswordUseCase {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    async execute(token, newPassword) {
        const user = await this.userRepository.findByResetToken(token);
        if (!user) {
            throw new NotFoundError("Invalid or expired reset token", 404);
        }

        if (user.resetTokenExpiration < new Date()) {
            throw new BadRequestError("Reset token expired", 400);
        }

        const hashedPassword = await this.passwordHasher.hash(newPassword, 10);
        await this.userRepository.resetPassword(user.id, hashedPassword);
        return {success: true, message: "Password has been reset successfully"};
    }
}
