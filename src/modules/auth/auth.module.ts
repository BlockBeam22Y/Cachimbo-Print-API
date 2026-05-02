import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "@config/envs";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { CustomerGuard } from "@modules/auth/guards/customer.guard";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { User } from "./entities/user.entity";

@Module({
    imports: [
        JwtModule.register({
            secret: jwtSecret,
            signOptions: {
                expiresIn: '1h',
            },
        }),
        TypeOrmModule.forFeature([
            User,
            Customer,
        ]),
    ],
    controllers: [AuthController],
    providers: [
        AuthService,
        AuthGuard,
        CustomerGuard,
    ],
    exports: [
        JwtModule,
        TypeOrmModule,
        AuthGuard,
        CustomerGuard,
    ],
})
export class AuthModule {}