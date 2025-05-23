import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    }
});

export class EmailService {
    async send({to, subject, text}) {
        await transporter.sendMail({
            from: `"User management system" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            text
        })
    }
}

export default new EmailService();
