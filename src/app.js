import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import {DatabaseFactory} from "./infrastructure/database/DatabaseFactory.js";
import authRouter from "./infrastructure/interface/routes/auth/authRoutes.js";
import userRouter from "./infrastructure/interface/routes/user/userRouter.js";

import {postgreConfig} from "./infrastructure/config/database.config.js";
import {ErrorHandler} from "./infrastructure/interface/middlewares/ErrorHandler.js";

const bootstrap = async () => {
    try {
        const app = express();
        app.use(cors({
            origin: process.env.CLIENT_URL,
            methods: ["POST", "GET", "PUT", "PATCH", "DELETE"]
        }));

        app.use(express.json());
        app.use(cookieParser());
        app.use("/api", authRouter);
        app.use("/api", userRouter);
        app.use(ErrorHandler.handler);

        const postgre = DatabaseFactory.create(postgreConfig);
        await postgre.connect();

        app.listen(process.env.PORT, () => {
            console.log(`Server running on http://localhost:${process.env.PORT}`)
        })
    } catch (error) {
        console.error('Application failed to start', error);
        process.exit(1);
    }
}

bootstrap();
