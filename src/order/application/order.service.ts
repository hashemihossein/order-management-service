import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../domain/value-objects/order-status.vo';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { PlaceOrderCommand } from './commands/place-order.command';
import { GetOrdersQuery } from './queries/get-orders.query';
import { GetOrderByIdQuery } from './queries/get-order-by-id.query';

@Injectable()
export class OrderService {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  async placeOrder(
    userId: string,
    originToken: string,
    destinationToken: string,
    amount: number,
  ) {
    return await this.commandBus.execute(
      new PlaceOrderCommand(userId, originToken, destinationToken, amount),
    );
  }

  executeOrder(orderId: string) {}

  cancelOrder(orderId: string) {}

  async getOrders(userId: string, status?: OrderStatus) {
    return await this.queryBus.execute(new GetOrdersQuery(userId, status));
  }

  async getOrderById(orderId: string) {
    return await this.queryBus.execute(new GetOrderByIdQuery(orderId));
  }
}
