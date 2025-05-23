import {BadRequestError} from "../../../../../infrastructure/interface/errors/ApiError.js";

export class ResetPasswordUseCase {
    constructor(userRepository, passwordHasher) {
        this.userRepository = userRepository;
        this.passwordHasher = passwordHasher;
    }

    async execute(token, newPassword) {
        const user = await this.userRepository.findByResetToken(token);
        if (!user || !user.resetTokenExpires || user.resetTokenExpires < new Date()) {
            throw new BadRequestError("Invalid or expired token");
        }

        if (user.resetTokenExpiration < new Date()) {
            throw new BadRequestError("Reset token expired", 400);
        }

        const hashedPassword = await this.passwordHasher.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpires = null;

        await this.userRepository.save(user);

        return {message: "Password has been reset successfully"};
    }
}
