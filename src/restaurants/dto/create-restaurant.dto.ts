import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'The Pizza Place', description: 'The name of the restaurant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: '123 Main St', description: 'The location of the restaurant' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 50, description: 'The capacity of the restaurant' })
  @IsNumber()
  @Min(1)
  capacity: number;
}
