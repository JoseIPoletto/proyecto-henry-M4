import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Basic: ')) {
            throw new UnauthorizedException('Header de autorización no válido');
        }

        const credentials = authHeader.split('Basic: ')[1];
        const [email, password] = credentials.split(':');

        if (!email || !password) {
            throw new UnauthorizedException('Credenciales incompletas');
        }

        return true;
    }
} 