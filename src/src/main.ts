import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Configuración de CORS
  app.enableCors();
  
  // Configuración de validación global
  app.useGlobalPipes(new ValidationPipe());

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API E-commerce')
    .setDescription('Documentación de la API del E-commerce')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .addTag('auth', 'Endpoints de autenticación')
    .addTag('users', 'Endpoints de usuarios')
    .addTag('products', 'Endpoints de productos')
    .addTag('orders', 'Endpoints de órdenes')
    .addTag('files', 'Endpoints de archivos')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(3000);
}
bootstrap();
