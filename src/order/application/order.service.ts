import { Injectable } from '@nestjs/common';
import { OrderStatus } from '../domain/value-objects/order-status.vo';

@Injectable()
export class OrderService {
  constructor() {}

  placeOrder(
    userId: string,
    originToken: string,
    destinationToken: string,
    amount: number,
  ) {}

  executeOrder(orderId: string) {}

  cancelOrder(orderId: string) {}

  getOrders(userId: string, status?: OrderStatus) {}

  getOrderById(orderId: string) {}
}
