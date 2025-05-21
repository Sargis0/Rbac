import {CreateUserDto} from "./dto/CreateUserDto.js";
import {LoginUserDto} from "./dto/LoginUserDto.js";
import {LoginResponseDto} from "./dto/LoginResponseDto.js";

class AuthController {
    constructor(registerUserUseCase, loginUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.loginUserUseCase = loginUserUseCase;
    }

    async register(request, response, next) {
        try {
            const dto = new CreateUserDto(request.body);
            const user = await this.registerUserUseCase.execute(dto);
            return response.status(201).json({message: "User created successfully", user})
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
}

export default AuthController;
