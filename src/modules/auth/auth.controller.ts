import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { LoginUserDto } from "./dtos/loginUser.dto";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('/login')
    async login(@Body() loginData: LoginUserDto) {
        const { email, password } = loginData;

        const token = await this.authService.loginUser(email, password);

        return { token };
    }
}