import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "@modules/auth/services/auth.service";
import { LoginUserDto } from "@modules/auth/dtos/loginUser.dto";

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