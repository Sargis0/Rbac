import {Router} from "express";

import AuthController from "../../controllers/auth/AuthController.js";

import {UserRepository} from "../../../database/postgre/repository/user/UserRepository.js";
import {BcryptPasswordHash} from "../../../services/bcrypt/BcryptPasswordHasher.js";

import {RegisterUserUseCase} from "../../../../core/application/use-cases/auth/register-case/RegisterUserUseCase.js";
import {LoginUserUseCase} from "../../../../core/application/use-cases/auth/login-case/LoginUserUseCase.js";
import {LogoutUserUseCase} from "../../../../core/application/use-cases/auth/logout-case/LogoutUserUseCase.js";

import {Jwt} from "../../../services/jwt/Jwt.js";
import {TokenRepository} from "../../../database/postgre/repository/token/TokenRepository.js";
import AuthMiddleware from "../../middlewares/auth/AuthMiddleware.js";
import {PermissionMiddleware} from "../../middlewares/permission/PermissionMiddleware.js";

const authRouter = Router();

const userRepository = new UserRepository();
const passwordHasher = new BcryptPasswordHash();
const tokensGenerator = new Jwt();
const tokenRepository = new TokenRepository();
const registerUseCase = new RegisterUserUseCase(userRepository, passwordHasher);
const loginUserUseCase = new LoginUserUseCase(userRepository, passwordHasher, tokensGenerator, tokenRepository);
const logoutUserUseCase = new LogoutUserUseCase(tokenRepository);
const authController = new AuthController(registerUseCase, loginUserUseCase, logoutUserUseCase);

authRouter.post(
    "/auth/register",
    AuthMiddleware.authenticate,
    PermissionMiddleware.requireRole("super_admin"),
    PermissionMiddleware.allow("create_user"),
    authController.register.bind(authController)
);

authRouter.post(
    "/auth/login",
    authController.login.bind(authController)
);

authRouter.post(
    "/auth/logout",
    AuthMiddleware.authenticate,
    authController.logout.bind(authController)
);

export default authRouter;
