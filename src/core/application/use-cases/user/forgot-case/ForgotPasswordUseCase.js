import {NotFoundError} from "../../../../../infrastructure/interface/errors/ApiError.js";
import crypto from "crypto";

export class ForgotPasswordUseCase {
    constructor(userRepository, emailService) {
        this.userRepository = userRepository;
        this.emailService = emailService;
    }

    async execute(email) {
        const user = await this.userRepository.findByEmail(email);
        if (!user) {
            throw new NotFoundError("User not found", 404);
        }

        const token = crypto.randomBytes(32).toString("hex");
        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${token}`;

        await this.userRepository.saveResetToken(user.id, token);

        await this.emailService.send({
            to: user.email,
            subject: "Forgot your password?",
            text: `Click the link to reset your password: ${resetUrl}`,
            html: `<p>Click the link below to reset your password:</p><a href="${resetUrl}">${resetUrl}</a>`
        });

        return {success: true};
    }
}
