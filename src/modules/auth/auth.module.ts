import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { jwtSecret } from "@config/envs";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { CustomerGuard } from "@modules/auth/guards/customer.guard";
import { AuthController } from "@modules/auth/controllers/auth.controller";
import { AuthService } from "@modules/auth/services/auth.service";
import { User } from "@modules/auth/entities/user.entity";
import { UserRole } from "@modules/auth/entities/userRole.entity";

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
            UserRole,
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