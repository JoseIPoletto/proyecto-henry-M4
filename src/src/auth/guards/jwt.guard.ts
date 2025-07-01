import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token no proporcionado o formato inválido');
        }

        const token = authHeader.split('Bearer ')[1];

        try {
            const payload = await this.jwtService.verifyAsync(token);
            // Añadimos el usuario decodificado a la request para uso posterior
            request.user = payload;
            return true;
        } catch (error) {
            throw new UnauthorizedException('Token inválido o expirado');
        }
    }
} 