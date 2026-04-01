import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../domain/value-objects/order-status.vo';
import { CommandBus } from '@nestjs/cqrs';
import { PlaceOrderCommand } from '../commands/place-order.command';

@Injectable()
export class OrderService {
  constructor(private readonly commandBus: CommandBus) {}

  placeOrder(
    userId: string,
    originToken: string,
    destinationToken: string,
    amount: number,
  ) {
    return this.commandBus.execute(
      new PlaceOrderCommand(userId, originToken, destinationToken, amount),
    );
  }

  executeOrder(orderId: string) {}

  cancelOrder(orderId: string) {}

  getOrders(userId: string, status?: OrderStatus) {}

  getOrderById(orderId: string) {}
}
