import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "@config/envs";
import { AuthGuard } from "@modules/auth/guards/auth.guard";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtSecret,
            signOptions: {
                expiresIn: '1h',
            },
        }),
    ],
    controllers: [],
    providers: [AuthGuard],
    exports: [
        JwtModule,
        AuthGuard,
    ],
})
export class AuthModule {}