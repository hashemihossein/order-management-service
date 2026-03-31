import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PlaceOrderDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ example: 'BTC' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  originToken: string;

  @ApiProperty({ example: 'USDT' })
  @IsString()
  @MinLength(2)
  @MaxLength(10)
  destinationToken: string;

  @ApiProperty({ example: 0.5 })
  @Type(() => Number)
  @IsNumber()
  @IsPositive()
  amount: number;
}
