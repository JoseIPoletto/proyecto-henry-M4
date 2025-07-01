import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    async login(loginUserDto: LoginUserDto) {
        const user = await this.usersService.findByEmail(loginUserDto.email);
        
        if (!user) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);
        
        if (!isPasswordValid) {
            throw new UnauthorizedException('Credenciales incorrectas');
        }

        const payload = { 
            sub: user.id, 
            email: user.email,
            isAdmin: user.isAdmin || false
        };

        const { password, ...result } = user;
        
        // Si es admin, creamos un token con expiración muy larga (10 años)
        const token = user.isAdmin 
            ? await this.jwtService.signAsync(payload, { expiresIn: '3650d' })
            : await this.jwtService.signAsync(payload);

        return {
            ...result,
            access_token: token
        };
    }
}
