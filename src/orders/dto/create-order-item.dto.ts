import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId, IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';

export class CreateOrderItemDto {
  @ApiProperty({ example: '664e89cd35e83ed666becb11', description: 'Menu item ID' })
  @IsMongoId()
  @IsNotEmpty()
  menuItemId: string;

  @ApiProperty({ example: 2, description: 'Number of units ordered' })
  @IsNumber()
  @Min(1)
  quantity: number;

  @ApiProperty({ example: 12.99, description: 'Price per unit at time of order' })
  @IsNumber()
  @IsPositive()
  price: number;
}
