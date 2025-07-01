import { createParamDecorator, ExecutionContext, BadRequestException } from '@nestjs/common';
import { isUUID } from 'class-validator';

export const ValidateUUID = createParamDecorator(
    (data: unknown, ctx: ExecutionContext) => {
        const request = ctx.switchToHttp().getRequest();
        const id = request.params.id;

        if (!id || !isUUID(id)) {
            throw new BadRequestException('ID inválido: debe ser un UUID válido');
        }

        return id;
    },
); 