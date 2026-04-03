import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetOrdersQuery } from '../get-orders.query';
import { OrderReadRepository } from '../../ports/order-read.repository';
import { OrderReadModel } from 'src/order/domain/read-models/order.read-model';

@QueryHandler(GetOrdersQuery)
export class GetOrdersQueryHandler implements IQueryHandler<
  GetOrdersQuery,
  OrderReadModel[]
> {
  constructor(private readonly orderReadRepo: OrderReadRepository) {}

  async execute(query: GetOrdersQuery): Promise<OrderReadModel[]> {
    return this.orderReadRepo.findByUserId(query.userId, query.status);
  }
}
