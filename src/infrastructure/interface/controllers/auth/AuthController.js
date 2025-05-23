import {CreateUserDto} from "./dto/request/CreateUserDto.js";
import {LoginUserDto} from "./dto/request/LoginUserDto.js";
import {LoginResponseDto} from "./dto/response/LoginResponseDto.js";
import {RegisterResponseDto} from "./dto/response/RegisterResponseDto.js";

class AuthController {
    constructor(registerUserUseCase, loginUserUseCase, logoutUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
        this.logoutUserUseCase = logoutUserUseCase;
    }

    async register(request, response, next) {
        try {
            const dto = new CreateUserDto(request.body);
            const user = await this.registerUserUseCase.execute(dto);
            return response.status(201).json({
                success: true,
                message: "User created successfully",
                user: new RegisterResponseDto(user)
            });
        } catch (error) {
            next(error);
        }
    }

    async login(request, response, next) {
        try {
            const dto = new LoginUserDto(request.body);
            const {existingUser: user, accessToken, refreshToken} = await this.loginUserUseCase.execute(dto);

            response.cookie("refreshToken", refreshToken, {
                maxAge: 7 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return response.status(200).json({
                success: true,
                user: new LoginResponseDto(user, accessToken),
            })
        } catch (error) {
            next(error)
        }
    }

    async logout(request, response, next) {
        try {
            const userId = request.user.id;
            await this.logoutUserUseCase.execute(userId);

            response.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
                sameSite: "strict"
            });

            return response.status(200).json({
                success: true,
                message: "User logged out successfully"
            });
        } catch (error) {
            next(error);
        }
    }
}

export default AuthController;
