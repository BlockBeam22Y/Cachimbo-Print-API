import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "@modules/auth/entities/user.entity";
import { Repository } from "typeorm";
import { Reflector } from "@nestjs/core";

@Injectable()
export class UserGuard implements CanActivate {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly reflector: Reflector,
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const data = request['data'];

        const user = data && await this.usersRepository.findOne({
            where: {
                id: data.id,
            },
            relations: {
                role: true,
            },
        });

        if (!user)
            throw new UnauthorizedException('Invalid user token');

        const permissions = this.reflector.getAllAndOverride<bigint>('permissions', [
            context.getClass(),
            context.getHandler(),
        ]);


        if (
            (BigInt(user.role.permissionBitField) & permissions) !== permissions
        )
            throw new ForbiddenException('Missing permissions');
        
        request['data']['user'] = user;

        return true;
    }
}