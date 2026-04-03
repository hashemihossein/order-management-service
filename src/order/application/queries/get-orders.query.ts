import { OrderStatus } from '../../domain/value-objects/order-status.vo';

export class GetOrdersQuery {
  constructor(
    readonly userId: string,
    readonly status?: OrderStatus,
  ) {}
}
