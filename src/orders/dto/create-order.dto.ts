import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  ValidateNested,
} from 'class-validator';
import { CreateOrderItemDto } from './create-order-item.dto';

export class CreateOrderDto {
  @ApiProperty({
    example: '664e89cd35e83ed666becb99',
    description: 'ID of the waiter (staff user)',
  })
  @IsMongoId()
  @IsNotEmpty()
  waiterId: string;

  @ApiProperty({
    type: [CreateOrderItemDto],
    description: 'List of ordered items',
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];

  @ApiProperty({ example: 45.5, description: 'Total amount for the order' })
  @IsNumber()
  @IsPositive()
  totalAmount: number;
}
