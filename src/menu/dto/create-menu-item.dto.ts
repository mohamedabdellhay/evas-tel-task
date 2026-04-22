import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, IsPositive, IsOptional } from 'class-validator';

export class CreateMenuItemDto {
  @ApiProperty({ example: 'koshary', description: 'Name of the menu item' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 40, description: 'Price of the menu item' })
  @IsNumber()
  @IsPositive()
  price: number;

  @ApiProperty({ example: 'food', description: 'Category of the menu item' })
  @IsOptional()
  @IsString()
  category?: string;
}
