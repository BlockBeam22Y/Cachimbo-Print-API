import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/auth/entities/user.entity";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { sa } from "@config/envs";
import { UserRole } from "@modules/auth/entities/userRole.entity";
import { PermissionFlagsBits } from "@modules/auth/helpers/permissionFlagsBits.helper";

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        @InjectRepository(UserRole)
        private readonly userRolesRepository: Repository<UserRole>,
        private readonly jwtService: JwtService,
    ) {}

    async onModuleInit() {
        if (await this.usersRepository.count())
            return;

        if (await this.userRolesRepository.count())
            return;

        const role = this.userRolesRepository.create({
            name: 'SA',
            permissionBitField:
                Object.values(PermissionFlagsBits)
                    .reduce((acc, bit) => {
                        acc |= bit;

                        return acc;
                    }, 0n),
        });
        await this.userRolesRepository.save(role);

        const hashedPassword = await hash(sa.password, 10);
        
        const saUser = this.usersRepository.create({
            email: sa.email,
            password: hashedPassword,
            role,
        });
        await this.usersRepository.save(saUser);
    }

    async loginUser(email: string, password: string) {
        const user = await this.usersRepository.findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });

        if (user && await compare(password, user.password)) {
            const token = await this.jwtService.signAsync({
                sub: user.id,
                id: user.id,
                email: user.email,
            });

            return token;
        }

        throw new BadRequestException('Invalid login');
    }
}