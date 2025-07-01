import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: 'tu_clave_secreta_aqui', // En producción, esto debería estar en variables de entorno
      signOptions: { expiresIn: '1h' }, // Token expira en 1 hora
    })
  ],
  controllers: [AuthController],
  providers: [AuthService]
})
export class AuthModule {}
