import { IsString, IsEmail, IsOptional, IsNumber } from 'class-validator';

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsString()
    @IsOptional()
    address?: string;

    @IsNumber()
    @IsOptional()
    phone?: number;

    @IsString()
    @IsOptional()
    country?: string;

    @IsString()
    @IsOptional()
    city?: string;
} 