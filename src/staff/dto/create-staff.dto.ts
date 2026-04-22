import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsIn, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateStaffDto {
  @ApiProperty({ example: 'abdellhay osama', description: 'Full name of the staff member' })
  @IsNotEmpty()
  @IsString()
  fullName: string;

  @ApiProperty({ example: 'abdellaziz@mail.com', description: 'Staff member email' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'secret123', description: 'Password (min 6 chars)' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'cashier', enum: ['cashier', 'owner'], description: 'Staff role' })
  @IsIn(['cashier', 'owner'])
  role: 'cashier' | 'owner';
}
