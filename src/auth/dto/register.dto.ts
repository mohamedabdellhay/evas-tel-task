import { IsString, IsEmail, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
    @ApiProperty({ example: "Abdellaziz" })

    @IsString()
    @IsNotEmpty()
    fullName: string;

    @ApiProperty({ example: "abdellaziz@mail.com" })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({ example: "1234567" })
    @IsString()
    @IsNotEmpty()
    password: string;

    @ApiProperty({ example: "admin" })
    @IsString()
    @IsNotEmpty()
    role: "admin" | "owner" | "cashier" | "user";
}

