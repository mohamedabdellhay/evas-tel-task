import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, Min } from 'class-validator';

export class CreateRestaurantDto {
  @ApiProperty({ example: 'Abo tarek', description: 'The name of the restaurant' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Giza', description: 'The location of the restaurant' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({ example: 500, description: 'The capacity of the restaurant' })
  @IsNumber()
  @Min(1)
  capacity: number;
}
