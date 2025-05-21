import {Router} from "express";

import AuthController from "../../controllers/auth/AuthController.js";

import {UserRepository} from "../../../database/postgre/repository/UserRepository.js";
import {BcryptPasswordHash} from "../../../services/bcrypt/BcryptPasswordHasher.js";

import {RegisterUserUseCases} from "../../../../core/application/use-cases/auth/RegisterUserUseCases.js";
import {LoginUserUseCase} from "../../../../core/application/use-cases/auth/LoginUserUseCase.js";

import {Jwt} from "../../../services/jwt/Jwt.js";
import {TokenRepository} from "../../../database/postgre/repository/TokenRepository.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import {RoleMiddleware} from "../../middlewares/RoleMiddleware.js";

const authRouter = Router();

const userRepository = new UserRepository();
const passwordHasher = new BcryptPasswordHash();
const tokensGenerator = new Jwt();
const tokenRepository = new TokenRepository();
const registerUseCase = new RegisterUserUseCases(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokensGenerator, tokenRepository)
const authController = new AuthController(registerUseCase, loginUserUseCase);

authRouter.post(
    "/auth/register",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorizeSuperAdmin,
    authController.register.bind(authController)
);

authRouter.post("/auth/login", authController.login.bind(authController));

export default authRouter;
