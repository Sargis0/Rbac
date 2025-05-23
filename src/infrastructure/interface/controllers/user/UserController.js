import {UserResponseDto} from "./dto/UserResponseDto.js";
import {DeletedUserResponseDto} from "./dto/DeletedUserResponseDto.js";
import {UserUpdateResponseDto} from "./dto/UserUpdateResponseDto.js";

export class UserController {
    constructor(
        readUserUseCase,
        deleteUserUseCase,
        updateUserUseCase,
        setUserRoleUseCase,
        forgotPasswordUseCase,
        resetPasswordUseCase,
        refreshTokenUseCase,
        uploadImageUseCase
    ) {
        this.readUserUseCase = readUserUseCase;
        this.deleteUserUseCase = deleteUserUseCase;
        this.updateUserUseCase = updateUserUseCase;
        this.setUserRoleUseCase = setUserRoleUseCase;
        this.forgotPasswordUseCase = forgotPasswordUseCase;
        this.resetPasswordUseCase = resetPasswordUseCase;
        this.refreshTokenUseCase = refreshTokenUseCase;
        this.uploadImageUseCase = uploadImageUseCase;
    }

    async findAll(request, response, next) {
        try {
            const users = await this.readUserUseCase.execute();
            return response.status(200).json({
                success: true,
                users: new UserResponseDto(users)
            })
        } catch (error) {
            next(error)
        }
    }

    async delete(request, response, next) {
        try {
            const deletedUser = await this.deleteUserUseCase.execute(request.params.id);
            return response.status(200).json({
                success: true,
                message: "User deleted successfully",
                user: new DeletedUserResponseDto(deletedUser)
            })
        } catch (error) {
            next(error);
        }
    }

    async update(request, response, next) {
        try {
            const updatedUser = await this.updateUserUseCase.execute(request.params.id, request.body);
            return response.json(200).json({
                success: true,
                message: "user updated successfully",
                user: new UserUpdateResponseDto(updatedUser)
            })
        } catch (error) {
            next(error)
        }
    }

    async setRole(request, response, next) {
        try {
            const userId = request.params.id;
            const {role} = request.body;

            const updatedUser = await this.setUserRoleUseCase.execute(userId, role);
            response.status(200).json({
                success: true,
                user: new UserUpdateResponseDto(updatedUser)
            });
        } catch (error) {
            next(error)
        }
    }

    async forgotPassword(request, response, next) {
        try {
            const {email} = request.body;
            await this.forgotPasswordUseCase.execute(email);
            response.status(200).json({
                success: true,
                message: "Reset link sent to your email"
            })
        } catch (error) {
            next(error)
        }
    }

    async resetPassword(request, response, next) {
        try {
            const {token} = request.params;
            const {newPassword} = request.body;

            const result = await this.resetPasswordUseCase.execute(token, newPassword);
            return response.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(request, response, next) {
        try {
            const {accessToken, refreshToken} = await this.refreshTokenUseCase.execute(request.body.refreshToken);
            response.cookie("refreshToken", refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return response.status(200).json({
                success: true,
                accessToken
            })
        } catch (error) {
            next(error);
        }
    }

    async uploadImage(request, response, next) {
        try {
            const {file} = request;
            const {id} = request.params;
            if (!file) {
                return response.status(400).json({
                    success: false,
                    message: "No image provided"
                });
            }

            const updatedUser = await this.uploadImageUseCase.execute(id, file);
            return response.status(200).json({
                success: true,
                message: "Image uploaded successfully",
                imageUrl: updatedUser
            });
        } catch(error) {
            next(error);
        }
    }
}

export default UserController;
