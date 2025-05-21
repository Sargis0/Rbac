import {Router} from "express";

import UserController from "../../controllers/user/UserController.js";
import {ForgotPasswordUseCase} from "../../../../core/application/use-cases/user/ForgotPasswordUseCase.js";
import {ResetPasswordUseCase} from "../../../../core/application/use-cases/user/ResetPasswordUseCase.js";
import {UserRepository} from "../../../database/postgre/repository/UserRepository.js";
import {ReadUserUseCase} from "../../../../core/application/use-cases/user/ReadUserUseCase.js";
import {UpdateUserUseCase} from "../../../../core/application/use-cases/user/UpdateUserUseCase.js";
import {DeleteUserUseCase} from "../../../../core/application/use-cases/user/DeleteUserUseCase.js";
import {SetUserRoleUseCase} from "../../../../core/application/use-cases/user/SetUserRoleUseCase.js";
import {TokenRepository} from "../../../database/postgre/repository/TokenRepository.js";
import {EmailService} from "../../../services/email/EmailService.js";
import AuthMiddleware from "../../middlewares/AuthMiddleware.js";
import {RoleMiddleware} from "../../middlewares/RoleMiddleware.js";
import {BcryptPasswordHash} from "../../../services/bcrypt/BcryptPasswordHasher.js";

const userRouter = Router();

const userRepository = new UserRepository();

const emailService = new EmailService();
const tokenRepository = new TokenRepository();
const readUserUseCase = new ReadUserUseCase(userRepository);
const updateUserUseCase = new UpdateUserUseCase(userRepository);
const setUserRoleUseCase = new SetUserRoleUseCase(userRepository)
const deleteUserUseCase = new DeleteUserUseCase(userRepository, tokenRepository);
const forgotPasswordUseCase = new ForgotPasswordUseCase(userRepository, emailService);
const passwordHasher = new BcryptPasswordHash();
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordHasher)

const userController = new UserController(
    readUserUseCase,
    deleteUserUseCase,
    updateUserUseCase,
    setUserRoleUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase
);

userRouter.get(
    "/users",
    userController.findAll.bind(userController)
);

userRouter.put(
    "/users/:id",
    AuthMiddleware.authenticate,
    userController.update.bind(userController)
);

userRouter.delete(
    "/users/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorizeSuperAdmin,
    userController.delete.bind(userController)
);

userRouter.patch(
    "/users/:id",
    AuthMiddleware.authenticate,
    RoleMiddleware.authorizeSuperAdmin,
    userController.setRole.bind(userController)
);

userRouter.post(
    "/user/reset-password",
    AuthMiddleware.authenticate,
    userController.forgotPassword.bind(userController)
);

userRouter.post(
    "/user/reset-password/:id",
    AuthMiddleware.authenticate,
    userController.resetPassword.bind(userController)
);

export default userRouter;
