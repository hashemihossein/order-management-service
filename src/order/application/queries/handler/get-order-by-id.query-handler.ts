import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { NotFoundException } from '@nestjs/common';
import { GetOrderByIdQuery } from '../get-order-by-id.query';
import { OrderReadRepository } from '../../ports/order-read.repository';
import { OrderReadModel } from 'src/order/domain/read-models/order.read-model';

@QueryHandler(GetOrderByIdQuery)
export class GetOrderByIdQueryHandler implements IQueryHandler<
  GetOrderByIdQuery,
  OrderReadModel
> {
  constructor(private readonly orderReadRepo: OrderReadRepository) {}

  async execute(query: GetOrderByIdQuery): Promise<OrderReadModel> {
    const order = await this.orderReadRepo.findById(query.orderId);
    if (!order) {
      throw new NotFoundException(`Order with id ${query.orderId} not found`);
    }
    return order;
  }
}
