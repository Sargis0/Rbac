import {Router} from "express";

import UserController from "../../controllers/user/UserController.js";

import {ForgotPasswordUseCase} from "../../../../core/application/use-cases/user/forgot-case/ForgotPasswordUseCase.js";
import {ResetPasswordUseCase} from "../../../../core/application/use-cases/user/reset-case/ResetPasswordUseCase.js";
import {UserRepository} from "../../../database/postgre/repository/user/UserRepository.js";
import {ReadUserUseCase} from "../../../../core/application/use-cases/user/read-case/ReadUserUseCase.js";
import {UpdateUserUseCase} from "../../../../core/application/use-cases/user/update-case/UpdateUserUseCase.js";
import {DeleteUserUseCase} from "../../../../core/application/use-cases/user/delete-case/DeleteUserUseCase.js";
import {SetUserRoleUseCase} from "../../../../core/application/use-cases/user/setrole-case/SetUserRoleUseCase.js";
import {TokenRepository} from "../../../database/postgre/repository/token/TokenRepository.js";
import {EmailService} from "../../../services/email/EmailService.js";
import AuthMiddleware from "../../middlewares/auth/AuthMiddleware.js";
import {PermissionMiddleware} from "../../middlewares/permission/PermissionMiddleware.js";
import {BcryptPasswordHash} from "../../../services/bcrypt/BcryptPasswordHasher.js";
import {Jwt} from "../../../services/jwt/Jwt.js";
import {RefreshTokenUserCase} from "../../../../core/application/use-cases/user/refresh-case/RefreshTokenUserCase.js";
import {UploadImageUseCase} from "../../../../core/application/use-cases/user/upload-case/UploadImageUseCase.js";
import {upload} from "../../middlewares/upload/uploadMiddleware.js";
import {ImageService} from "../../../uploads/ImageService.js";

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
const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, passwordHasher);
const jwtService = new Jwt();
const refreshTokenUseCase = new RefreshTokenUserCase(userRepository, tokenRepository, jwtService);
const imageService = new ImageService()
const uploadImageUseCase = new UploadImageUseCase(userRepository, imageService);

const userController = new UserController(
    readUserUseCase,
    deleteUserUseCase,
    updateUserUseCase,
    setUserRoleUseCase,
    forgotPasswordUseCase,
    resetPasswordUseCase,
    refreshTokenUseCase,
    uploadImageUseCase
);

userRouter.get(
    "/users",
    AuthMiddleware.authenticate,
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
    PermissionMiddleware.requireRole("super_admin"),
    PermissionMiddleware.allow("delete_user"),
    userController.delete.bind(userController)
);

userRouter.patch(
    "/users/:id",
    AuthMiddleware.authenticate,
    PermissionMiddleware.requireRole("super_admin"),
    PermissionMiddleware.allow("set_role"),
    userController.setRole.bind(userController)
);

userRouter.post(
    "/user/reset-password",
    userController.forgotPassword.bind(userController)
);

userRouter.post(
    "/users/reset-password/:token",
    userController.resetPassword.bind(userController)
);

userRouter.post(
    "/users/refresh-token",
    userController.refreshToken.bind(userController)
);

userRouter.post(
    "/users/:id/upload-image",
    AuthMiddleware.authenticate,
    upload.single("image"),
    userController.uploadImage.bind(userController)
);

export default userRouter;
