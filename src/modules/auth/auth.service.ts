import { BadRequestException, Injectable, OnModuleInit } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import { compare, hash } from "bcrypt";
import { JwtService } from "@nestjs/jwt";
import { sa } from "@config/envs";

@Injectable()
export class AuthService implements OnModuleInit {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly jwtService: JwtService,
    ) {}

    async onModuleInit() {
        if (await this.usersRepository.count())
            return;

        const hashedPassword = await hash(sa.password, 10);
        
        const saUser = this.usersRepository.create({
            email: sa.email,
            password: hashedPassword,
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