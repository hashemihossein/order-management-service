import { ApiProperty } from '@nestjs/swagger';
import { OrderStatus } from 'src/order/domain/value-objects/order-status.vo';

export class OrderResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() userId: string;
  @ApiProperty() originToken: string;
  @ApiProperty() destinationToken: string;
  @ApiProperty() amount: number;
  @ApiProperty({ enum: OrderStatus }) status: OrderStatus;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}
