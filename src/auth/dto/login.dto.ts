import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({ example: "abdellaziz@mail.com" })
    @IsEmail({}, { message: "Email is not valid" })
    @IsNotEmpty({ message: "Email is required" })
    email: string;

    @ApiProperty({ example: '1234567' })
    @IsString({ message: "Password is not valid" })
    @MinLength(6, { message: "Password must be at least 6 characters long" })
    @IsNotEmpty({ message: "Password is required" })
    password: string;
}
