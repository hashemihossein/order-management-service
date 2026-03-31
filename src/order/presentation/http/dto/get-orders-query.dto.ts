import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';

export class GetOrdersQueryDto {
  @ApiPropertyOptional({ example: 'user-123' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ enum: OrderStatus })
  @IsEnum(OrderStatus)
  @IsOptional()
  status?: OrderStatus;
}
