import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, Min, IsOptional, IsDateString, Matches } from 'class-validator';

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The ID of the restaurant', example: '69e89cd35e83ed666becb492' })
  restaurantId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The ID of the user', example: '69e89cd35e83ed666becb492' })
  userId: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The date of the reservation in YYYY-MM-DD format', example: '2022-01-01' })
  @IsDateString()
  date: string; 

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'The time of the reservation in HH:MM format', example: '12:00' })
  @Matches(/^(?:2[0-3]|[01]?[0-9]):[0-5][0-9]$/)
  time: string; 

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  @ApiProperty({ description: 'The size of the party', example: 4 })
  partySize: number;

  @IsOptional()
  @IsString()
  @ApiProperty({ description: 'The special requests of the reservation', example: 'Special requests' })
  specialRequests?: string;
}
