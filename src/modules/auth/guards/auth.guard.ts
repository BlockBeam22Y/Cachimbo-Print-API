import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly reflector: Reflector
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest<Request>();

        const authorization = request.headers.authorization ?? '';
        const token = authorization.split('Bearer ')[1];
        
        try {
            const payload = await this.jwtService.verifyAsync(token);

            request['data'] = payload;
            return true;
        } catch {
            const isPublic = this.reflector.getAllAndOverride<boolean>('isPublic', [
                context.getClass(),
                context.getHandler(),
            ]);

            if (isPublic)
                return true;

            throw new UnauthorizedException('Invalid token');
        }
    }
}